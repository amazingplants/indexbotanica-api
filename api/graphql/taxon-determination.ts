import { arg, extendType, objectType, list, stringArg, nonNull } from 'nexus'

export interface TaxonDeterminationSourceType {
  id: string,
  determined_by: string,
  determined_on: Date,
  taxon_id: string,
  accession_id: string
}

export const TaxonDetermination = objectType({

  name: 'TaxonDetermination', 

  sourceType: {
    module: __filename,
    export: 'TaxonDeterminationSourceType'
  },

  definition(t) {

    t.nonNull.string('id')
    t.nonNull.string('determined_by') 
    t.nonNull.date('determined_on') 

    t.field('taxon', { 
      type: nonNull('Taxon'),
      resolve: (root, args, ctx) => ctx.db.taxa.findUnique({ where: { id: root.taxon_id }}),
    })

    t.field('accession', { 
      type: nonNull('Accession'),
      resolve: (root, args, ctx) => ctx.db.accessions.findUnique({ where: { id: root.accession_id }}),
    })
  }
})



export const TaxonDeterminationQuery = extendType({
  type: 'Query',                         
  definition(t) {
    t.field('taxon_determination', {
      type: TaxonDetermination, 
      args: {
        id: stringArg()
      },
      resolve(_root, args, ctx) {
        return ctx.db.taxon_determinations.findUnique({where: { id: args.id }})
      }
    })
    t.list.field('taxon_determinations', {
      type: TaxonDetermination,
      resolve(_root, _args, ctx) {
        return ctx.db.taxon_determinations.findMany()
      },
    })
  },
})

