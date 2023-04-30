/* Payment microservice
 * 
 */

const express = require("express");
const bodyParser = require("body-parser");
const amqp = require("amqplib/callback_api");
//const Order = require("./Order");
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

    // TODO: Possibly set up method checkout() that is responsible
    // for the whole checkout process
    async checkout(price) {
        return new Promise((resolve, reject) => {
            const scriptToRun = "carddetails.js";
            const result = spawnSync('cmd.exe', ['/k', 'start', 'cmd.exe', 'node', scriptToRun], { input: validity, stdio: ['pipe', 'pipe', 'inherit'] });
            if (result.status !== 0) {
                console.error(`Child process exited with code ${result.status}`);
                process.exit(1);
            }
            const output = result.stdout.toString().trim();
            console.log(`Child process output: ${output}`);
            spawnSync('taskkill', ['/IM', 'cmd.exe', '/FI', 'Windowtitle'], { shell: true });
            //console.log(`Child process output: ${output}`);
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

