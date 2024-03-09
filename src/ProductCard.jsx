import React, { useState } from 'react';

const ProductCard = ({ product, handleAddToCart }) => {
  const [quantity, setQuantity] = useState(0);

  const handleUpdateQuantity = (action) => {
    if (action === 'increment') {
      setQuantity(quantity + 1);
    } else if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    handleAddToCart(product, quantity + 1);
    setQuantity(quantity + 1);
  };

  return (
    <div className="product-card">
      <div className="card-content">
        <h3>{product.name}</h3>
        <p>Price: ${product.price}</p>
        {quantity > 0 ? (
          <div className="quantity-counter">
            <button onClick={() => handleUpdateQuantity('decrement')}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleUpdateQuantity('increment')}>+</button>
          </div>
        ) : (
          <button onClick={addToCart}>Add to Cart</button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;