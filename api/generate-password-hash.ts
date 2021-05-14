import { hash } from 'bcrypt'

const generatePasswordHash = (password: string) => {
    if (password.length < 8) {
        throw new Error("Password should be 8 characters or longer")
    }
    return hash(password, 10)
}

export default generatePasswordHash