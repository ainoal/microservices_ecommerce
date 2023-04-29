//import ProductCatalogService from "./ShoppingCartService";
import express from "../node_modules/express";
const app = express();

// Define a route for the module file
app.get('/pcs.mjs', (req, res) => {
  res.type('application/javascript');
  res.sendFile(__dirname + '/public/module.js');
});

app.use((req, res, next) => {
    if (req.url.endsWith('.mjs')) {
      res.type('application/javascript');
    }
    next();
  });
  

// Start the server
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

// Button event.
// TODO: modify this to update product catalog when an order is placed
const eventBtn = document.querySelector(".event-btn");
eventBtn.addEventListener("click", btnEvent);
function btnEvent(){
    console.log("JIPPIKAYEAH");
}