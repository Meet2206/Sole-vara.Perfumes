import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Invoice from "./pages/Invoice";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
      <Router>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="payment" element={<Payment />} />
                <Route path="invoice" element={<Invoice />} />
                <Route path="login" element={<Login />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Route>

              {/* 404 Page */}
              <Route path="*" element={<h1>Page Not Found</h1>} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </Router>
  );
}

export default App;
