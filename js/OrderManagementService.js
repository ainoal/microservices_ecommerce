/*
*/

// GraphQL server and client reference:
// https://github.com/reymon359/graphql-hello-world-server

/**** FOR TESTING ******/
class Cart {
    constructor(cartID) {
        this.cartID = cartID;
        this.items = [];
        this.quantityInCart = [];
    }
}

/***********************/

const { ApolloServer, gql } = require('apollo-server');
const amqp = require('amqplib');
const Order = require("./Order");

const { executeSchema } = require('graphql');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub({ executeSchema });

class OrderManagementService {
  constructor() {
    this.orders = [];
  }

  trackOrder(orderID) {
    return "Success";
  }

  async createOrder(cart) {
    const orderID = this.orders.length + 1;
    const order = new Order(orderID, cart, "order_created");
    this.orders.push(order);

    const message = JSON.stringify(order);
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('order_created');
    channel.sendToQueue('order_created', Buffer.from(message));

    return order;
  }

  async updateOrder(orderID, newStatus) {
    const order = this.orders.find((order) => order.orderID == orderID);
    if (!order) {
      console.log(`Order ${orderID} not found!`);
    } else {
      order.status = newStatus;
      const message = JSON.stringify(order);
      const connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
      await channel.assertQueue(newStatus === "cancelled" ? 'order_cancelled' : 'order_updated');
      channel.sendToQueue(newStatus === "cancelled" ? 'order_cancelled' : 'order_updated', Buffer.from(message));
    }
  }

  helloWorld() {
    return "Hello GraphQL World!";
  }
}

const orderManagementService = new OrderManagementService;

const typeDefs = gql`
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

  type Order {
    orderID: ID!
    status: String!
    cart: String!
  }

  type Query {
    trackOrder(orderID: ID!): String!
    greeting: String
  }

  type Mutation {
    createOrder(cart: String!): Order
    updateOrder(orderID: ID!, newStatus: String!): Int
  }

  type Subscription {
    orderCreated: Order
    orderCancelled: Order
    orderUpdated: Order
  }
`;

const resolvers = {
  Query: {
    trackOrder: (orderID) => {
      return orderManagementService.trackOrder(orderID);
    },
    greeting: () => {
      return orderManagementService.helloWorld();
    }
  },

  Mutation: {
    createOrder: async (parent, { cart }) => {
      const order = await orderManagementService.createOrder(cart);
      return order;
    },
    updateOrder: async (parent, { orderID, newStatus }) => {
      const result = await orderManagementService.updateOrder(orderID, newStatus);
      return result;
    }
  },
  

  Subscription: {
    orderCreated: {
        subscribe: async (parent, args, { connection }) => {
          const channel = await connection.createChannel();
          await channel.assertQueue('order_created');
          await channel.consume('order_created', (message) => {
            const order = JSON.parse(message.content.toString());
            connection._subscriptions.forEach((sub) => {
              sub.next(order);
            });
          }, { noAck: true });
          return connection._subscriptions[connection._subscriptions.length - 1].asyncIterator();
        }
      },
      orderCancelled: {
        subscribe: async (parent, args, { connection }) => {
          const channel = await connection.createChannel();
          await channel.assertQueue('order_cancelled');
          await channel.consume('order_cancelled', (message) => {
            const order = JSON.parse(message.content.toString());
            connection._subscriptions.forEach((sub) => {
              sub.next(order);
            });
          }, { noAck: true });
          return connection._subscriptions[connection._subscriptions.length - 1].asyncIterator();
        }
      },
      orderUpdated: {
        subscribe: async (parent, args, { connection }) => {
          const channel = await connection.createChannel();
          await channel.assertQueue('order_updated');
          await channel.consume('order_updated', (message) => {
            const order = JSON.parse(message.content.toString());
            connection._subscriptions.forEach((sub) => {
              sub.next(order);
            });
          }, { noAck: true });
          return connection._subscriptions[connection._subscriptions.length - 1].asyncIterator();
        }
      },
    }
  };

  const server = new ApolloServer({typeDefs, resolvers});
  server.listen({port: 9000})
    .then(({url}) => console.log(`Order Management Microservice running at ${url}`));
  
  
  /* CHECKLIST:
   * When Order management publishes a change in order (order placed)
   * -> product catalog gets notification
   * 
   * When change in an order: order placed & successfull 
   * -> payment service gets notified
   * 
   * When any change in an order
   * -> auth service gets notified
  */
  
  /************** FOR TESTING ********************/
  setTimeout(() => {
      console.log('Waited 10 seconds');
      const cart1 = new Cart(1);
      orderManagementService.createOrder(cart1).then((order) => {
        console.log(order);
      });
    }, 10000);
