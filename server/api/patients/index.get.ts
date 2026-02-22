export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const where = user.role === 'admin' ? {} : { registered_by: user.userId };

  const patients = await prisma.patient.findMany({
    where,
    select: { id: true, name: true, cpf: true, user: { select: { username: true } } },
    orderBy: { name: 'asc' },
  });

  return patients;
})