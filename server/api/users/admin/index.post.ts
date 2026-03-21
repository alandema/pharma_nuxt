import bcrypt from "bcryptjs";
import { validateCredentials } from '../../../utils/credentials';

export default defineEventHandler(async (event) => {
  const body = await readBody(event)


  const { username, password, role = 'prescritor', email, full_name, cpf, gender, birth_date, phone, professional_type, council, council_number, council_state, specialties, zipcode, street, address_number, complement, city, state } = body;
  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'E-mail é obrigatório' });
  }

  const errorMessage = validateCredentials(username, password)



  if (errorMessage) {
    throw createError({
      statusCode: 400,
      statusMessage: errorMessage
    });
  }
  if (role !== 'prescritor' && role !== 'admin') {
    throw createError({ statusCode: 400, statusMessage: 'Função inválida' })
  }

  const existing = await prisma.user.findUnique({ where: { username }, select: { id: true } });
  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Username already exists'
    });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username, password_hash: hash, email, send_email: true, role,
      full_name, cpf, gender, birth_date: birth_date ? new Date(birth_date) : null, phone,
      professional_type, council, council_number, council_state, specialties,
      zipcode, street, address_number, complement, city, state
    },
  });

  console.log('User created:', username, 'role:', role);
  
  return {
    success: true,
    message: 'User created successfully',
    userId: user.id
  };
})