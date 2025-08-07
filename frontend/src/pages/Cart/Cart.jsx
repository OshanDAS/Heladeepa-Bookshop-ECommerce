import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountCode, setDiscountCode] = useState("");
    const [error, setError] = useState(null);
    const shippingCost = 50;
    const userEmail = jwtDecode(localStorage.getItem("accessToken")).sub;
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        address: "",
        city: "",
    });
    const [formErrors, setFormErrors] = useState({});

    const { apiCall } = useApi();

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (discountCode.length >= 3) {
                validateDiscountCode(discountCode);
            } else {
                setDiscountPercentage(0);
                setDiscountAmount(0);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [discountCode]);

    const fetchCart = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/cart/${userEmail}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                },
            });
            setCartItems(res.data);
            calculateTotal(res.data);
        } catch (err) {
            console.error("Error fetching cart items", err);
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        if (quantity < 1) return;
        try {
            await axios.put(`http://localhost:8080/api/cart/update/${cartItemId}`, null, {
                params: { quantity },
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                },
            });
            fetchCart();
        } catch (err) {
            console.error("Error updating cart item", err);
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await axios.delete(`http://localhost:8080/api/cart/remove/${cartItemId}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                },
            });
            fetchCart();
        } catch (err) {
            console.error("Error removing cart item", err);
        }
    };

    const calculateTotal = (items) => {
        const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        setTotal(subtotal);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.first_name) errors.first_name = "First name is required";
        if (!formData.last_name) errors.last_name = "Last name is required";
        if (!formData.phone) errors.phone = "Phone number is required";
        if (!formData.address) errors.address = "Address is required";
        if (!formData.city) errors.city = "City is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCheckout = async () => {
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const paymentData = {
            order_id: `ORDER_${Date.now()}`,
            products: cartItems.map((item) => ({
                product_id: item.product.id,
                quantity: item.quantity,
            })),
            items: cartItems.map((item) => item.product.name).join(", "),
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            email: userEmail,
            discount_code: discountCode,
            shipping: 300,
            amount: finalTotal,
        };

        setIsModalOpen(false);
        navigate("/checkout", { state: { paymentData } });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({
            first_name: "",
            last_name: "",
            phone: "",
            address: "",
            city: "",
        });
        setFormErrors({});
    };

    const handleDiscountCodeChange = (e) => {
        const code = e.target.value;
        setDiscountCode(code);
        setError(null);
    };

    const validateDiscountCode = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/promotions/validate-code?code=${discountCode}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                },
            });

            if (res.status === 200) {
                const promotion = res.data;
                const discountPercent = promotion.discountPercentage;
                const discountAmt = (discountPercent / 100) * total;
                setDiscountPercentage(discountPercent);
                setDiscountAmount(discountAmt);
                setError(null);
            }
        } catch (err) {
            setError("Invalid or expired discount code.");
            setDiscountPercentage(0);
            setDiscountAmount(0);
        }
    };

    const finalTotal = total + shippingCost - discountAmount;

    return (
        <div className="min-h-screen bg-amber-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-amber-900 mb-6">Your Shopping Cart</h2>
                {cartItems.length === 0 ? (
                    <p className="text-amber-700 text-lg">Your cart is empty</p>
                ) : (
                    <>
                        <ul className="bg-white rounded-xl shadow-lg p-6 mb-6">
                            {cartItems.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-amber-200 last:border-none"
                                >
                                    <div className="mb-4 sm:mb-0">
                                        <p className="text-lg font-semibold text-amber-900">{item.product.name}</p>
                                        <p className="text-amber-700">Price: Rs. {item.product.price.toFixed(2)}</p>
                                        <div className="flex items-center mt-3 space-x-3">
                                            <button
                                                className="px-3 py-1 bg-amber-200 text-amber-900 rounded-md hover:bg-amber-300 transition"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <span className="text-amber-900 font-medium">{item.quantity}</span>
                                            <button
                                                className="px-3 py-1 bg-amber-200 text-amber-900 rounded-md hover:bg-amber-300 transition"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        className="text-red-600 hover:text-red-800 font-medium"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <label className="block text-amber-900 font-semibold mb-2">Enter Discount Code</label>
                            <input
                                type="text"
                                value={discountCode}
                                onChange={handleDiscountCodeChange}
                                className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Enter code"
                            />
                            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="space-y-3">
                                <p className="text-lg font-semibold text-amber-900">
                                    Subtotal: Rs. {total.toFixed(2)}
                                </p>
                                <p className="text-lg font-semibold text-amber-900">
                                    Shipping: Rs. {shippingCost.toFixed(2)}
                                </p>
                                <p className="text-lg font-semibold text-amber-900">
                                    Discount: Rs. {discountAmount.toFixed(2)} ({discountPercentage}%)
                                </p>
                                <p className="text-xl font-bold text-amber-950">
                                    Total: Rs. {finalTotal.toFixed(2)}
                                </p>
                            </div>
                            <button
                                className="mt-6 w-full py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 bg-amber-900/30 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                            <h3 className="text-2xl font-bold text-amber-900 mb-6">Enter Your Details</h3>
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-amber-900 font-medium mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                    {formErrors.first_name && (
                                        <p className="text-red-600 text-sm mt-1">{formErrors.first_name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-amber-900 font-medium mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                    {formErrors.last_name && (
                                        <p className="text-red-600 text-sm mt-1">{formErrors.last_name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-amber-900 font-medium mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                    {formErrors.phone && (
                                        <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-amber-900 font-medium mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                    {formErrors.address && (
                                        <p className="text-red-600 text-sm mt-1">{formErrors.address}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-amber-900 font-medium mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                    {formErrors.city && (
                                        <p className="text-red-600 text-sm mt-1">{formErrors.city}</p>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-amber-200 text-amber-900 rounded-md hover:bg-amber-300 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;