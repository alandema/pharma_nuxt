import { requireAdminLikeUser } from '../../../utils/rbac';

export default defineEventHandler(async (event) => {
  requireAdminLikeUser(event);
  const query = getQuery(event);
  const rawQuery = Array.isArray(query.q) ? query.q[0] : query.q;
  const search = typeof rawQuery === 'string' ? rawQuery.trim() : '';
  const rawLimit = Array.isArray(query.limit) ? query.limit[0] : query.limit;
  const requestedLimit = Number(rawLimit);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(50, Math.max(1, Math.trunc(requestedLimit)))
    : 20;

  return prisma.user.findMany({
    where: {
      role: { in: ['user', 'admin'] },
      ...(search
        ? { full_name: { contains: search, mode: 'insensitive' as const } }
        : {}),
    },
    select: { id: true, full_name: true },
    orderBy: { full_name: 'asc' },
    take: limit,
  });
});
