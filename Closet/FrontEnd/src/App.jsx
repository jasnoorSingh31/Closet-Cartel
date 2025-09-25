import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Products from "./pages/Products";

const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login';
  return (
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element= {<Cart />} />
          <Route path="/product" element={<Products />} />
        </Routes>
      </div>
      
  );
};

export default App;
