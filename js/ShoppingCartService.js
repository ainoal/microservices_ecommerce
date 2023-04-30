/* 
*/

// Resource for RESTful API calls: https://www.freecodecamp.org/news/rest-api-
// tutorial-rest-client-rest-service-and-api-calls-explained-with-code-examples/

// Promises: https://developer.mozilla.org/en-US/docs/Web/JavaScript/
// Reference/Global_Objects/Promise

// Async/await: https://javascript.info/async-await

//const express = require("express");
const fetch = require('node-fetch');
const Product = require("./Product");
const Order = require("./Order");

class Cart {
    constructor(cartID) {
        this.cartID = cartID;
        this.items = [];
        this.quantityInCart = [];
    }

    addItem(product, quantityToBuy) {
        // TODO: CHECK WHETHER ITEM ALREADY IN CART, IF YES, THEN JUST INCREASE THE QUANTITY
        this.items.push(product);
        this.quantityInCart.push(quantityToBuy);
    }

    removeItem(productID) {
        const idx = this.items.findIndex((item) => item.productID == productID);
        if (idx > -1) {
            this.items.splice(idx, 1);
            console.log(`${productID} removed from shopping cart`);
        } else {
            console.log(`${productID} not found in shopping cart`);
        }
    }

    getTotalCost() {
        let cost = 0;
        for (let i = 0; i < this.items.length; i++) {
            cost += this.items[i].price * this.quantityInCart[i];
        }
        // https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
        cost = Math.round((cost + Number.EPSILON) * 100) / 100;
        return cost;
    }
}

class ShoppingCartService {
    // TODO: REMOVE TESTCART AND IMPLEMENT BETTER CART MANAGEMENT
    constructor() {
        this.carts = [];
    }

    getCart(ID) {
        return this.carts.find((cart) => cart.cartID == ID);
    }

    // Create a new shopping cart
    createCart(cartID) {
        const cart = new Cart(cartID);
        this.carts.push(cart);
        console.log(`Cart with ID ${cartID} created`);
    }

    // Add products to cart
    addProductToCart(productID, quantity, cartID) {
        return new Promise((resolve, reject) => {
            // Send RESTful API request to product catalog microservice
            // to get information about the products in stock.
            fetch(`http://localhost:8000/products/${productID}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
        
                if (data == `Product ${productID} not found on catalog`) {
                    // If there are no products in stock, display an error message
                    console.log("No products available.");
                } else if (quantity > data.quantity) {
                    // Less products in stock than the requested amount
                    console.log(`There are only ${data.quantity} pcs of that product available`);
                } else {
                    // Add product to cart 
                    // (TODO: IMPROVE THIS BY CHECKING IF PRODUCT ID ALREADY IN CART
                    // AND HOW MANY OF IT WILL THEN BE IN THE CART)
                    const cart = this.carts.find((cart) => cart.cartID == cartID);
                    const product = new Product(data.productID, data.name, data.category, 
                        data.price, data.quantity);
                    cart.addItem(product, quantity);
                    console.log("Item added to cart");
                }
                resolve();
            })
            .catch(err => {
                console.log(err);
                reject();
            });
        });
    }

    // Remove products from cart
    async removeFromCart(productID, cartID) {
        const cart = this.carts.find((cart) => cart.cartID == cartID);
        if (!cart) {
            console.log(`Cart ${cartID} does not exist`);
        } else {
            cart.removeItem(productID);
        }
    }

    // Calculate the total cost of a cart
    async calculateTotalCostOfCart(cartID) {
        const cart = this.carts.find((cart) => cart.cartID == cartID);
        if (!cart) {
            console.log(`Cart ${cartID} does not exist`);
        } else {
            let cost = cart.getTotalCost();
            console.log(`Cart ${cartID} cost: ${cost} €`);
            return cost;
        }
    }

    // Proceed to checkout
    proceedToPay(cartID) {
        // Get cost of the cart
        const cart = this.carts.find((cart) => cart.cartID == cartID);
        price = cart.getTotalCost();

        // Call payment microservice API
        return new Promise((resolve, reject) => {
            fetch(`http://localhost:4000/checkout/${price}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
        
                if (data == "Order failed") {
                    console.log("There was a problem processing your order.");
                } else {
                    this.orderPlaced(cart);
                }
                resolve();
            })
            .catch(err => {
                console.log(err);
                reject();
            });
        });
    }

    // Inform order management microservice that order has been placed
    orderPlaced(cart) {
        return new Promise((resolve, reject) => {
            fetch(`http://localhost:5000/orders/${cart}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
        
                if (data == "Order created") {
                    console.log("Order created and can be tracked");
                }
                resolve();
            })
            .catch(err => {
                console.log(err);
                reject();
            });
        });
    }

}

/******************* TESTING *********************/
async function test() {
    const cartservice = new ShoppingCartService();
    let testcart = new Cart("1", []);
    cartservice.createCart(testcart.cartID);
    await cartservice.addProductToCart("1", 2, testcart.cartID);
    await cartservice.addProductToCart("21", 2, testcart.cartID);
    const c = await cartservice.calculateTotalCostOfCart(testcart.cartID);

}

test();
