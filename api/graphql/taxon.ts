import { arg, extendType, objectType, list, stringArg, nonNull } from 'nexus'

export interface TaxonSourceType {
  id: string,
  flora_taxon_id: string,
  base_id: string,
  name_id: string
}

export const Taxon = objectType({
  name: 'Taxon', 

  sourceType: {
    module: __filename,
    export: 'TaxonSourceType'
  },

  definition(t) {

    t.nonNull.string('id')
    t.string('flora_taxon_id') 

    t.field('name', { 
      type: nonNull('Name'),
      resolve: (root, args, ctx) => ctx.db.names.findUnique({ 
        where: {
          id: root.name_id
        }
      })
    })

    t.list.field('synonyms', { 
      type: nonNull('Name'),
      resolve: async (root, args, ctx) => {
        const taxaNames = await ctx.db.taxa_names.findMany({
          where: { taxon_id: root.id, status: 'synonym' },
          select: {
            name: true
          }
        })
        return taxaNames.map((tn: any) => tn.name)
      }
    })

  }
})



export const TaxonQuery = extendType({
  type: 'Query',                         
  definition(t) {
    t.field('taxon', {
      type: Taxon, 
      args: {
        id: stringArg()
      },
      resolve(_root, args, ctx) {
        return ctx.db.taxa.findUnique({where: { id: args.id }})
      }
    })
    t.list.field('taxa', {
      type: Taxon,
      resolve(_root, _args, ctx) {
        return ctx.db.taxa.findMany()
      },
    })
  },
})

