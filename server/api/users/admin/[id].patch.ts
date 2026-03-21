export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  const body = await readBody(event).catch(() => ({}))

  const user = await prisma.user.findUnique({ where: { id }, select: { is_active: true } })
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })

  const updateData: any = { ...body }
  delete updateData.id
  delete updateData.password
  delete updateData.username
  if (updateData.birth_date) {
    updateData.birth_date = new Date(updateData.birth_date)
  } else if (updateData.birth_date === '') {
    updateData.birth_date = null
  }
  
  if (body.send_email && !body.email) {
    console.log('Attempted to enable email notifications without providing an email address.') // Log the issue for debugging
    throw createError({ statusCode: 400, statusMessage: 'E-mail é obrigatório para receber notificações.' });
  }

  if (Object.keys(body).length === 0) {
    updateData.is_active = !user.is_active
  }
  console.log('Update data:', updateData) // Log the update data being sent to Prisma

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
  })

  return updated
})
