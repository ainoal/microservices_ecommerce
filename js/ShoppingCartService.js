/* 
*/
//const express = require("express");
const fetch = require('node-fetch');
const { Product } = require("./ProductCatalogService");

class Cart {
    constructor(cartID) {
        this.cartID = cartID;
        this.items = [];
    }

    addItem(product) {
        this.items.push(product);
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
            cost += this.items[i].price;
        }
        return cost;
    }
}

class ShoppingCartService {
    // TODO: REMOVE TESTCART AND IMPLEMENT BETTER CART MANAGEMENT
    constructor() {
        this.carts = [];
    }

    // Create a new shopping cart
    createCart(cartID) {
        const cart = new Cart(cartID);
        this.carts.push(cart);
        console.log(`Cart with ID ${cartID} created`);
    }

    // Add products to cart
    addProductToCart(productID, quantity, cartID) {
        // Send RESTful API request to product catalog microservice
        // to get information about the products in stock.
        // Resource for RESTful API calls: https://www.freecodecamp.org/news/rest-api-
        // tutorial-rest-client-rest-service-and-api-calls-explained-with-code-examples/
        fetch(`http://localhost:8000/products/${productID}`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
    
          if (data == `Product ${productID} not found on catalog`) {
            // If there are no products in stock, display an error message
            console.log("No products available.");
          } else if (quantity > data.quantity) {
            console.log(`There are only ${data.quantity} pcs of that product available`);
          } else {
            // Add product to cart 
            // (TODO: IMPROVE THIS BY CHECKING IF PRODUCT ID ALREADY IN CART
            // AND HOW MANY OF IT WILL THEN BE IN THE CART)
            const cart = this.carts.find((cart) => cart.cartID == cartID);
            const product = new Product(data.productID, data.name, data.category, 
                data.price, data.quantity);
            cart.addItem(product);
            console.log("Item added to cart");
          }
        })
        .catch(err => console.log(err));

        // TODO: ADD COMMUNICATION TO PRODUCT CATALOG SERVICE ???

    }

    // Remove products from cart
    removeFromCart(productID, cartID) {
        const cart = this.carts.find((cart) => cart.cartID == cartID);
        if (!cart) {
            console.log(`Cart ${cartID} does not exist`);
        } else {
            cart.removeItem(productID);
        }
    }

    // Calculate the total cost of a cart
    calculateTotalCostOfCart(cartID) {
        const cart = this.carts.find((cart) => cart.cartID == cartID);
        if (!cart) {
            console.log(`Cart ${cartID} does not exist`);
        } else {
            let cost = cart.getTotalCost();
            console.log(`Cart ${cartID} cost: ${cost} €`);
            return cost;
        }
    }
}


/******************* TESTING *********************/
const cartservice = new ShoppingCartService();
let testcart = new Cart("1", []);
cartservice.createCart(testcart.cartID);
//cartservice.addProductToCart("1", 100, testcart.cartID);
//cartservice.calculateTotalCostOfCart(testcart.cartID);
