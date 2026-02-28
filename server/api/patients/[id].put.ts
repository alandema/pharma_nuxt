export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const where: any = { id: event.context.params?.id };
  if (user.role !== 'admin') {
    where.registered_by = user.userId;
  }

  const body = await readBody(event)
  const birthDate = body.birth_date ? new Date(`${body.birth_date}T00:00:00.000Z`) : null
  const patient = await prisma.patient.update({
    where,
    data: {
      name: body.name,
      rg: body.rg,
      gender: body.gender,
      cpf: body.cpf,
      birth_date: birthDate,
      phone: body.phone,
      zipcode: body.zipcode,
      street: body.street,
      district: body.district,
      house_number: body.house_number,
      additional_info: body.additional_info,
      country: body.country,
      state: body.state,
      city: body.city,
      medical_history: body.medical_history,
    },
  })
  await prisma.log.create({ data: { event_time: new Date(), message: `Editou paciente: ${patient.name}`, user_id: user.userId, patient_id: patient.id } })

  return {
    id: patient.id,
    name: patient.name,
    cpf: patient.cpf,
  }
})