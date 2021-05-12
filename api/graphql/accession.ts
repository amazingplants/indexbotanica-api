import { arg, nonNull, extendType, objectType, inputObjectType, list, stringArg } from 'nexus'
const dateArg = () => arg({ type: 'Date' })
const jsonArg = () => arg({ type: 'JSONObject' })
import { SpecimensRelationBoolInput } from './specimen'
import { StringComparisonInputType } from './input-types'
import liquid from '../liquid'

async function generateAccessionNumber(base: { id: string, accession_number_format: string }, data: { accessioned_on: Date, created_at: Date, year: number, year_index: number, index: number, data: object }) {
  return await liquid.parseAndRender(base.accession_number_format, data)
}

export const AccessionsRelationBoolInput = inputObjectType({
  name: 'AccessionsRelationBoolInput',
  definition(t) {
    t.field("some", { type: AccessionsBoolInput });
    t.field("none", { type: AccessionsBoolInput });
    t.field("every", { type: AccessionsBoolInput });
  },
})

export const AccessionsBoolInput = inputObjectType({
  name: 'AccessionsBoolExp',
  definition(t) {
    t.list.field("AND", { type: AccessionsBoolInput });
    t.field("NOT", { type: AccessionsBoolInput });
    t.list.field("OR", { type: AccessionsBoolInput });

    t.field('id', { type: StringComparisonInputType })
    t.field('number', { type: StringComparisonInputType })

    t.field('specimens', { type: SpecimensRelationBoolInput })
  },
})

export interface AccessionSourceType {
  id: string,
  number: string,
  index: number,
  data: object,
  year_index: number,
  accessioned_on: Date
  created_at: Date,
  taxon_id: string
}

export const Accession = objectType({

  name: 'Accession', 

  sourceType: {
    module: __filename,
    export: 'AccessionSourceType'
  },

  definition(t) {

    t.nonNull.string('id')
    t.nonNull.string('number') 
    t.nonNull.int('index')    
    t.nonNull.int('year_index')     
    t.nonNull.date('accessioned_on')
    t.nonNull.json('data')
    t.nonNull.date('created_at')

    t.field('taxon', { 
      type: nonNull('Taxon'),
      resolve: (root, args, ctx) => ctx.db.taxa.findUnique({ where: { id: root.taxon_id }}),
    })

    t.list.field('specimens', { 
      type: nonNull('Specimen'),
      resolve: (root, args, ctx) => ctx.db.specimens.findMany({ where: { accession_id: root.id }}),
    })

    t.list.field('taxon_determinations', { 
      type: nonNull('TaxonDetermination'),
      resolve: (root, args, ctx) => ctx.db.taxon_determinations.findMany({ where: { accession_id: root.id }}),
    })
  }

})



export const AccessionQuery = extendType({
  type: 'Query',                         // 2
  definition(t) {
    t.field('accession', {
      type: 'Accession', 
      args: {
        id: stringArg(),
        number: stringArg()
      },
      resolve(_root, args, ctx) {
        try {
          if([args.number, args.id].filter(a => !!a).length === 0) {
            throw new Error('`id` or `number` must be provided')
          }
          return ctx.db.accessions.findFirst({where: { id: args.id, number: args.number}})
        } catch(e) {
          return Promise.reject(e)
        }
      }
    })
    t.list.field('accessions', {
      type: 'Accession',
      args: {
        where: AccessionsBoolInput
      },
      resolve(_root, args, ctx) {
        return ctx.db.accessions.findMany({where: args.where})
      },
    })
  },
})


export const AccessionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createAccession', {
      type: 'Accession',
      args: {                                       
        accessioned_on: dateArg(),                 
        taxon_id: nonNull(stringArg()),
        data: jsonArg()
      },

      async resolve(_root, args, ctx) {
        console.log('args', args)
        const accessionedOn = args.accessioned_on ? new Date(args.accessioned_on) : new Date() 
        const base = await ctx.db.bases.findFirst()

        const maxIndexResult = await ctx.db.accessions.aggregate({
          max: { index: true },
          where: { base_id: base.id }
        })
        const nextIndex = ((maxIndexResult && maxIndexResult.max && maxIndexResult.max.index) || 0) + 1

        const accessionedOnYearStartDate: Date = new Date(Date.UTC(accessionedOn.getUTCFullYear(), 0, 1))
        const accessionedOnYearEndDate: Date = new Date(Date.UTC(accessionedOn.getUTCFullYear() + 1, 0, 1))
        const maxYearIndexResult = await ctx.db.$queryRaw`
          SELECT MAX(year_index) FROM accessions WHERE 
          base_id = ${base.id} AND 
          accessioned_on >= ${accessionedOnYearStartDate} AND 
          accessioned_on < ${accessionedOnYearEndDate}`
        const nextYearIndex = ((maxYearIndexResult && maxYearIndexResult[0] && maxYearIndexResult[0].max) || 0) + 1

        const createdAt = new Date()
        const accession = {
          accessioned_on: accessionedOn,
          number: await generateAccessionNumber(base, { accessioned_on: accessionedOn, year: accessionedOn.getUTCFullYear(), year_index: nextYearIndex, index: nextIndex, created_at: createdAt, data: args.data }),
          taxon: {
            connect: { id: args.taxon_id }
          },
          base: {
            connect: { id: base.id }
          },
          data: args.data,
          year_index: nextYearIndex,
          index: nextIndex,
          created_at: createdAt
        }

        return await ctx.db.accessions.create({
          data: accession
        })
      },
    })
  },
})
