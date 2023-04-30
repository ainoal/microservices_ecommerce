const ProductCatalogService = require("./ShoppingCartService");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

function menu() {
    console.log("1) ");
}

function waitForAction() {
    readline.question("Choose an option:", action => {
        console.log(`Hey there ${action}!`);
        waitForAction();
    });
}

waitForAction();
