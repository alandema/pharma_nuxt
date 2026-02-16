export default defineEventHandler(async (event) => {
  const prescription = await prisma.prescription.findUnique({
    where: {
      id: event.context.params?.id,
    },
    include: {
      patient: true,
      user: {
        select: { id: true, username: true }
      }
    },
  });
  
  return prescription;
});