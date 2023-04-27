class Product {
    constructor(productID, name, category, price, quantity) {
        this.productID = productID;
        this.name = name;
        this.category = category;
        this.price = parseFloat(price);
        this.quantity = parseInt(quantity);
    }
}

module.exports = Product;
