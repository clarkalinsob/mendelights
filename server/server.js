const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const { MONGODB_LOCAL } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req }) });
const app = express();

server.applyMiddleware({ app });

app.use(cors());

app.get('/', (req, res) => {
  res.send('Sample docker');
});

const port = 4000;
mongoose.connect(MONGODB_LOCAL, { useNewUrlParser: true }).then(() => {
  console.log('MongoDB Connected');
  app.listen({ port }, () => console.log(`Server running on PORT ${port}`));
});
