import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout/Layout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import CategoryProduct from "./Pages/CategoryProduct/CategoryProduct";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Profile from "./Pages/Profile/Profile"
import ProductDetail from "./ProductDetail/ProductDetail";
import Address from "./Pages/Address/Address";
import Cart from "./Pages/Cart/Cart";
import Checkout from "./Pages/Checkout/Checkout";
import OrderDetail from "./Pages/OrderDetail/OrderDetail";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";

function App() {
  const [cart, setCart] = useState([]);

  return (
    <BrowserRouter>
        <Routes>
            {/* Co header , footer */}
            <Route element={<Layout cart={cart} />}>
                <Route path="/" element={<Dashboard cart={cart} setCart={setCart} />}/>
                <Route path="/category/:slug" element={<CategoryProduct />}/>
                <Route path="/about-us" element = {<AboutUs />}/>
                <Route path="/profile" element={<Profile setCart={setCart} />} />
                <Route path="/product/:id" element = {<ProductDetail setCart={setCart}/>} />
                <Route path="/address" element = {<Address />} />
                <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
                <Route path="/checkout" element = {<Checkout setCart = {setCart} />} />
                <Route path="/orders/:id" element = {<OrderDetail />} />
            </Route>

            {/* k header , footer */}
            <Route path="/login" element = {<Login />} />
            <Route path="/register" element = {<Register />} />
            <Route path="/forgot-password" element = {<ForgotPassword />} />
            <Route path="/reset-password/:token" element = {<ResetPassword />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;