import { arg, extendType, objectType, list, stringArg, nonNull } from 'nexus'

export interface AccountSourceType {
  id: string,
  name: string,
  namespace: string
}

export const Account = objectType({
  name: 'Account', 

  sourceType: {
    module: __filename,
    export: 'AccountSourceType'
  },

  definition(t) {

    t.nonNull.string('id')
    t.string('name') 
    t.string('namespace') 
  }
})

