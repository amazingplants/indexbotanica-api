import { arg, extendType, objectType, list, stringArg, nonNull } from 'nexus'

export interface UserSourceType {
  id: string,
  account_id: string,
  first_name: string,
  last_name: string,
  email: string
}

export const User = objectType({
  name: 'User', 

  sourceType: {
    module: __filename,
    export: 'UserSourceType'
  },

  definition(t) {

    t.nonNull.string('id')
    t.string('first_name') 
    t.string('last_name') 
    t.string('email') 

    t.field('account', { 
      type: nonNull('Account'),
      resolve: (root, args, ctx) => ctx.db.accounts.findUnique({ where: { id: root.account_id }}),
    })

  }
})


export const UserQuery = extendType({
  type: 'Query',                         
  definition(t) {
    t.field('currentUser', {
      type: User, 
      args: {},
      resolve: async (parent, args, ctx) => {
        return ctx.currentUser
      },
    })

  }
})

