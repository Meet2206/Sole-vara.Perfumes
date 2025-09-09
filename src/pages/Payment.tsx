import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ScrollToTop from "../components/ScrollToTop";

const Payment: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const location = useLocation();
  const orderData = location.state?.orderData || {};
  const navigate = useNavigate();

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};
    if (!paymentData.cardNumber) newErrors.cardNumber = "Card number is required";
    if (!paymentData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (!paymentData.cvv) newErrors.cvv = "CVV is required";
    if (!paymentData.nameOnCard) newErrors.nameOnCard = "Name on card is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) return;

    const invoiceData = {
      customerName: paymentData.nameOnCard, // ✅ Card holder name instead of orderData
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      cart: cart.map((item: any) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })), // ✅ product details passed from cart
      totalPrice,
    };

    clearCart();
    navigate("/invoice", { state: invoiceData });
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-16 bg-white shadow-lg rounded-2xl "
    >
      <h2 className="text-xl font-bold mb-4">Payment Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={paymentData.cardNumber}
            onChange={(e) => {
              let value = e.target.value;

              // remove non-digits
              value = value.replace(/\D/g, "");

              // limit to 16 digits
              value = value.slice(0, 16);

              // add hyphens every 4 digits
              value = value.replace(/(\d{4})(?=\d)/g, "$1-");

              setPaymentData((prev) => ({ ...prev, cardNumber: value }));

              // validation example (optional)
              let errorMsg = "";
              if (value.replace(/-/g, "").length < 16) {
                errorMsg = "Card number must be 16 digits";
              }
              setErrors((prev) => ({ ...prev, cardNumber: errorMsg }));
            }}
            maxLength={19} // 16 digits + 3 hyphens
            className="w-full border p-2 rounded-md"
            placeholder="1234-5678-9012-3456"
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-sm">{errors.cardNumber}</p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium">Expiry Date</label>
          <input
            type="text"
            name="expiryDate"
            value={paymentData.expiryDate}
            onChange={(e) => {
              let value = e.target.value;

              // remove non-digits
              value = value.replace(/\D/g, "");

              // auto insert "/"
              if (value.length >= 3) {
                value = value.slice(0, 2) + "/" + value.slice(2, 4);
              }

              // validate month
              let errorMsg = "";
              if (value.length >= 2) {
                const month = parseInt(value.slice(0, 2), 10);
                if (month < 1 || month > 12) {
                  errorMsg = "Invalid month (01–12)";
                }
              }

              setPaymentData((prev) => ({ ...prev, expiryDate: value }));
              setErrors((prev) => ({ ...prev, expiryDate: errorMsg }));
            }}
            className="w-full border p-2 rounded-md"
            placeholder="MM/YY"
            maxLength={5}
          />
          {errors.expiryDate && (
            <p className="text-red-500 text-sm">{errors.expiryDate}</p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium">CVV</label>
          <input
            type="password"
            name="cvv"
            value={paymentData.cvv}
            onChange={handleChange}
            maxLength={3}
            className="w-full border p-2 rounded-md"
          />
          {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Name on Card</label>
          <input
            type="text"
            name="nameOnCard"
            value={paymentData.nameOnCard}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
          {errors.nameOnCard && <p className="text-red-500 text-sm">{errors.nameOnCard}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Pay Now
        </button>
      </form>
      <ScrollToTop />
    </motion.div>
  );
};

export default Payment;
