import { arg, nonNull, extendType, objectType, inputObjectType, list, stringArg } from 'nexus'
import generatePasswordHash from '../generate-password-hash'
import { sign, verify, decode } from 'jsonwebtoken'
import mailService from '../mail-service'
import { ApolloError } from 'apollo-server-errors'
// import { User } from './user'

export const messagePayload = objectType({
  name: "MessagePayload",
  definition(t) {
    t.nonNull.string("message")
    t.field("user", {
      type: "User"
    })
  },
})

export const accountInputType = inputObjectType({
  name: 'AccountInputType',
  definition(t) {
    t.nonNull.string('name'),
    t.string('namespace')
  },
})

export const SignupMutation = extendType({
    type: 'Mutation',                         
    definition(t) {
  
      t.field("signup", {
        type: "MessagePayload",
        args: {
          account: nonNull(arg({ type: "AccountInputType" })),
          first_name: nonNull(stringArg()),
          last_name: nonNull(stringArg()),
          email: nonNull(stringArg()),
          password: nonNull(stringArg())
        },
        resolve: async (_, args, ctx) => {
          try {
            const userExists = await ctx.db.users.findUnique({ where: { email_lower: args.email.toLowerCase() } })
            if (userExists) {
              throw new Error(`A user already exists with the email ${args.email}`)
            }
            let accountNamespace
            if(args.account.namespace && args.account.namespace.split(".").length > 1) {
              accountNamespace = args.account.namespace.toLowerCase().split(".").reverse().join(".")
            } else {
              accountNamespace = process.env.DEFAULT_ACCOUNT_NAMESPACE!
            }
            const hashedPassword = await generatePasswordHash(args.password)
            const user = await ctx.db.users.create({
              data: {
                first_name: args.first_name,
                last_name: args.last_name,
                hashed_password: hashedPassword,
                email: args.email,
                email_lower: args.email.toLowerCase(),
                account: {
                  create: {
                    name: args.account.name,
                    namespace: accountNamespace
                  }
                }
              }
            })

            const activationToken = sign(
              {
                action: 'ACTIVATE_USER',
                user_id: user.id
              },
              process.env.JWT_USER_ACTIVATION_SECRET!,
              {
                expiresIn: "1d",
              }
            );
            const html = mailService.activationEmail(activationToken)
            await mailService.sendEmail(
              process.env.EMAIL_FROM!,
              user.email,
              "Active your Index Botanica account",
              html
            );
            return {
              user,
              message: `We've sent an email to ${user.email}. Please click the button in the email to activate your account.`,
            };
          } catch (error) {
            throw new Error(error.message);
          }
        },
      })

      t.field("activateAccount", {
        type: "MessagePayload",
        args: {
          token: nonNull(stringArg()),
        },
        resolve: async (_, { token }, ctx) => {
          let action, user_id
          try {
            const decoded = verify(token, process.env.JWT_USER_ACTIVATION_SECRET!);
            ({ action, user_id } = decode(token) as {
              action: string
              user_id: string
            })
            if(action !== "ACTIVATE_USER") {
              throw new ApolloError('Activation token invalid', 'INVALID_TOKEN')
            }
          } catch(e) {
            throw new ApolloError('Activation token invalid', 'INVALID_TOKEN')
          }
          const user = await ctx.db.users.findUnique({where: { id: user_id }})
          if(user && user.activated_at) {
            throw new ApolloError('Your account is already active', 'ALREADY_ACTIVATED')
          }
          if(user) {
            await ctx.db.users.update({
              where: {
                id: user_id,
              },
              data: {
                activated_at: new Date()
              }
            })
            return {
              message: "We've activated your account.",
              user
            }  
          } else {
            throw new ApolloError('Activation token invalid', 'INVALID_TOKEN')
          }
        },
      });
    },
  })
  
  