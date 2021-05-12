import { prisma } from '@prisma/client'
import { arg, extendType, inputObjectType, objectType, list, nonNull, stringArg, intArg, booleanArg } from 'nexus'
import { StringComparisonInputType } from './input-types'
import { SpecimensRelationBoolInput } from './specimen'
import { normalizeQuery } from './helpers'

export interface LocationSourceType {
  id: string,
  name: string,
  parent_id: string
}

export const LocationsBoolInput = inputObjectType({
  name: 'LocationsBoolInput',
  definition(t) {
    t.list.field("AND", { type: LocationsBoolInput });
    t.field("NOT", { type: LocationsBoolInput });
    t.list.field("OR", { type: LocationsBoolInput });

    t.field('id', { type: StringComparisonInputType })
    t.field('name', { type: StringComparisonInputType })

    t.field('specimens', { type: SpecimensRelationBoolInput })
  },
})

export const Location = objectType({
  name: 'Location', 

  sourceType: {
    module: __filename,
    export: 'LocationSourceType'
  },

  definition(t) {

    t.nonNull.string('id')
    t.nonNull.string('name') 
    t.string('parent_id')

    t.list.field('locations_hierarchy', {
      type: 'HierarchicalLocation',
      resolve: (root, _args, ctx) => {
        return ctx.db.$queryRaw(`SELECT "locations".* FROM locations JOIN locations_tree ON (locations.id = locations_tree.parent_id) WHERE locations_tree.child_id = '${root.id}' ORDER BY locations_tree.depth DESC;`)
      }
    })

    t.list.field('specimens', { 
      type: nonNull('Specimen'),
      args: {
        includeSubLocations: booleanArg()
      },
      resolve: (async (root, args, ctx) => {
        if(args.includeSubLocations) {
          //return ctx.db.specimens.findMany({where: { location_id: root.id}})
          return ctx.db.$queryRaw(`SELECT "specimens".* FROM specimens JOIN locations_tree ON (specimens.location_id = locations_tree.child_id) WHERE locations_tree.parent_id = '${root.id}'`)
        } else {
          return ctx.db.specimens.findMany({where: { location_id: root.id}})
        }
      }),
    })

    t.field('specimens_count', { 
      type: nonNull('Int'),
      args: {
        includeSubLocations: booleanArg()
      },
      resolve: (async (root, args, ctx) => {
        if(args.includeSubLocations) {
          //return ctx.db.specimens.findMany({where: { location_id: root.id}})
          let countResult = await ctx.db.$queryRaw(`SELECT COUNT("specimens".*) FROM specimens JOIN locations_tree ON (specimens.location_id = locations_tree.child_id) WHERE locations_tree.parent_id = '${root.id}'`)
          return countResult[0].count
        } else {
          return ctx.db.specimens.count({where: { location_id: root.id}})
        }
      }),
    })
  }
})

type Conditions = {
  AND: any[]
}

export const LocationQuery = extendType({
  type: 'Query',                         
  definition(t) {
    t.field('location', {
      type: 'Location', 
      args: {
        id: stringArg(),
        name: stringArg()
      },
      resolve(_root, args, ctx) {
        if([args.name, args.id].filter(a => !!a).length === 0) {
          throw new Error('`id` or `name` must be provided')
        }
        return ctx.db.locations.findFirst({where: { id: args.id, name: args.name}})
      }
    })
    t.list.field('locations', {
      type: 'Location',
      args: {
        where: LocationsBoolInput,
      },
      resolve(_root, args, ctx) {
        console.log(normalizeQuery(args.where))
        return ctx.db.locations.findMany({where: normalizeQuery(args.where)})
      },
    })
  },
})

