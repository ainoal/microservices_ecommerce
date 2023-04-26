/* 
*/
const express = require("express");
const fetch = require('node-fetch');

class Cart {
    constructor(cartID, items) {
        this.cartID = cartID;
        this.items = items;
    }
}

class ShoppingCartService {
    constructor() {
        this.carts = [];
    }

    // Add products to cart
    addProductToCart(productID, quantity) {
        // Send RESTful API request to product catalog microservice
        // to get information about the products in stock.
        // Resource for RESTful API calls: https://www.freecodecamp.org/news/rest-api-
        // tutorial-rest-client-rest-service-and-api-calls-explained-with-code-examples/
        fetch(`http://localhost:8000/products/${productID}`)
        .then(res => res.json())
        .then(data => {
          //const { product } = data;
          console.log(data);
    
          if (data == `Product ${productID} not found on catalog`) {
            // If there are no products in stock, display an error message
            console.log("No products available.");
          } else if (quantity > data.quantity) {
            console.log(`There are only ${data.quantity} pcs of that product available`);
          } else {
            // Add product to cart 
            // (TODO: IMPROVE THIS BY CHECKING ID PRODUCT ID ALREADY IN CART
            // AND HOW MANY OF IT WILL THEN BE IN THE CART)
            //this.carts.push(new Cart(this.carts.length, [product]));
            console.log("Item added to cart");
          }
        })
        .catch(err => console.log(err));

        // TODO: ADD COMMUNICATION TO PRODUCT CATALOG SERVICE ???
    }

    // Remove products from cart

    // Calculate the total cost of a cart

    //
}

const cart = new ShoppingCartService();
cart.addProductToCart("1", 100);
