/* Payment microservice
 * 
 */


const express = require("express");
const bodyParser = require("body-parser");
const amqp = require("amqplib/callback_api");
//const Order = require("./Order");

class PaymentInfo {
    constructor(name, cardNumber, expirationDate, cvv) {
        this.name = name;
        this.cardNumber = cardNumber;
        this.expirationDate = expirationDate;
        this.cvv = cvv;
    }
}

class PaymentService {
    constructor(orderID, paymentInfo) {
        this.orderID = orderID;
        this.paymentInfo = paymentInfo;
    }

    // TODO: Possibly set up method checkout() that is responsible
    // for the whole checkout process
    checkout(price) {
        // Validate payment
        /*let cardValid = this.validatePayment;
        if (cardValid != 0) {
            console.log(cardValid);
            return -1;
        }
        // Process payment
        let paymentSuccessful = this.processPayment(price);
        if (paymentSuccessful != 0) {
            return -1;
        }
        console.log("woop woop");*/
        return 0;
    }
}

// RESTful API
const app = express();
const port = 4000;

// Parse incoming requests
app.use(bodyParser.json());

var paymentService= new PaymentService();

// Pay for the products
app.get("/checkout/:price", (req, res) => {
    const order = paymentService.checkout(req.params.price);
    if (order == 0) {
        res.send((JSON.stringify("Order successful")));
    } else {
        res.send(JSON.stringify("Order failed"));
    }
});

// Listen for incoming requests
try {
    app.listen(port, () => {
        console.log(`Payment microservice listening on port ${port}`);
    });
} catch (error) {
    console.error(`${error}`);
}

