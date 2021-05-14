import { applyMiddleware } from 'graphql-middleware'
import { makeSchema } from 'nexus'
import { join } from 'path'
import { middleware as getAuthenticatedUser } from './middleware/get-authenticated-user'
import * as types from './graphql'

const schemaWithoutMiddleware = makeSchema({
  types,
  outputs: {
    typegen: join(__dirname, '..', 'nexus-typegen.ts'), // 2
    schema: join(__dirname, '..', 'schema.graphql'), // 3
  },
})


export const schema = applyMiddleware(schemaWithoutMiddleware, getAuthenticatedUser)