import bcrypt from "bcryptjs";
import { validateCredentials } from '../../../utils/credentials';

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { username, password, role = 'prescritor' } = body;
  const errorMessage = validateCredentials(username, password)
  if (errorMessage) {
    throw createError({
      statusCode: 400,
      statusMessage: errorMessage
    });
  }
  if (role !== 'prescritor' && role !== 'admin') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid role' })
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
      username,
      password_hash: hash,
      role,
    },
  });

  console.log('User created:', username, 'role:', role);
  
  return {
    success: true,
    message: 'User created successfully',
    userId: user.id
  };
})