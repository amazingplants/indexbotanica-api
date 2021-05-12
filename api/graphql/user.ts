import { arg, extendType, objectType, list, stringArg, nonNull } from 'nexus'

export interface UserSourceType {
  id: string,
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
  }
})


export const UserQuery = extendType({
  type: 'Query',                         
  definition(t) {
    t.field('user', {
      type: User, 
      args: {},
      resolve(_root, args, ctx) {
        // TODO
        return ctx.db.users.findFirst()
      }
    })
  },
})

