import sgMail from '@sendgrid/mail';
import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

function generatePDFData(body: any, doctorName: string, patientName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      resolve(Buffer.concat(chunks).toString('base64'));
    });
    
    doc.fontSize(20).text('Prescription', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Doctor: ${doctorName}`);
    doc.text(`Patient: ${patientName}`);
    doc.moveDown();
    body.formulas.forEach((f: any) => {
      doc.text(`- Medication: ${f.formula_name}`);
      doc.text(`  Posology: ${f.posology}`);
      doc.moveDown();
    });
    doc.end();
  });
}

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody<{
    patient_id?: string;
    cid_code?: string;
    formulas?: { formula_id?: string; posology?: string }[];
  }>(event);

  const formulaItems = Array.isArray(body.formulas) ? body.formulas : [];

  if (!body.patient_id) {
    throw createError({ statusCode: 400, statusMessage: 'Paciente é obrigatório.' });
  }

  if (!body.cid_code) {
    throw createError({ statusCode: 400, statusMessage: 'CID é obrigatório.' });
  }

  if (formulaItems.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Adicione ao menos uma fórmula.' });
  }

  if (formulaItems.length > 10) {
    throw createError({ statusCode: 400, statusMessage: 'Máximo de 10 fórmulas por prescrição.' });
  }

  const hasInvalidFormulaItem = formulaItems.some((item: { formula_id?: string; posology?: string }) =>
    !item?.formula_id || !String(item.posology || '').trim()
  );

  if (hasInvalidFormulaItem) {
    throw createError({ statusCode: 400, statusMessage: 'Cada fórmula deve ter fórmula e posologia.' });
  }

  const normalizedFormulaItems = formulaItems.map((item: { formula_id?: string; posology?: string }) => ({
    formula_id: String(item.formula_id),
    posology: String(item.posology).trim(),
  }));

  const formulaIds = Array.from(new Set(normalizedFormulaItems.map((item) => item.formula_id)));
  const formulas = await prisma.formulas.findMany({
    where: { id: { in: formulaIds } },
    select: { id: true, name: true }
  });

  if (formulas.length !== formulaIds.length) {
    throw createError({ statusCode: 400, statusMessage: 'Uma ou mais fórmulas são inválidas.' });
  }

  const formulaMap = new Map(formulas.map((formula) => [formula.id, formula.name]));
  const formInfo = {
    cid_code: body.cid_code,
    formulas: normalizedFormulaItems.map((item) => ({
      formula_id: item.formula_id,
      formula_name: formulaMap.get(item.formula_id) || '',
      posology: item.posology,
    })),
  };

  const prescription = await prisma.prescription.create({
    data: {
      patient_id: body.patient_id,
      prescribed_by: user.userId,
      date_prescribed: new Date(),
      json_form_info: formInfo,
    },
  });

  const [prescriber, patient] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.userId } }),
    prisma.patient.findUnique({ where: { id: body.patient_id } })
  ]);

  if (prescriber && patient && process.env.SENDGRID_API_KEY) {
    const attachPDF = await generatePDFData(formInfo, prescriber.username, patient.name);
    
    const formulasHtml = formInfo.formulas.map(f => `<li><b>${f.formula_name}</b>: ${f.posology}</li>`).join('');
    
    // Email for the patient
    if (patient.email && patient.send_email) {
      const patientTemplatePath = path.resolve(process.cwd(), 'server/templates/prescription_patient.html');
      let patientHtml = fs.readFileSync(patientTemplatePath, 'utf-8');
      patientHtml = patientHtml.replace('{{patientName}}', patient.name)
                               .replace('{{doctorName}}', prescriber.username)
                               .replace('{{formulasList}}', formulasHtml);
                               
      await sgMail.send({
        to: patient.email,
        from: 'no-reply@pharmanext.com', 
        subject: 'Sua Nova Prescrição - Pharma Next',
        html: patientHtml,
        attachments: [
          {
            content: attachPDF,
            filename: `prescription-${prescription.id}.pdf`,
            type: 'application/pdf',
            disposition: 'attachment',
          },
        ],
      }).catch(e => console.error("SendGrid Error (Patient):", e.response?.body || e));
    }

    // Email for the prescriber (doctor)
    if (prescriber.email && prescriber.send_email) {
      const doctorTemplatePath = path.resolve(process.cwd(), 'server/templates/prescription_doctor.html');
      let doctorHtml = fs.readFileSync(doctorTemplatePath, 'utf-8');
      doctorHtml = doctorHtml.replace('{{patientName}}', patient.name)
                             .replace('{{doctorName}}', prescriber.username)
                             .replace('{{formulasList}}', formulasHtml);
                             
      await sgMail.send({
        to: prescriber.email,
        from: 'no-reply@pharmanext.com', 
        subject: 'Cópia Extra: Prescrição Salva - Pharma Next',
        html: doctorHtml,
        attachments: [
          {
            content: attachPDF,
            filename: `prescription-${prescription.id}.pdf`,
            type: 'application/pdf',
            disposition: 'attachment',
          },
        ],
      }).catch(e => console.error("SendGrid Error (Doctor):", e.response?.body || e));
    }
  }

  await prisma.log.create({ data: { event_time: new Date(), message: `Prescreveu para paciente`, user_id: user.userId, patient_id: body.patient_id } })

  return {
    id: prescription.id,
    patient_id: prescription.patient_id,
    date_prescribed: prescription.date_prescribed.toISOString().slice(0, 10),
  };
});