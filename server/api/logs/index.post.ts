export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  await prisma.log.create({
    data: {
      event_time: new Date(),
      message: body.message,
      user_id: body.user_id || null,
      patient_id: body.patient_id || null,
    }
  })
  return { success: true }
})