/* Payment microservice
 * 
 */

const express = require("express");
const bodyParser = require("body-parser");
const amqp = require("amqplib/callback_api");
const { spawnSync } = require('child_process');

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

    async checkout(price) {
        return new Promise((resolve, reject) => {
            const scriptToRun = "paymentdetails.js";
            const child = spawnSync('cmd.exe', ['/c', 'start', '/wait', 'cmd.exe', '/c', 'node', scriptToRun], { stdio: ['pipe', '', 'inherit'] });

            resolve(0);
        });
    }

}

// RESTful API
const app = express();
const port = 4000;

// Parse incoming requests
app.use(bodyParser.json());

var paymentService= new PaymentService();

// Pay for the products
app.get("/checkout/:price", async (req, res) => {
    try {
        const order = await paymentService.checkout(req.params.price);
        res.send((JSON.stringify("Order successful")));
    } catch(error) {
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

