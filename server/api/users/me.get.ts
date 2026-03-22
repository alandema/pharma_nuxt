import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

const config = useRuntimeConfig()
const JWT_SECRET = config.jwtSecret

export default defineEventHandler(async (event) => {

    const token = getCookie(event, 'AccessToken'); // Get the 'token' cookie

    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Não Autorizado'
        });
    }

    let decoded: JwtPayload;

    try {
        decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    } catch (err) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Não Autorizado'
        });
    }

    const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            omit:{
                password_hash: true,
            }
        })
    if (user){
        if (user.birth_date) {
            user.birth_date = <any> new Date(user.birth_date).toISOString().split('T')[0]
        }
    }
    return user;
})