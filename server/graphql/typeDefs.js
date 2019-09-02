const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    token: String!
    createdAt: String!
    updatedAt: String!
  }

  type Food {
    id: ID!
    name: String!
    price: Float!
    createdAt: String!
    updatedAt: String!
  }

  type Order {
    id: ID!
    foods: [OrderedFoods]!
    totalCost: Float!
    deliveryDate: String
    status: String!
    paid: Boolean!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type OrderedFoods {
    name: String!
    quantity: Int!
    price: Float!
    cost: Float!
  }

  type DeliveryDate {
    id: ID!
    date: String!
    orders: [Order]!
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  input OrderInput {
    foods: [OrderFoodsInput]!
    totalCost: Float!
  }

  input OrderFoodsInput {
    name: String!
    quantity: Int!
    price: Float!
    cost: Float!
  }

  input DeliveryDateInput {
    date: String!
    orderIds: [ID]!
  }

  # input DeliveryDateOrdersInput {
  #   id: ID!
  # }

  type Query {
    # user queries
    getUsers: [User]

    # food queries
    getFoods: [Food]

    # order queries
    getOrders: [Order]
    getOrder(orderId: ID!): Order!
    getOrderHistory: [Order]

    # deliveryDate queries
    getDeliveryDates: [DeliveryDate]
  }

  type Mutation {
    # user mutations
    createUser(signupInput: SignupInput): User!
    signinUser(email: String!, password: String!): User!

    # food mutations
    createFood(name: String!, price: String!): Food!

    # order mutations
    createOrder(orderInput: OrderInput): Order!
    updateOrderStatus(orderId: ID!, status: String!): Order!
    togglePaymentStatus(orderId: ID!): Order!

    # deliveryDate mutations
    createDeliveryDate(deliveryDateInput: DeliveryDateInput): DeliveryDate!
  }
`;
