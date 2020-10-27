const express = require('express');
const { typeDefs, resolvers, myGraphQLSchema } = require('./src/config/schema');
const bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const PORT = 4000;
const app = express();

app.use('/graphql', bodyParser.json());

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});
apolloServer.applyMiddleware({ app });

const server = createServer(app);

server.listen(PORT, () => {
    new SubscriptionServer({
      execute,
      subscribe,
      schema: myGraphQLSchema,
    }, {
      server: server,
      path: '/subscriptions',
    });
    console.log('port :', 4000);
});