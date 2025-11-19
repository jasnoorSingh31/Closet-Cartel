import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Products from "./pages/Products";
import Contact_us from "./components/Contact_us";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";
import AdminProducts from "./pages/AdminProducts";
import RequireAdmin from "./components/RequireAdmin";

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
          <Route path="/contact" element={<Contact_us />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route
            path="/admin/products"
            element={
              // RequireAdmin ensures only privileged accounts reach the dashboard.
              <RequireAdmin>
                <AdminProducts />
              </RequireAdmin>
            }
          />
        </Routes>
      </div>
      
  );
};

export default App;
