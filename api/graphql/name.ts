import { arg, nonNull, enumType, extendType, objectType, stringArg } from 'nexus'

export interface NameSourceType {
  id: string,
  flora_name_id: string,
  scientific_name: string,
  name_according_to: string,
  name_published_in: string,
  name_published_in_year: number,
  family: string,
  genus: string,
  subgenus: string,
  specific_epithet: string,
  infraspecific_epithet: string,
  name_authorship: string,
  taxon_remarks: string,
  taxon_rank: string,
  aggregate: string,
  microspecies: string,
  subspecies: string,
  variety: string,
  subvariety: string,
  form: string,
  subform: string,
  group: string,
  cultivar: string,
}

export const TaxonRank = enumType({
  name: 'TaxonRank',
  members: ['species', 'microspecies', 'subspecies', 'variety', 'subvariety', 'form', 'subform', 'group', 'cultivar']
})
 

export const Name = objectType({
  name: 'Name', 
  sourceType: {
    module: __filename,
    export: 'NameSourceType'
  },
  definition(t) {

    t.nonNull.string('id')
    t.string('flora_name_id') 
    t.string('scientific_name')
    t.string('name_according_to')
    t.string('name_published_in')
    t.int('name_published_in_year')
    t.string('family')
    t.string('genus')
    t.string('subgenus')
    t.string('specific_epithet')
    t.string('infraspecific_epithet')
    t.string('name_authorship')
    t.string('taxon_remarks')
    t.field('taxon_rank', { type: 'TaxonRank' })
    t.string('aggregate')
    t.string('microspecies')
    t.string('subspecies')
    t.string('variety')
    t.string('subvariety')
    t.string('form')
    t.string('subform')
    t.string('group')
    t.string('cultivar')
  }
})


export const NameQuery = extendType({
  type: 'Query',                         
  definition(t) {
    t.field('name', {
      type: 'Name', 
      args: {
        id: stringArg()
      },
      resolve(_root, args, ctx) {
        return ctx.db.names.findUnique({where: { id: args.id }})
      }
    })
    t.list.field('names', {
      type: 'Name',
      resolve(_root, _args, ctx) {
        return ctx.db.names.findMany()
      },
    })
  },
})

