export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const patientId = query.patientId as string | undefined;

  const where = patientId ? { patient_id: patientId } : {};

  const [prescriptions, total] = await Promise.all([
    prisma.prescription.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date_prescribed: 'desc' },
      include: {
        patient: {
          select: { id: true, name: true }
        },
        user: {
          select: { id: true, username: true }
        }
      }
    }),
    prisma.prescription.count({ where })
  ]);

  return {
    prescriptions,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
});