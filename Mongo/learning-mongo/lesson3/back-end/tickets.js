const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/test', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  //id: String,
});

const cartSchema = new mongoose.Schema({
  id: String,
  quantity: String,
})

productSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
});

/*cartSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
});*/
 
productSchema.set('toJSON', {
  virtuals: true
});

cartSchema.set('toJSON', {
  virtuals: true
});

const Product = mongoose.model('Product', productSchema);

const Cart = mongoose.model('Cart', cartSchema);

// cart
app.get('/api/cart', async (req, res) => {
  try {
    let cart = await Cart.find();
    res.send({cart: cart});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/products', async (req, res) => {
  try {
    let products = await Product.find();
    res.send({products: products});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    let product = await Product.find(':id'); // does this work?
    res.send({product: product});
  } catch (error) {
    console.log(error);
    res.sendStatus(404); // returns a 404 error?
  }
})

//const id = crypto.randomUUID();

// cart
app.post('/api/cart/:id', async (req, res) => {
    const cart = new Cart({
    id: req.body.id,
    quantity: req.body.quantity
  });
  try {
    await cart.save();
    //if (':id' === cart.get("/api/products/")) {
      res.send({cart:cart});
   // }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/products', async (req, res) => {
    const product = new Product({
    name: req.body.name,
    price: req.body.price
  });
  try {
    await product.save();
    res.send({product:product});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//PUT /api/cart/:id/:quantity

/*app.put('api/cart/:id/:quantity', async (req, res) => {
  try {
    
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})*/

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

/*app.delete('api/cart/:id', (req, res) => {
  let 
}*/

app.listen(3000, () => console.log('Server listening on port 3000!'));
