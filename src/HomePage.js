import React, { useEffect, useState } from "react";
import "./App.css";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", email: "", membership_type: "standard" });

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  const addToCart = (item) => {
    const exists = cart.find((c) => c.item_id === item.id);
    if (exists) {
      setCart(cart.map((c) =>
        c.item_id === item.id ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setCart([...cart, { item_id: item.id, name: item.name, quantity: 1 }]);
    }
  };

  const handleCustomerChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const placeOrder = () => {
    const orderData = {
      customer,
      items: cart.map(({ item_id, quantity }) => ({ item_id, quantity }))
    };

    fetch("http://localhost:3000/api/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    })
      .then(res => res.json())
      .then(data => {
        alert("Order placed successfully!");
        setCart([]);
        setCustomer({ name: "", email: "", membership_type: "standard" });
      })
      .catch(err => {
        alert("Failed to place order");
        console.error(err);
      });
  };

  const cartTotal = cart.reduce((total, item) => {
    const itemData = items.find(i => i.id === item.item_id);
    return total + (itemData?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="container">
      <h1>📚 Bookstore Items</h1>
      <div className="card-grid">
        {items.map((item) => (
          <div className="card" key={item.id}>
            <h2>{item.name}</h2>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Price:</strong> Rs. {item.price}</p>
            <p><strong>Status:</strong> {item.availability}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div className="cart">
        <div className="cart-header">
          <h2>Your Cart 🛒</h2>
          <span className="cart-total">Total: Rs. {cartTotal}</span>
        </div>

        {cart.length === 0 ? (
          <p>No items yet.</p>
        ) : (
          <ul>
            {cart.map((item, i) => (
              <li key={i}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="customer-form">
        <h2>Customer Info</h2>
        <input name="name" value={customer.name} onChange={handleCustomerChange} placeholder="Name" />
        <input name="email" value={customer.email} onChange={handleCustomerChange} placeholder="Email" />
        <select name="membership_type" value={customer.membership_type} onChange={handleCustomerChange}>
          <option value="standard">Standard</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
        </select>
        <br /><br />
        <button onClick={placeOrder} disabled={cart.length === 0 || !customer.email || !customer.name}>
          Place Order
        </button>
      </div>
    </div>
  );
}
