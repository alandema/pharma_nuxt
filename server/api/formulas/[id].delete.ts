export default defineEventHandler(async (event) => {

  //delete formula
  await prisma.formulas.delete({
    where: {
      id: event.context.params?.id,
    },
  })
  return { deleted: true }
})