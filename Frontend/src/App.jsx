import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/authentication/Login";
import SignIn from "./components/authentication/SignUp";
import HomePage from "./components/HomePage/HomePage";
import { ProductProvider } from "./Context/ProductContext";
import Cart from "./components/Cart/Cart";
import OrderSummary from "./components/Cart/OrderSummary";
import Orders from "./components/Cart/Orders";
import WishList from "./components/Cart/WishList";
import { AdminProvider } from "./Context/AdminContext";
import AdminHome from "./components/Admin/AdminHome";
import Dashboard from "./components/Admin/Dashboard";
import HandleProducts from "./components/Admin/HandleProducts";
import UserDetails from "./components/Admin/UserDetails";
import ProtectedAdmin from "./components/authentication/ProtectedAdmin";

function App() {
    return (
        <Router>
            <ProductProvider>
                <AdminProvider>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="signin" element={<SignIn />} />
                        <Route path="login" element={<Login />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="order-summary" element={<OrderSummary />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="wishlist" element={<WishList />} />

                        {/* Protecting admin routes */}
                        <Route
                            path="admin"
                            element={
                                <ProtectedAdmin>
                                    <AdminHome />
                                </ProtectedAdmin>
                            }
                        >
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="handle-products" element={<HandleProducts />} />
                            <Route path="user-details" element={<UserDetails />} />
                        </Route>
                    </Routes>
                </AdminProvider>
            </ProductProvider>
        </Router>
    );
}

export default App;