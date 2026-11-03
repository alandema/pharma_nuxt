import { requireAuthenticatedUser } from '../../utils/rbac';

export default defineEventHandler(async (event) => {
  const user = requireAuthenticatedUser(event);
  const query = getQuery(event);
  const rawQuery = Array.isArray(query.q) ? query.q[0] : query.q;
  const search = typeof rawQuery === 'string' ? rawQuery.trim() : '';
  const rawLimit = Array.isArray(query.limit) ? query.limit[0] : query.limit;
  const requestedLimit = Number(rawLimit);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(50, Math.max(1, Math.trunc(requestedLimit)))
    : 20;

  const where = {
    ...(user.role !== 'admin' && user.role !== 'superadmin'
      ? { registered_by: user.userId }
      : {}),
    ...(search
      ? { name: { contains: search, mode: 'insensitive' as const } }
      : {}),
  };

  return prisma.patient.findMany({
    where,
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
    take: limit,
  });
});
