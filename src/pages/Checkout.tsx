import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock, CreditCard, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cart, totalPrice } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    shippingMethod: 'standard',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-populate form data when user is logged in
  useState(() => {
    if (isAuthenticated && user) {
      const nameParts = user.name.split(' ');
      setFormData(prev => ({
        ...prev,
        email: user.email,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
      }));
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';

    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    else if (!/^\d{6}$/.test(formData.zipCode)) newErrors.zipCode = 'Please enter a valid 6-digit PIN code';

    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    // Navigate to payment page with form data
    navigate('/payment', { state: { orderData: formData } });

  };

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: 0,
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 15.99,
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day',
      price: 29.99,
    },
  ];

  const selectedShipping = shippingOptions.find(option => option.id === formData.shippingMethod);
  const shippingCost = selectedShipping?.price || 0;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shippingCost + tax;

  if (cart.length === 0) {
    return (
      <motion.div
        className="pt-16 md:pt-20 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 md:px-8 text-center py-16">
          <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Add some products to your cart before proceeding to checkout.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="pt-16 md:pt-20 pb-16 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8">
          <Link
            to="/cart"
            className="flex items-center text-emerald-700 hover:text-emerald-800 transition-colors mb-4"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-emerald-900">
            Checkout
          </h1>
          <p className="text-gray-600 mt-2">
            Complete your order for premium organic perfumes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-emerald-700 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  1
                </div>
                <h2 className="text-xl font-medium text-emerald-900">
                  Contact Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isAuthenticated}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-gray-300'
                      } ${isAuthenticated ? 'bg-gray-100' : ''}`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  {isAuthenticated && (
                    <p className="text-sm text-gray-500 mt-1">
                      Email auto-filled from your account
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={isAuthenticated}
                      className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                        } ${isAuthenticated ? 'bg-gray-100' : ''}`}
                      placeholder="First name"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={isAuthenticated}
                      className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                        } ${isAuthenticated ? 'bg-gray-100' : ''}`}
                      placeholder="Last name"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {isAuthenticated && (
                  <p className="text-sm text-gray-500">
                    Name auto-filled from your account
                  </p>
                )}

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Street address"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.city ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="City"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.state ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="State"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.zipCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="PIN code (6 digits)"
                    maxLength={6}
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-md transition-colors duration-300"
              >
                <CreditCard className="h-5 w-5" />
                Continue to Payment
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-emerald-700 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                2
              </div>
              <h2 className="text-xl font-medium text-emerald-900">
                Order Summary
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? 'Free' : `₹${shippingCost.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (8%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between font-semibold text-emerald-900 text-lg">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center mt-6 text-gray-500 text-xs gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure checkout</span>
              <Lock className="w-4 h-4 ml-2" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;