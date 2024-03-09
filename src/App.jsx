import React, { useState, useEffect } from "react";
import productData from "./products.json";
import ProductCard from "./ProductCard";
import "./App.css";

// Sample product data
const products = productData;

function App() {
  const [cart, setCart] = useState([]);
  const [frequentlyBoughtTogether, setFrequentlyBoughtTogether] = useState([]);

  const handleAddToCart = (product, quantity) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      );
      setCart(updatedCart);
      fetchFrequentlyBoughtTogether(updatedCart);
    } else {
      const newCart = [...cart, { ...product, quantity }];
      setCart(newCart);
      fetchFrequentlyBoughtTogether(newCart);
    }
  };

  const fetchFrequentlyBoughtTogether = async (cart) => {
    try {
      const uniqueItems = Array.from(new Set(cart.map(item => item.id)));
      const response = await fetch('https://tyt2ponrb7itwx2ncuc47qzjy40nskyw.lambda-url.eu-north-1.on.aws/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ items: uniqueItems }),
      });

      if (response.ok) {
        const data = await response.json();
        setFrequentlyBoughtTogether(data);
      } else {
        throw new Error('Failed to fetch frequently bought together data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect((cart) => {
    fetchFrequentlyBoughtTogether(cart);
  }, []);

  return (
    <div className="App">
      <header>
        <div className="header-content">
          <h1>My Store</h1>
          <input type="text" placeholder="Search..." className="search-bar" />
          <div className="header-right">
            <button className="cart-button">
              Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
            </button>
          </div>
        </div>
      </header>

      <div className="main-content">
      <div className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          handleAddToCart={handleAddToCart}
          cart={cart}
          setCart={setCart}
          fetchFrequentlyBoughtTogether={fetchFrequentlyBoughtTogether}
        />
      ))}
    </div>

        <div className="sidebar">
          <h2>Frequently Bought Together</h2>
          {frequentlyBoughtTogether.length > 0 ? (
            frequentlyBoughtTogether.map((item) => (
              <div key={item.id} className="frequent-item">
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
              </div>
            ))
          ) : (
            <p>No frequently bought together items found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;