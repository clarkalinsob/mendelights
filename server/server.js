const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        hello: String
        hi: String
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello Wodddrld!',
        hi: () => 'Hi'
    }
};
const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.get('/', (req, res) => {
    res.send('Sample docker');
});

const port = 80;
app.listen(port, () => console.log(`Server started on PORT ${port}`));
