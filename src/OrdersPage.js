import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrdersPage.css";

const STATUS_OPTIONS = ["pending", "confirmed", "ready_for_pickup", "shipped"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/v1/orders.json")
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  const updateStatus = (orderId, status) => {
    axios.patch(`http://localhost:3000/api/v1/orders/${orderId}`, { status })
      .then(() => {
        setOrders(prev =>
          prev.map(o => o.id === orderId ? { ...o, status } : o)
        );
      })
      .catch(err => console.error("Status update error:", err));
  };

  return (
    <div className="orders-page container">
      <h1>📦 All Orders</h1>
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <h3>Order #{order.id}</h3>
            <span>Status: <strong>{order.status}</strong></span>
          </div>

          <p><strong>Customer:</strong> {order.customer.name} ({order.customer.membership_type})</p>
          <p><strong>Email:</strong> {order.customer.email}</p>
          <p><strong>Total:</strong> Rs. {order.total_price}</p>

          <ul>
            {order.items.map(item => (
              <li key={item.id}>
                {item.name} × {item.quantity} @ Rs. {item.price}
              </li>
            ))}
          </ul>

          <div className="discounts">
            <p><strong>Membership Discount:</strong> Rs. {order.membership_discount || 0}</p>
            <p><strong>BOGO (Buy One Get One 50%):</strong> Rs. {order.bogo_discount || 0}</p>
            <p><strong>Total Discount:</strong> Rs. {order.total_discount || 0}</p>
            <br></br>
            <p><strong>Amount to Pay:</strong> Rs. {order.total_price - (order.total_discount || 0)}</p>
          </div>

          <div className="status-select">
            <label>Change Status:</label>
            <select
              value={order.status}
              onChange={(e) => updateStatus(order.id, e.target.value)}
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
