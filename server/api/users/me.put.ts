export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);

  const updated = await prisma.user.update({
    where: { id: user.userId },
    data: {
      email: body.email || null,
      send_email: typeof body.send_email === 'boolean' ? body.send_email : true
    },
    select: { id: true, username: true, role: true, email: true, send_email: true }
  })

  return updated;
});