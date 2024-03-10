import React, { useState, useEffect } from "react";
import productData from "./products.json";
import ProductCard from "./ProductCard";
import FrequentlyBoughtTogetherCard from './FrequentlyBoughtTogetherCard';
import "./App.css";

// Sample product data
const products = productData;
const productPriceMap = {};
products.forEach(product => {
  productPriceMap[product.name] = product.price;
});
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
      // console.log(cart);
      fetchFrequentlyBoughtTogether(updatedCart);
    } else {
      const newCart = [...cart, { ...product, quantity }];
      setCart(newCart);
      fetchFrequentlyBoughtTogether(newCart);
    }
  };

  const handleRemoveFromCart = (product) => {
    const updatedCart = cart.filter((item) => item.id !== product.id);
    setCart(updatedCart);
    fetchFrequentlyBoughtTogether(updatedCart);
  };
  // useEffect(() => {
  //   console.log(frequentlyBoughtTogether);
  // }, [frequentlyBoughtTogether]);

  const fetchFrequentlyBoughtTogether = async (cart) => {
    try {
      const uniqueItems = Array.from(new Set(cart.map(item => item.name)));
      console.log(JSON.stringify({ cart_data: uniqueItems }));
      const response = await fetch('https://tyt2ponrb7itwx2ncuc47qzjy40nskyw.lambda-url.eu-north-1.on.aws/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart_data: uniqueItems }),
      });

      if (response.ok) {
        const data = JSON.parse(await response.json());
        // console.log(typeof data);
        setFrequentlyBoughtTogether(data["recommendations"]);
        // console.log(frequentlyBoughtTogether);
      } else {
        throw new Error('Failed to fetch frequently bought together data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFrequentlyBoughtTogether(cart);
  }, [cart]);

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
              handleRemoveFromCart={handleRemoveFromCart}
              cart={cart}
              setCart={setCart}
              fetchFrequentlyBoughtTogether={fetchFrequentlyBoughtTogether}
            />
          ))}
        </div>

        <div className="sidebar">
          <h2>Frequently Bought Together With Items in Your Cart</h2>
          {frequentlyBoughtTogether.length > 0 ? (
            <div className="frequent-items-list">
              {frequentlyBoughtTogether.map((item) => (
                <FrequentlyBoughtTogetherCard
                  item={item}
                  price={productPriceMap[item]}
                  handleAddToCart={handleAddToCart}
                  handleRemoveFromCart={handleRemoveFromCart}
                />
              ))}
            </div>
          ) : (
            <p>No frequently bought together items found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;