import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient(
  process.env.DEBUG
    ? {
        log: [
          {
            emit: 'event',
            level: 'query',
          },
          {
            emit: 'stdout',
            level: 'error',
          },
          {
            emit: 'stdout',
            level: 'warn',
          },
        ],
      }
    : undefined,
)

if(process.env.DEBUG) {
  db.$on('query', e => {
    console.log(e)
  })
}