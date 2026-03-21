export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);
  
  // Strip disabled fields to prevent overriding
  const { cpf, email, password, specialties, council, council_number, council_state, role, is_active, id, ...allowedUpdates } = body;

  const updated = await prisma.user.update({
    where: { id: user.userId },
    data: {
      ...allowedUpdates,
      send_email: typeof body.send_email === 'boolean' ? body.send_email : true,
      birth_date: body.birth_date ? new Date(body.birth_date) : null
    }
  })

  return updated;
});