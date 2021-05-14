import { sign } from "jsonwebtoken"
import { users } from '@prisma/client'

export default function (user: users) {
    const token = sign(
        {
            action: 'USER_SESSION',
            userId: user.id,
        },
        process.env.JWT_AUTH_SECRET!,
        {
            expiresIn: "1h",
        }
    );
    return token
};