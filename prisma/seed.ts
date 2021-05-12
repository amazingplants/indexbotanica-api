import { PrismaClient } from '@prisma/client'
import { NoUnusedVariablesRule } from 'graphql'
const prisma = new PrismaClient()

async function main() {
  const account = await prisma.accounts.create({
    data: {
      name: 'Foundation',
      namespace: 'com.amazingplants'
    }
  })

  const user1 = await prisma.users.create({
    data: {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'user1@indexbotanica.com',
      hashed_password: "secrethash",
      account_id: account.id
    }
  })

  const base = await prisma.bases.create({
    data: {
      name: 'Botanical Garden',
      namespace: 'com.amazingplants.jpe',
      slug: 'jpe',
      accession_number_format: '{{ year }}{{ year_index | pad: 4 }}',
      specimen_number_format: '{{ accession.number }}{{ qualifier }}',
      account_id: account.id
    }
  })

  const locationGarden = await prisma.locations.create({
    data: {
      name: 'Garden',
      parent_id: null,
      base_id: base.id
    }
  })

  const locationConservatory = await prisma.locations.create({
    data: {
      name: 'Conservatory',
      parent_id: locationGarden.id,
      base_id: base.id
    }
  })

  const locationBed = await prisma.locations.create({
    data: {
      name: 'Tropical Bed',
      parent_id: locationConservatory.id,
      base_id: base.id
    }
  })

  const locationPond = await prisma.locations.create({
    data: {
      name: 'Pond',
      parent_id: locationConservatory.id,
      base_id: base.id
    }
  })

  const nameCyrtosperma = await prisma.names.create({
    data : {
      scientific_name: 'Cyrtosperma johnstonii',
      family: 'Araceae',
      genus: 'Cyrtosperma',
      specific_epithet: 'johnstonii',
      taxon_rank: 'species',
      base_id: base.id
    }
  })

  const nameAlocasia = await prisma.names.create({
    data : {
      scientific_name: 'Alocasia johnstonii',
      family: 'Araceae',
      genus: 'Alocasia',
      specific_epithet: 'johnstonii',
      taxon_rank: 'species',
      base_id: base.id
    }
  })

  const nameHeliconia = await prisma.names.create({
    data : {
      scientific_name: 'Heliconia rostrata',
      family: 'Heliconiaceae',
      genus: 'Heliconia',
      specific_epithet: 'rostrata',
      taxon_rank: 'species',
      base_id: base.id
    }
  })

  const taxonCyrtosperma = await prisma.taxa.create({
    data: {
      base_id: base.id,
      name_id: nameCyrtosperma.id,
      taxa_names: {
        create: [{
          name_id: nameCyrtosperma.id,
          status: 'accepted',
          base_id: base.id
        }, {
          name_id: nameAlocasia.id,
          status: 'synonym',
          base_id: base.id
        }
      ]
      }
    }
  })

  const taxonHeliconia = await prisma.taxa.create({
    data: {
      base_id: base.id,
      name_id: nameHeliconia.id,
      taxa_names: {
        create: [{
          name_id: nameHeliconia.id,
          status: 'accepted',
          base_id: base.id
        }]
      }
    }
  })

  const accessionCyrtosperma1 = await prisma.accessions.create({
    data: {
      number: "20200001",
      index: 1,
      year_index: 1,
      taxon_id: taxonCyrtosperma.id,
      accessioned_on: new Date("2020-05-08"),
      base_id: base.id,
      created_at: new Date("2020-05-08 12:34:56"),
      specimens: {
        create: [{
          qualifier: "A",
          quantity: 1,
          location_id: locationPond.id,
          base_id: base.id
        }]
      }
    }
  })

  const accessionHeliconia = await prisma.accessions.create({
    data: {
      number: "20210001",
      index: 2,
      year_index: 1,
      taxon_id: taxonHeliconia.id,
      accessioned_on: new Date("2021-01-23"),
      base_id: base.id,
      created_at: new Date("2021-01-23 01:23:45"),
      specimens: {
        create: [{
          qualifier: "A",
          quantity: 1,
          location_id: locationBed.id,
          base_id: base.id
        }, {
          qualifier: "B",
          quantity: 1,
          location_id: locationBed.id,
          base_id: base.id
        }]
      }
    }
  })

  const accessionCyrtosperma2 = await prisma.accessions.create({
    data: {
      number: "20210002",
      index: 3,
      year_index: 2,
      taxon_id: taxonCyrtosperma.id,
      accessioned_on: new Date("2021-02-03"),
      base_id: base.id,
      created_at: new Date("2021-02-03 10:11:12"),
      specimens: {
        create: [{
          qualifier: "A",
          quantity: 1,
          location_id: locationPond.id,
          base_id: base.id
        },{
          qualifier: "B",
          quantity: 3,
          location_id: locationPond.id,
          base_id: base.id
        }]
      }
    }
  })


}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })