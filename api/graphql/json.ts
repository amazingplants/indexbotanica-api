//import GraphQLJSON from 'graphql-type-json'
import { JSONObjectResolver } from 'graphql-scalars'
import { asNexusMethod } from 'nexus'

export const Json = asNexusMethod(JSONObjectResolver, 'json', 'Json')