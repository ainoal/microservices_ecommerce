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
const cart1 = new Cart(1);
/***********************/

/*import { createYoga } from "graphql-yoga";
import { createServer } from 'http';
import { PubSub } from "graphql-subscriptions";
import Order from "./Order.js";
const pubSub = new PubSub();*/
const {ApolloServer, gql} = require('apollo-server'); 
const Order= require("./Order");


class OrderManagementService {
    constructor() {    // maybe also authorization?
        this.orders = [];
    }

    trackOrder(orderID) {   // TODO: ERROR HADLING
        return this.orders.find((order) => order.orderID == orderID);
    }

    createOrder(cart) {     // TODO: Also "owner" later when authorization service is implemented
        const orderID = this.orders.length + 1;
        const order = new Order(orderID, cart, "Pending");
        this.orders.push(order);
        pubSub.publish("order_created", {orderCreated: order});
        return order;
    }

    updateOrder(orderID, newStatus) {
        const order = this.orders.find((order) => order.orderID == orderID);
        if (!order) {
            console.log(`Order ${orderID} not found!`);
        } else {
            order.status = newStatus;
            if (newStatus == "cancelled") {
                pubSub.publish("order_cancelled", { orderCancelled: order });
            } else {
                pubSub.publish("order_updated", { orderUpdated: order });
            }
        }
    }
}

const orderManagementService = new OrderManagementService;

const typeDefs = gql`
  schema {
    query: Query
  }

  type Query {
    greeting: String
  }
`;

// Resolvers: https://www.apollographql.com/docs/apollo-server/data/resolvers/
// https://www.apollographql.com/tutorials/fullstack-quickstart/04-writing-query-resolvers
// https://www.apollographql.com/tutorials/fullstack-quickstart/05-writing-mutation-resolvers
// https://www.apollographql.com/docs/apollo-server/data/subscriptions/
/*const resolvers = {
    Query: {
        trackOrder: (parent, { orderID }) => {
            return orderManagementService.trackOrder(orderID);
        }
    },
    Mutation: {
        createOrder: (parent, { cart }) => {
            orderManagementService.createOrder(cart);
            return 0;
        },
        updateOrder: (parent, { orderID, newStatus }) => {
            orderManagementService.updateOrder(orderID, newStatus);
            return 0;
        }
    },
    Subscription: {
        orderCreated: {
            subscribe: () => pubSub.asyncIterator("order_created"),
        },
        orderCancelled: {
            subscribe: () => pubSub.asyncIterator("order_cancelled"),
        },
        orderUpdated: {
            subscribe: () => pubSub.asyncIterator("order_updated"),
        }
    }
}*/

// Resolver function to return the data. 
// It has to match our type definitions
const resolvers = {
    Query: {
      greeting: () => 'Hello GraphQL world!👋'
    }
  }

/*const yoga = createYoga( { resolvers } );
const server = createServer();*/

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
/*setTimeout(() => {
    console.log('Waited 30 seconds');
    let order = orderManagementService.createOrder(cart1);
    console.log(order);
  }, 30000);*/

