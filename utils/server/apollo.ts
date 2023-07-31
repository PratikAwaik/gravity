import { ApolloServer } from "@apollo/server";
import { executableSchema } from "../../graphql";
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { context } from "../../graphql/context";

const server = new ApolloServer({
    schema: executableSchema,
    // context: context,
    csrfPrevention: true,
    // cors: {
    //     origin: "*",
    //     credentials: true,
    // },
    cache: "bounded",
    // plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

export default startServerAndCreateNextHandler(server, {
    context: context as any
});
