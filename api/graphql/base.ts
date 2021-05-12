import { arg, extendType, objectType, list, stringArg, nonNull } from 'nexus'

export interface BaseSourceType {
  id: string,
  name: string,
  slug: string,
  namespace: string,
  accession_number_format: string,
  specimen_number_format: string
}

export const Base = objectType({
  name: 'Base', 

  sourceType: {
    module: __filename,
    export: 'BaseSourceType'
  },

  definition(t) {

    t.nonNull.string('id')
    t.string('name') 
    t.string('slug') 
    t.string('namespace') 
    t.string('accession_number_format') 
    t.string('specimen_number_format') 
  }
})


export const BaseQuery = extendType({
  type: 'Query',                         
  definition(t) {
    t.field('base', {
      type: Base, 
      args: {
        id: stringArg(),
        slug: stringArg()
      },
      resolve(_root, args, ctx) {
        if([args.slug, args.id].filter(a => !!a).length === 0) {
          throw new Error('`id` or `slug` must be provided')
        }
        // TODO 
        return ctx.db.bases.findFirst({where: { id: args.id, slug: args.slug}})
      }
    }),

    t.list.field('bases', {
      type: 'Base',
      resolve(_root, _args, ctx) {
        // TODO
        return ctx.db.bases.findMany()
      },
    })

  },
})

