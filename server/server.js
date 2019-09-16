const { ApolloServer } = require('apollo-server');
// const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
// const { ApolloServer } = require('apollo-server-express');

const { MONGODB_LOCAL } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
  cors: { origin: '*', credentials: true },
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
  introspection: true,
  playground: true
});

// const app = express();

// server.applyMiddleware({ app });

// app.use(cors());

// app.get('/', (req, res) => {
//   res.send('Sample docker');
// });

const port = 5001;

mongoose
  .connect(MONGODB_LOCAL, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port });
  })
  .then(res => console.log(`Server running at ${res.url}`));
