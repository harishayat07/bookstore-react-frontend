import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import OrdersPage from "./OrdersPage";

export default function App() {
  return (
    <Router>
      <nav style={{ margin: '20px' }}>
        <Link to="/">Home</Link> | <Link to="/orders">Orders</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </Router>
  );
}
