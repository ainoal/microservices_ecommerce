/* The product catalog microservice takes care of the product catalog.
*/

class Product {
    constructor(productID, name, category, price, quantity) {
        this.productID = productID;
        this.name = name;
        this.category = category;
        this.price = parseFloat(price);
        this.quantity = parseInt(quantity);
    }
}

class ProductCatalogService {
    constructor() {
        this.products = []
    }

    getProduct(ID) {
        return this.products.find((product) => product.productID == ID);
    }

    // Create a new type of a product in the product catalog
    createProduct(ID, name, category, price, quantity) {
        const product = new Product(ID, name, category, price, quantity);
        this.products.push(product);
        console.log(`${ID}: ${name} added to product catalog`);
    }

    // Delete a product type completely from the product catalog
    deleteProduct(ID) {
        const idx = this.products.findIndex((product) => product.productID == ID);
        if (idx > -1) {
            this.products.splice(idx, 1);
            console.log(`${ID} removed from product catalog`);
        } else {
            console.log(`${ID} not found in product catalog`);
        }
    }

    // Update product information
    updateProduct(ID, name, category, price, quantity) {
        const product = this.products.find((product) => product.productID == ID);
        if (product) {
            if (name != "-") {
                product.name = name;
            }
            if (category != "-") {
                product.category = category;
            }
            if (price != "-") {
                product.price = price;
            }
            if (quantity != "-") {
                product.quantity = quantity;
            }
        }
    }

    // Update the amount of a product in stock
    updateStock(ID, change) {
        const product = this.products.find((product) => product.productID == ID);
        if (product) {
            product.quantity = product.quantity + change;
            console.log(`${ID} quantity in stock updated`);
            if (product.quantity < 1) {
                this.deleteProduct(ID);
            }
        } else {
            console.log(`${ID} not found in product catalog`)
        }
    }

    // Return products that are in a certain category and price range
    filter(category, maxPrice) {
        let filteredProducts = [];
        for (let i = 0; i < this.products.length; i++) {
            if ((this.products[i].category == category) && (this.products[i].price <= parseFloat(maxPrice))) {
                filteredProducts.push(this.products[i]);
            }
        }
        return filteredProducts;
    }

}

// RESTful API
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8000;

// Parse incoming requests
app.use(bodyParser.json());

const productCatalog = new ProductCatalogService();

// Get a specific product
app.get("/products/:ID", (req, res) => {
    const product = productCatalog.getProduct(req.params.ID);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send(`Product ${req.params.ID} not found on catalog`);
    }
});

// Create a new product
app.post("/products", (req, res) => {
    productCatalog.createProduct(req.body.ID, req.body.name, req.body.category,
        req.body.price, req.body.quantity);
    res.send("Product added to catalog")
});

// Delete a product
app.delete("/products/:ID", (req, res) => {
    productCatalog.deleteProduct(req.params.ID);
    res.send("Product deleted from catalog");
});

// Update product
app.put("/products/:ID", (req, res) => {
    productCatalog.updateProduct(req.body.ID, req.body.name, req.body.category,
        req.body.price, req.body.quantity);
    res.send("Product updated");
});

// Update stock
app.put("/products/:ID", (req, res) => {
    productCatalog.updateStock(req.params.ID, req.params.change);
    res.send("Stock updated");
});

// Filter by category and price range

// Listen for incoming requests
app.listen(port, () => {
    console.log(`Product catalog microservice listening on port ${port}`);
});

/*********************** FOR TESTING ********************************/
productCatalog.createProduct("1", "teddy bear", "toys", 14.5, 3);
productCatalog.createProduct("xyz", "skirt", "clothes", 12.0, 1);
productCatalog.createProduct("453", "rhino", "toys", 6.9, 3);
productCatalog.createProduct("21", "hat", "clothes", 2.01, 17);

let product1 = productCatalog.getProduct("1");
console.log(`Pruduct name: ${product1.name}`);

let filteredList1 = productCatalog.filter("toys", 10);
for (let i = 0; i < filteredList1.length; i++) {
    console.log(`List1: ${filteredList1[i].name}`);
}

let filteredList2 = productCatalog.filter("clothes", 20);
for (let i = 0; i < filteredList2.length; i++) {
    console.log(`List2: ${filteredList2[i].name}`);
}

productCatalog.deleteProduct("453");
let filteredList3 = productCatalog.filter("toys", 10);
for (let i = 0; i < filteredList3.length; i++) {
    console.log(`List3: ${filteredList3[i].name}`);
}

productCatalog.updateStock("xyz", -1);
let filteredList4 = productCatalog.filter("clothes", 20);
for (let i = 0; i < filteredList4.length; i++) {
    console.log(`List4: ${filteredList4[i].name}`);
}

productCatalog.updateProduct("1", "best teddy bear", "-", "-", "-");
let teddy = productCatalog.getProduct("1");
console.log(`Pruduct name: ${teddy.name}`);
