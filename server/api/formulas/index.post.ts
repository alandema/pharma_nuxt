export default defineEventHandler(async (event) => {
  const body = await readBody(event)


  // strip formula name and put name into Title Case format

  const name = body.name.trim().toLowerCase().split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

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