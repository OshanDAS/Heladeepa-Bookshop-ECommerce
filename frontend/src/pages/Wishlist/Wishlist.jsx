import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Trash2, ShoppingCart } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isToggling, setIsToggling] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");
    const userEmail = jwtDecode(token).sub;
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        fetchWishlist();
        fetchSubscriptionStatus();
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/wishlist/${userEmail}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWishlistItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching wishlist items", error);
            setLoading(false);
        }
    };

    const fetchSubscriptionStatus = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/wishlist/subscription-status`, {
                params: { email: userEmail },
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsSubscribed(response.data); // true or false
        } catch (error) {
            console.error("Error fetching subscription status", error);
        }
    };

    const toggleSubscription = async () => {
        try {
            setIsToggling(true);
            const response = await axios.post(`http://localhost:8080/api/wishlist/toggle-subscription`, null, {
                params: { email: userEmail },
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsSubscribed(prev => !prev);
            alert(response.data);
        } catch (error) {
            console.error("Error toggling subscription", error);
        } finally {
            setIsToggling(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`http://localhost:8080/api/wishlist/remove`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { email: userEmail, productId }
            });
            fetchWishlist();
        } catch (error) {
            console.error("Error removing from wishlist", error);
        }
    };

    const clearWishlist = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/wishlist/clear/${userEmail}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchWishlist();
        } catch (error) {
            console.error("Error clearing wishlist", error);
        }
    };

    const addToCart = async (productId) => {
        try {
            await axios.post("http://localhost:8080/api/cart/add", null, {
                params: { productId, quantity: 1, email: userEmail },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            alert("Successfully added to cart");
        } catch (err) {
            console.error("Error adding to cart", err);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#5D4037]">My Wishlist</h2>
                <div className="flex items-center space-x-4">
                    {wishlistItems.length > 0 && (
                        <button
                            onClick={clearWishlist}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center text-sm md:text-base"
                        >
                            <Trash2 size={18} className="mr-2" />
                            Clear All
                        </button>
                    )}
                    <button
                        onClick={toggleSubscription}
                        disabled={isToggling}
                        className={`
                            flex items-center justify-center
                            px-4 py-2 md:px-6 md:py-3
                            rounded-lg font-semibold text-sm md:text-base
                            transition-all duration-300 ease-in-out
                            shadow-md hover:shadow-lg
                            ${isToggling
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : isSubscribed
                                ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                : "bg-[#8D6E63] text-white hover:bg-[#5D4037]"
                        }`}
                    >
                        {isToggling ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                        ) : (
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={isSubscribed
                                        ? "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        : "M12 8v4l4 2m-2-6a6 6 0 11-12 0 6 6 0 0112 0z"}
                                />
                            </svg>
                        )}
                        {isToggling ? "Processing..." : isSubscribed ? "Unsubscribe from Notifications" : "Subscribe to Notifications"}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8D6E63]"></div>
                </div>
            ) : wishlistItems.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
                    <button
                        onClick={() => navigate("/products")}
                        className="bg-[#8D6E63] text-white px-4 py-2 rounded-lg hover:bg-[#5D4037] transition"
                    >
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="relative">
                                <img
                                    src={item.product.imageUrl || "/placeholder.svg"}
                                    alt={item.product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <span
                                    className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full ${
                                        item.product.stock > 0
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {item.product.stock > 0 ? "In Stock" : "Out of Stock"}
                                </span>
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-[#5D4037] mb-2">{item.product.name}</h3>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.product.description}</p>
                                <p className="text-[#D4A373] font-bold text-lg mb-4">Rs. {item.product.price.toFixed(2)}</p>

                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => removeFromWishlist(item.product.id)}
                                        className="text-red-500 hover:text-red-700 flex items-center"
                                    >
                                        <Trash2 size={18} className="mr-1" />
                                        Remove
                                    </button>

                                    <button
                                        onClick={() => addToCart(item.product.id)}
                                        disabled={item.product.stock === 0}
                                        className={`flex items-center ${
                                            item.product.stock > 0
                                                ? "bg-[#8D6E63] text-white hover:bg-[#5D4037]"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        } px-4 py-2 rounded-lg transition`}
                                    >
                                        <ShoppingCart size={18} className="mr-2" />
                                        {item.product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
