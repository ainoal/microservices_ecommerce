/**** FOR TESTING ******/
class Cart {
    constructor(cartID) {
        this.cartID = cartID;
        this.items = [];
        this.quantityInCart = [];
    }
}
/***********************/

const express = require("express");
const bodyParser = require("body-parser");
const amqp = require('amqplib');
const Order = require("./Order");

class OrderManagementService {
    constructor() {    // maybe also authorization?
        this.orders = [];

        // Connect to the AMQP server and create a channel for publish-subscribe
        // communication
        this.connection = amqp.connect('amqp://localhost').then(connection => {
            return connection.createChannel().then(channel => {
                this.channel = channel;
                const exchange = 'order_created';
                return channel.assertExchange(exchange, 'fanout', { durable: false });
            });
        }).then(() => {
            return this;
        });
    }


    trackOrder(orderID) {
        const order = this.orders.find((order) => order.orderID == orderID);
        return order ? order : null;
    }

    createOrder(cart) {
        const orderID = this.orders.length + 1;
        const exchange = 'order_created';
        const order = new Order(orderID, cart, "Created");
        this.orders.push(order);
        const message = JSON.stringify(order);
        this.channel.publish(exchange, '', Buffer.from(message));
        return order;
    }

    updateOrder(orderID, newStatus) {
        const order = this.orders.find((order) => order.orderID == orderID);
        if (!order) {
            console.log(`Order ${orderID} not found!`);
        } else {
            order.status = newStatus;
            if (newStatus == "cancelled") {
                this.channel.publish("order_cancelled", { orderCancelled: order });
            } else {
                this.channel.publish("order_updated", { orderUpdated: order });
            }
        }
    }
}

// RESTful API
const app = express();
const port = 5000;

// Parse incoming requests
app.use(bodyParser.json());

var orderManagement = new OrderManagementService();

app.get("/orders/:ID", (req, res) => {
    const orderTracked = orderManagement.trackOrder(req.params.ID);
    if (orderTracked) {
        res.send((JSON.stringify(orderTracked.status)));
    } else {
        res.status(404).send(JSON.stringify("Invalid order number"));
    }
});

// Create order
app.get("/create/:cart", (req, res) => {
    const order = orderManagement.createOrder(req.params.cart);
    console.log(order);
    res.send(JSON.stringify(`Order with ID ${order.orderID} created`));
});

// Update order
app.put("/update/:data", (req, res) => {
    const orderID = req.body.data[1];
    const newStatus = req.body.data[2];
    orderManagement.updateOrder(orderID, newStatus);
    res.send(JSON.stringify("Order updated"));
});

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
    console.log('Waited 10 seconds');
    const cart1 = new Cart(1);
    orderManagement.createOrder(cart1).then((order) => {
        console.log(order);
    });
}, 10000);*/

// Listen for incoming requests
try {
    app.listen(port, () => {
        console.log(`Order management microservice listening on port ${port}`);
    });
} catch (error) {
    console.error(`${error}`);
}

orderManagement.connection.then(() => {
    const cart1 = new Cart(1);
    let order = orderManagement.createOrder(cart1);
    console.log(order);


}).catch((err) => {
    console.error(err);
});
  


