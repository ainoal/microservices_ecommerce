class Order {
    constructor(orderID, cart, status) {
        this.OrderID = orderID;
        this.cart = cart;
        //this.owner = owner;
        this.status = status;
    }
}

module.exports = Order;
