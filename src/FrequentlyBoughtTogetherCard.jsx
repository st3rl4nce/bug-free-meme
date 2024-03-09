import React, { useState } from 'react';

const FrequentlyBoughtTogetherCard = ({ item, handleAddToCart }) => {
  const [quantity, setQuantity] = useState(0);

  const handleUpdateQuantity = (action) => {
    if (action === 'increment') {
      setQuantity(quantity + 1);
    } else if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    handleAddToCart(item, quantity + 1);
    setQuantity(quantity + 1);
  };

  return (
    <div className="frequent-item-card">
      <div className="card-content">
        <h3>{item}</h3>
        <p>Price: ${item.price}</p>
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

export default FrequentlyBoughtTogetherCard;