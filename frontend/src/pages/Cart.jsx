import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, total } = useCart();
  const [placed, setPlaced] = useState(false);

  function handleCheckout() {
    // This is a demo checkout: a real deployment would integrate a
    // payment gateway such as PayFast or SnapScan here.
    setPlaced(true);
    clearCart();
  }

  if (placed) {
    return (
      <div className="page page-narrow">
        <h1>Thanks for your order! 🎉</h1>
        <p>
          This demo checkout doesn't process real payments yet &mdash; connect a gateway like
          PayFast or SnapScan for production use.
        </p>
        <Link to="/" className="btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page page-narrow">
        <h1>Your cart is empty</h1>
        <Link to="/" className="btn-primary">
          Browse the marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="page page-narrow">
      <h1>Your Cart</h1>
      <ul className="cart-list">
        {items.map(({ product, qty }) => (
          <li key={product._id} className="cart-item">
            <span>{product.title}</span>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => updateQty(product._id, Number(e.target.value))}
            />
            <span>R{(product.price * qty).toFixed(2)}</span>
            <button className="btn-link" onClick={() => removeItem(product._id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p className="cart-total">Total: R{total.toFixed(2)}</p>
      <button className="btn-primary" onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
}
