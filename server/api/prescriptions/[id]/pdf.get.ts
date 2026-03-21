export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing ID' });
  }

  const prescription = await prisma.prescription.findUnique({
    where: { id },
    include: { patient: true, user: true }
  });

  if (!prescription) {
    throw createError({ statusCode: 404, statusMessage: 'Prescription not found' });
  }

  let formInfo = prescription.json_form_info;
  if (typeof formInfo === 'string') {
    try {
      formInfo = JSON.parse(formInfo);
    } catch {
      formInfo = { formulas: [] };
    }
  }

  const doctorName = prescription.user?.username || 'Unknown';
  const patientName = prescription.patient?.name || 'Unknown';

  const pdfBuffer = await generatePDFDocument(formInfo as any, doctorName, patientName);

  setResponseHeader(event, 'Content-Type', 'application/pdf');
  setResponseHeader(event, 'Content-Disposition', `inline; filename="prescription-${id}.pdf"`);

  return pdfBuffer;
});
