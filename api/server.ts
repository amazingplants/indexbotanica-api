import { ApolloServer } from "apollo-server-koa"
import { context } from './context'
import { schema } from './schema'
import graphiqlExplorer from 'koa-graphiql-explorer'
import Koa from "koa"

const server = new ApolloServer({ 
  schema,
  context,
  playground: false,
})

export const app = new Koa()
  
app.use(graphiqlExplorer({
  mountPoint: "/graphiql",
  graphqlEndpoint: "/graphql", 
  defaultQuery: ``
}))

server.applyMiddleware({ app })

const port: Number = (process.env.PORT ? +process.env.PORT : 4000)

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
)

