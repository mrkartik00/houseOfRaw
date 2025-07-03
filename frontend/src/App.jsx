import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./Components/Layout/UserLayout";
import Home from "./Pages/Home";
import React from "react";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import Shop from "./Pages/Shop";
import { Toaster } from "sonner";
import Cart from "./Pages/Cart";

import MyOrders from "./profile/MyOrders";
import ShippingAddress from "./profile/ShippingAddress";
import Payment from "./profile/Payment";
import PromoCode from "./profile/PromoCode";
import Settings from "./profile/Settings.jsx";
import ProductDetails from "./Components/Products/ProductDetails.jsx";
import FavoritesPage from "./Pages/Fovourite.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Contact from "./Pages/Contact.jsx";
import About from "./Pages/About.jsx";
import { Feather } from "lucide-react";
import FAQs from "./Pages/FAQ.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx";
import TermsOfService from "./Pages/Terms.jsx";
import PrivacyPolicy from "./Pages/privacy.jsx";
import AdminLayout from "./Components/Admin/AdminLayout.jsx";
import AdminHomePage from "./Pages/AdminHomePage.jsx";
import ProductManagement from "./Components/Admin/ProductManagement.jsx";
import EditProductPage from "./Components/Admin/EditProductPage.jsx";
import OrderManagement from "./Components/Admin/OrderManagement.jsx";
import AddProduct from "./Components/Admin/AddProductPage.jsx";
import AddProductPage from "./Components/Admin/AddProductPage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/features" element={<Feather />} />
            <Route path="register" element={<Register />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/shops/all" element={<Shop />} />

            <Route path="profile" element={<Profile />}>
              <Route path="orders" element={<MyOrders />} />
              <Route path="shipping" element={<ShippingAddress />} />
              <Route path="payment" element={<Payment />} />
              <Route path="promocode" element={<PromoCode />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/cart" element={<Cart />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />} > 
          <Route index element={<AdminHomePage />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="products/add" element={<AddProductPage />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors closeButton duration={3000} />
      </CartProvider>
    </BrowserRouter>
  );
};
export default App;
