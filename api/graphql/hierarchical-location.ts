import { arg, extendType, inputObjectType, objectType, list, nonNull, stringArg } from 'nexus'
import path from 'path'

// This allows us to embed a Location without a LocationHierarchy field
export const HierarchicalLocation = objectType({
  name: 'HierarchicalLocation', 

  sourceType: {
    module: path.join(__dirname, 'location.ts'),
    export: 'LocationSourceType'
  },

  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('name') 
    t.string('parent_id')
  }
})
