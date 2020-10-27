const { gql } = require('apollo-server');
const { mkdir } = require("fs");
const processUpload = require('../services/uploadFile');
const speechToText = require('../services/speechCloud');
const pubsub = require('../services/pubSub');
const { makeExecutableSchema } = require("graphql-tools");

const TEXT_GENERATED = 'TEXT_GENERATED';

const typeDefs = gql`
    type Query {
        hello: String
    }
    type Response {
        text: String!
    }
    type Mutation {
        uploadFile(file: Upload!): Response
    }
`;


const typeDefsSub = gql`
    type Query {
        hello: String
    }
    type Response {
        text: String!
    }
    type Subscription {
        textGenerated: Response
    }
`;


const resolvers = {
    Mutation: {
        uploadFile: async (parent, args) => {
            mkdir("audios", { recursive: true }, (err) => {
                if (err) throw err;
            });
            // Process upload
            await processUpload(args.file);
            speechToText().then(response => {
                pubsub.publish(TEXT_GENERATED, { textGenerated: {text: response} });
            });
            return {text: 'sent'};
        },
    },
};

const resolversSub = {
    Subscription: {
        textGenerated: {
          subscribe: () => pubsub.asyncIterator([TEXT_GENERATED]),
        },
      },
};

const myGraphQLSchema = makeExecutableSchema({typeDefs: typeDefsSub, resolvers: resolversSub})

module.exports = {
    typeDefs,
    resolvers,
    myGraphQLSchema,
}

