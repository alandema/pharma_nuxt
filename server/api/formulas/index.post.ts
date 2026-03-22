import { normalizeText } from '../../utils/inputNormalization';

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const name = normalizeText(body.name, { titleCase: true })

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nome da fórmula é obrigatório',
    });
  }

  //check if formula with same name already exists
  const existingFormula = await prisma.formulas.findUnique({
    where: {
      name: name,
    },
  })

  if (existingFormula) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A fórmula com esse nome já existe',
    });
  }

  const formula = await prisma.formulas.create({
    data: {
      name: name,
      information: body.information,
    },
  })
  return {
    id: formula.id,
    name: formula.name,
    information: formula.information,
  }
})