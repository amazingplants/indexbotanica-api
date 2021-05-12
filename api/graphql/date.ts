//import { GraphQLDateTime } from 'graphql-iso-date'
import { DateResolver } from 'graphql-scalars'
import { asNexusMethod } from 'nexus'

export const Date = asNexusMethod(DateResolver, 'date', 'Date')