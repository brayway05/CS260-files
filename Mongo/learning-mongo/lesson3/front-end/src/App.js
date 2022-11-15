import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // setup state
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const fetchProducts = async() => {
    try {      
      const response = await axios.get("/api/products");
      setProducts(response.data.products);
    } catch(error) {
      setError("error retrieving products: " + error);
    }
  }
  const createProduct = async() => {
    try {
      await axios.post("/api/products", {name: name, price: price});
    } catch(error) {
      setError("error adding a product: " + error);
    }
  }
  const addToCart = async(product) => {
    try {
      if (product.id === axios.get("/api/products/" + product.id)) {
        // increment the quantity;
      } 
      else {
        await axios.post("/api/cart/" + product.id);
      }
    } catch(error) {
      setError("error adding item to cart: " + error);
    }
  }
  const deleteOneProduct = async(product) => {
    try {
      await axios.delete("/api/products/" + product.id);
    } catch(error) {
      setError("error deleting a product" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchProducts();
  },[]);

  const addProduct = async(e) => {
    e.preventDefault();
    await createProduct();
    fetchProducts();
    setName("");
    setPrice("");
  }

  const deleteProduct = async(product) => {
    await deleteOneProduct(product);
    fetchProducts();
  }

  // render results
  return (
    // HTML FOR APP 
    <div className="App">
      {error}
      <h1>Grocery Store</h1>
      <form onSubmit={addProduct}>
        <div>
          <label>
            Item name:
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Price:
            <input value={price} onChange={e=>setPrice(e.target.value)}></input>
          </label>
        </div>
        <input type="submit" value="Add" />
      </form>
      <h1>Store Options</h1>
      {products.map( product => (
        <div key={product.id} className="item">
          <div className="quantity">
            <p><i>{product.name}</i> - ${product.price}</p>
          </div>
          <button onClick={e => deleteProduct(product)}>Delete</button>
        </div>
      ))}     
    </div>
  );
}

export default App;