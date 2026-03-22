import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

const config = useRuntimeConfig()
const JWT_SECRET = config.jwtSecret

export default defineEventHandler((event) => {

    console.log('Received request for /api/users/me')
    // get user info from cookie using prisma
    const token = getCookie(event, 'AccessToken'); // Get the 'token' cookie

    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized: No token provided'
        });
    }

    // Verify the token and extract user information
    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
        
        // Fetch fresh db state
        return prisma.user.findUnique({
            where: { id: decoded.userId }
        }).then(user => {
            if (!user) return null;
            const { password_hash, ...safeUser } = user;
            return safeUser;
        })
    } catch (err) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized: Invalid token'
        });
    }
})