import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Calendar, Package, AlertTriangle, Check, X, ShoppingCart } from 'lucide-react';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const PreOrdersPage = () => {
    const [preOrders, setPreOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const token = localStorage.getItem("accessToken");
    const userEmail = jwtDecode(token).sub;
    
    const fetchPreOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/api/pre-orders/user/${userEmail}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPreOrders(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching pre-orders", err);
            setError("Failed to load your pre-orders. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
  
    useEffect(() => {
        fetchPreOrders();
    }, [userEmail]);
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    
    const getStatusBadge = (status) => {
        switch (status) {
            case "PENDING":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Calendar className="w-3 h-3 mr-1" />
                        Pending Release
                    </span>
                );
            case "RELEASED":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Package className="w-3 h-3 mr-1" />
                        Available Now
                    </span>
                );
            case "CANCELLED":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <X className="w-3 h-3 mr-1" />
                        Cancelled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Unknown
                    </span>
                );
        }
    };
    
    const canCancelPreOrder = (preOrder) => {
        return preOrder.status === "PENDING" && new Date(preOrder.releaseDate) > new Date();
    };
    
    const isReleased = (preOrder) => {
        return preOrder.status === "RELEASED";
    };
    
    const handleCancelPreOrder = async (preOrderId) => {
        if (!window.confirm("Are you sure you want to cancel this pre-order?")) {
            return;
        }
        
        try {
            await axios.delete(
                `http://localhost:8080/api/pre-orders/cancel/${preOrderId}`,
                {
                    params: { email: userEmail },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Pre-order cancelled successfully");
            fetchPreOrders();
        } catch (err) {
            console.error("Error cancelling pre-order", err);
            toast.error(err.response?.data || "Failed to cancel pre-order");
        }
    };
    
    const handleAddToCart = async (productId) => {
        try {
            await axios.post(
                "http://localhost:8080/api/cart/add",
                null,
                {
                    params: { productId, quantity: 1, email: userEmail },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Added to cart successfully!");
        } catch (err) {
            console.error("Error adding to cart", err);
            // Display the specific error message from the server if available
            const errorMessage = err.response?.data || "Failed to add to cart. Please try again.";
            toast.error(errorMessage);
        }
    };
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8D6E63]"></div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="text-center py-10">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Pre-orders</h2>
                <p className="text-gray-600">{error}</p>
                <button
                    onClick={fetchPreOrders}
                    className="mt-4 px-4 py-2 bg-[#8D6E63] text-white rounded-lg hover:bg-[#5D4037] transition"
                >
                    Try Again
                </button>
            </div>
        );
    }
    
    if (preOrders.length === 0) {
        return (
            <div className="text-center py-10">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Pre-orders Found</h2>
                <p className="text-gray-600">You haven't pre-ordered any books yet.</p>
                <Link
                    to="/products"
                    className="mt-4 inline-block px-4 py-2 bg-[#8D6E63] text-white rounded-lg hover:bg-[#5D4037] transition"
                >
                    Browse Books
                </Link>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#5D4037] mb-6">My Pre-orders</h1>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                                    Book Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Release Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Qty
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {preOrders.map((preOrder) => (
                                <tr key={preOrder.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {preOrder.productName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                by {preOrder.author}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {formatDate(preOrder.releaseDate)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            Rs. {preOrder.price.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {preOrder.quantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {getStatusBadge(preOrder.status)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {isReleased(preOrder) ? (
                                            <button
                                                onClick={() => handleAddToCart(preOrder.productId)}
                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors duration-150"
                                            >
                                                <ShoppingCart size={16} className="mr-1.5" />
                                                Add to Cart
                                            </button>
                                        ) : canCancelPreOrder(preOrder) ? (
                                            <button
                                                onClick={() => handleCancelPreOrder(preOrder.id)}
                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors duration-150"
                                            >
                                                Cancel
                                            </button>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-500">
                                                {preOrder.status === "CANCELLED"
                                                    ? "Cancelled"
                                                    : preOrder.status === "PENDING" && new Date(preOrder.releaseDate) <= new Date()
                                                        ? "Processing Release..."
                                                        : "Cannot Cancel"}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PreOrdersPage;