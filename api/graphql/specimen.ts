import { arg, nonNull, extendType, inputObjectType, objectType, list, stringArg, booleanArg } from 'nexus'
import { AccessionsBoolInput } from './accession'
import { LocationsBoolInput } from './location'
import { StringComparisonInputType, IntComparisonInputType } from './input-types'

export const SpecimensRelationBoolInput = inputObjectType({
  name: 'SpecimensRelationBoolInput',
  definition(t) {
    t.field("some", { type: SpecimensBoolInput });
    t.field("none", { type: SpecimensBoolInput });
    t.field("every", { type: SpecimensBoolInput });
  },
})

export const SpecimensBoolInput = inputObjectType({
  name: 'SpecimensBoolInput',
  definition(t) {
    t.list.field("AND", { type: SpecimensBoolInput });
    t.field("NOT", { type: SpecimensBoolInput });
    t.list.field("OR", { type: SpecimensBoolInput });

    t.field('id', { type: StringComparisonInputType })
    t.field('qualifier', { type: StringComparisonInputType })
    t.field('quantity', { type: IntComparisonInputType })
    t.field('accession', { type: AccessionsBoolInput })
    t.field('location', { type: LocationsBoolInput })
  },
})

export interface SpecimenSourceType {
  id: string,
  qualifier: string,
  quantity: number,
  accession_id: string,
  location_id: string
}

export const Specimen = objectType({
  name: 'Specimen', 
  sourceType: {
    module: __filename,
    export: 'SpecimenSourceType'
  },
  definition(t) {

    t.nonNull.string('id')
    t.nonNull.string('qualifier') 
    t.int('quantity')

    t.nonNull.string('number', {
      resolve: async (root, args, ctx) => {
        const accession = await ctx.db.accessions.findUnique({ where: { id: root.accession_id }})
        return `${accession.number}${root.qualifier}`
      }
    })

    t.field('accession', { 
      type: nonNull('Accession'),
      resolve: (root, args, ctx) => ctx.db.accessions.findUnique({ where: { id: root.accession_id }}),
    })

    t.field('location', { 
      type: nonNull('Location'),
      resolve: (root, args, ctx) => ctx.db.locations.findUnique({ where: { id: root.location_id }}),
    })
  }
})


export const SpecimenQuery = extendType({
  type: 'Query',                         
  definition(t) {
    t.field('specimen', {
      type: 'Specimen', 
      args: {
        where: SpecimensBoolInput
      },
      resolve(_root, args, ctx) {
        return ctx.db.specimens.findFirst({where: args.where})
      }
    })
    t.list.field('specimens', {
      type: 'Specimen',
      args: {
        where: SpecimensBoolInput,
      },
      resolve(_root, args, ctx) {
        return ctx.db.specimens.findMany({where: args.where})
      },
    })
  },
})

