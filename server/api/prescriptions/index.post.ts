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

  await prisma.log.create({ data: { event_time: new Date(), message: `Prescreveu para paciente`, user_id: user.userId, patient_id: body.patient_id } })

  return {
    id: prescription.id,
    patient_id: prescription.patient_id,
    date_prescribed: prescription.date_prescribed.toISOString().slice(0, 10),
  };
});