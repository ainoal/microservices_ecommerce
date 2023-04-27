/* Payment microservice uses AMQP  
 * 
 */



const amqp = require("amqplib/callback_api");
const Order = require("./Order");

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

    validatePayment() {
        /* EXPLAIN HOW IT WOULD WORK IN A REAL APPLICATION */
        return 0;
    }

    processPayment() {
        const order = new Order(12, "7", "Placed");
        if (!order) {
            throw new Error(`Order ${this.orderID} not found`);
        }

        // TODO: communicate with order management microservice to
        // update order status. (paid/failed)

        return 0;
    }
}



