import { ApolloServer } from "@apollo/server";
import { executableSchema } from "../../graphql";
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { context } from "../../graphql/context";

const server = new ApolloServer({
  schema: executableSchema,
  csrfPrevention: true,
  cache: "bounded",
});

export default startServerAndCreateNextHandler(server, {
  context: context as any
});
