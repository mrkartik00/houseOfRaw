import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserCart } from "../../services/CartService";
import { addShippingAddress, getUserAddresses } from "../../services/addressService";
import { toast } from "sonner";

const CheckOut = () => {
  const navigate = useNavigate();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [showAddNewAddress, setShowAddNewAddress] = useState(false);
  const [ShippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",            
    pincode: "",
    country: "",
    phone: "",
  });
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      return payload.userId || payload.id || payload.sub || payload.user?._id || payload.user?.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }
      try {
        const response = await getUserCart(userId);
        if (response?.success && response.cart) {
          setCart(response.cart);
        } else {
          setError("Failed to load cart data");
        }
      } catch (err) {
        setError(`Failed to load cart: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await getUserAddresses();
        if (response?.success && response.addresses) {
          setSavedAddresses(response.addresses);
          // Find default address or set first address as selected
          const defaultIndex = response.addresses.findIndex(addr => addr.isDefault);
          setSelectedAddressIndex(defaultIndex !== -1 ? defaultIndex : 0);
          // If no addresses exist, show add new address form
          if (response.addresses.length === 0) {
            setShowAddNewAddress(true);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        // If error fetching addresses, show add new address form
        setShowAddNewAddress(true);
      } finally {
        setAddressLoading(false);
      }
    };

    fetchCart();
    fetchAddresses();
  }, [userId]);

  const handlePayment = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      let selectedAddress;

      if (showAddNewAddress) {
        // Adding new address
        const { firstName, lastName, address, city, state, pincode, country, phone } = ShippingAddress;

        if (!firstName || !lastName || !address || !city || !state || !pincode || !country || !phone) {
          toast.error("Please fill out all the shipping address fields.");
          setSubmitting(false);
          return;
        }

        const addressData = {
          firstName,
          lastName,
          address,
          city,
          state,
          pincode,
          country,
          phone
        };

        const response = await addShippingAddress(addressData);
        
        if (!response.success) {
          toast.error(response.message || "Failed to save shipping address");
          setSubmitting(false);
          return;
        }

        selectedAddress = response.address;
      } else {
        // Using saved address
        if (selectedAddressIndex === null || !savedAddresses[selectedAddressIndex]) {
          toast.error("Please select a shipping address.");
          setSubmitting(false);
          return;
        }

        selectedAddress = savedAddresses[selectedAddressIndex];
      }

      // Store checkout info for payment page
      const checkoutInfo = { 
        addressSaved: true,
        addressId: selectedAddress._id || 'latest',
        selectedAddress: selectedAddress
      };
      localStorage.setItem("checkoutInfo", JSON.stringify(checkoutInfo));
      
      navigate("/payments");
    } catch (error) {
      console.error("Error processing checkout:", error);
      toast.error(error.message || "Failed to process checkout. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto py-12 px-4 lg:px-8">
      {/* Checkout Form */}
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-semibold mb-6 border-b pb-2">Checkout</h2>
        
        {addressLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
            <span className="ml-2">Loading addresses...</span>
          </div>
        ) : (
          <form className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>

            {/* Saved Addresses Section */}
            {!showAddNewAddress && savedAddresses.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Select Delivery Address:</h4>
                <div className="space-y-3">
                  {savedAddresses.map((address, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAddressIndex === index 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedAddressIndex(index)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name="savedAddress"
                            checked={selectedAddressIndex === index}
                            onChange={() => setSelectedAddressIndex(index)}
                            className="mt-1"
                          />
                          <div>
                            <p className="font-medium">{address.fullName}</p>
                            <p className="text-sm text-gray-600">{address.street}</p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                            <p className="text-sm text-gray-600">{address.country}</p>
                            <p className="text-sm text-gray-600">Phone: {address.mobile}</p>
                          </div>
                        </div>
                        {address.isDefault && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddNewAddress(true)}
                  className="w-full mt-4 border border-dashed border-gray-400 text-gray-600 py-3 rounded-md hover:border-gray-600 transition"
                >
                  + Add New Address
                </button>
              </div>
            )}

            {/* Add New Address Form */}
            {showAddNewAddress && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">Add New Address:</h4>
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAddNewAddress(false)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      ← Use Saved Address
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    value={ShippingAddress.firstName}
                    onChange={(e) => setShippingAddress({ ...ShippingAddress, firstName: e.target.value })} 
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    value={ShippingAddress.lastName}
                    onChange={(e) => setShippingAddress({ ...ShippingAddress, lastName: e.target.value })} 
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Street Address" 
                  value={ShippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...ShippingAddress, address: e.target.value })} 
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="City" 
                    value={ShippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...ShippingAddress, city: e.target.value })} 
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="State" 
                    value={ShippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...ShippingAddress, state: e.target.value })} 
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Pincode" 
                    value={ShippingAddress.pincode}
                    onChange={(e) => setShippingAddress({ ...ShippingAddress, pincode: e.target.value })} 
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="Country" 
                    value={ShippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...ShippingAddress, country: e.target.value })} 
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Phone Number" 
                  value={ShippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...ShippingAddress, phone: e.target.value })} 
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
            )}

            <button 
              onClick={handlePayment} 
              type="submit"
              disabled={submitting || loading || addressLoading}
              className={`w-full mt-6 text-white text-lg py-3 rounded-md transition ${
                submitting || loading || addressLoading
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-black hover:bg-gray-900'
              }`}
            >
              {submitting ? 'Processing...' : 'Continue to Payment'}
            </button>
          </form>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow-md rounded-lg p-8">
        <h3 className="text-2xl font-semibold mb-6 border-b pb-2">Order Summary</h3>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-2">Loading cart...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : cart && cart.items.length > 0 ? (
          <>
            <div className="space-y-4">
              {cart.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-4 border-b pb-4">
                  <div className="flex items-start gap-4">
                    <img src={item.product.image?.[0] || '/placeholder-image.png'} alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-md" />
                    <div>
                      <h4 className="text-md font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">Size: {item.variant.size}</p>
                      <p className="text-sm text-gray-500">Color: {item.variant.color}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-lg">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cart.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between border-t pt-4 font-semibold text-xl">
                <span>Total</span>
                <span>₹{cart.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOut;
