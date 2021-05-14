import { arg, nonNull, extendType, objectType, inputObjectType, list, stringArg, booleanArg } from 'nexus'
import { compare } from 'bcrypt'
import setUserSessionCookie from '../set-user-session-cookie'
import generateAuthToken from '../generate-auth-token'

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.nonNull.boolean("success")
    t.string("token")
    t.field("user", {
      type: "User"
    })
  }
})

export const LoginMutation = extendType({
  type: 'Mutation',                         
  definition(t) {

    t.nonNull.field('login', {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        cookie: nonNull(booleanArg())
      },

      resolve: async (_, args, ctx) => {
        const user = await ctx.db.users.findUnique({
          where: {
            email_lower: args.email.toLowerCase()
          }
        })
        /*if (!user) {
          throw new Error(`Email not found`)
        }*/

        const successfulLogin: boolean = user ? await compare(args.password, user.hashed_password) : false
        /*if (!passwordMatches) {
          throw new Error("Password incorrect")
        }*/

        const token: string | null = successfulLogin ? generateAuthToken(user) : null

        if(successfulLogin) {
          setUserSessionCookie(ctx, args.cookie ? token : null)
        }

        return {
          user,
          token,
          success: successfulLogin
        }
      }
    })
  }
})