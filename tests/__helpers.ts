import getPort, { makeRange } from "get-port";
import { GraphQLClient } from "graphql-request";
import { app } from "../api/server";

type TestContext = {
  client: GraphQLClient;
};
export function createTestContext(): TestContext {
  let ctx = {} as TestContext;
  const graphqlCtx = graphqlTestContext();
  beforeEach(async () => {                                        
    const client = await graphqlCtx.before();
    Object.assign(ctx, {
      client,
    });
  });
  afterEach(async () => {                                        
    await graphqlCtx.after();
  });
  return ctx;                                                    
}
function graphqlTestContext() {
  let serverInstance: any = null
  return {
    async before() {
      const port = await getPort({ port: makeRange(4000, 6000) });  
      serverInstance = app.listen({ port });            
      return new GraphQLClient(`http://localhost:${port}`);     
    },
    async after() {
      serverInstance?.close();                             
    },
  };
}