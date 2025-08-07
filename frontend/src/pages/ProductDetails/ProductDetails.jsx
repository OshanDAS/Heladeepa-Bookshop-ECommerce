import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Calendar, Package, Tag, Info } from 'lucide-react';

import ProductCard from "../CatalogList/ProductCard.jsx";
import {jwtDecode} from "jwt-decode";
import WishlistHeart from "../../components/Buttons/WishlistHeart.jsx";
import NotifyMeButton from "../../components/Buttons/NotifyMeButton.jsx";
import PreOrderButton from "../../components/Buttons/PreOrderButton.jsx";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("accessToken");
    const userEmail = jwtDecode(token).sub;

    const addToCart = async (productId) => {
        try {
            await axios.post("http://localhost:8080/api/cart/add", null, {
                params: { productId, quantity: 1, email:userEmail },
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                }
            });
            alert("Successfully added to cart");
        } catch (err) {
            console.error("Error adding to cart", err);
        }
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        })
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to load product details.");
                setLoading(false);
            });

        // Fetch all products (instead of filtering by category)
        axios.get("http://localhost:8080/api/products", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
            .then(response => {
                setAllProducts(response.data.content);
            })
            .catch(err => {
                console.error("Failed to load all products", err);
            });
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8D6E63]"></div>
        </div>
    );
    if (error) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-red-50 p-4 rounded-lg text-red-600 flex items-center space-x-2">
                <Info size={20} />
                <span>{error}</span>
            </div>
        </div>
    );

    // Check if product is available for pre-order
    const isPreOrderAvailable = product.preOrderAvailable && new Date(product.releaseDate) > new Date();

    // Format the release date
    const formatReleaseDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="p-6 bg-[#F5E6CA]">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-[#8B5A2B] overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                    {/* Product Image with WishlistHeart */}
                        <div className="relative group">
                            <div className="aspect-square overflow-hidden rounded-xl bg-[#F5E6CA]">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                                />
                            </div>

                        {/* Pre-order Badge or Stock Badge */}
                        {isPreOrderAvailable ? (
                                <div className="absolute top-4 left-4 bg-amber-100 text-[#8D6E63] px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-sm">
                                <Calendar size={16} />
                                <span>Pre-order Available</span>
                            </div>
                        ) : (
                                <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-sm ${
                                    product.stock > 0 ? "bg-[#8D6E63] text-white" : "bg-[#5D4037] text-white"
                            }`}>
                                    <Package size={16} />
                                    <span>{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
                            </div>
                        )}

                        {/* Wishlist Button Positioned at Top-Right */}
                        <div className="absolute top-4 right-4">
                            <WishlistHeart productId={product.id} email={userEmail} />
                        </div>
                    </div>

                    {/* Product Details */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-4xl font-bold text-[#6D4C41] mb-4">{product.name}</h1>
                                <p className="text-2xl font-semibold text-[#8D6E63] mb-6">Rs. {product.price.toFixed(2)}</p>
                                <p className="text-[#5D4037] text-lg leading-relaxed">{product.description}</p>
                            </div>

                        {/* Release Date for Pre-order */}
                        {isPreOrderAvailable && (
                                <div className="bg-amber-50 p-4 rounded-lg flex items-center space-x-3 text-[#8D6E63] border border-amber-200">
                                    <Calendar size={24} />
                                    <div>
                                        <p className="font-medium">Release Date</p>
                                        <p className="text-sm">{formatReleaseDate(product.releaseDate)}</p>
                                    </div>
                            </div>
                        )}

                        {/* Stock Indicator (only show if not pre-order) */}
                        {!isPreOrderAvailable && (
                                <div className={`p-4 rounded-lg flex items-center space-x-3 ${
                                    product.stock > 0 ? "bg-[#8D6E63] text-white" : "bg-[#5D4037] text-white"
                                }`}>
                                    <Package size={24} />
                                    <div>
                                        <p className="font-medium">Stock Status</p>
                                        <p className="text-sm">{product.stock > 0 ? `${product.stock} units available` : "Currently out of stock"}</p>
                                    </div>
                                </div>
                        )}

                        {/* Action Buttons */}
                            <div className="flex space-x-4 items-center pt-4">
                            {isPreOrderAvailable ? (
                                <PreOrderButton productId={product.id} email={userEmail} />
                            ) : (
                                <button
                                        className="bg-[#8D6E63] text-white px-8 py-4 rounded-xl hover:bg-[#5D4037] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2"
                                    disabled={product.stock === 0}
                                    onClick={() => addToCart(product.id)}
                                >
                                        <Package size={20} />
                                        <span>{product.stock > 0 ? "Add to Cart" : "Sold Out"}</span>
                                </button>
                            )}
                            {product.stock === 0 && !isPreOrderAvailable && (
                                <NotifyMeButton productId={product.id} email={userEmail} isIcon={false}/>
                            )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Discover More Items Section */}
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-[#6D4C41]">Discover More Items</h2>
                        <Link to="/catalog" className="text-[#8D6E63] hover:text-[#5D4037] font-medium flex items-center space-x-2">
                            <span>View All</span>
                            <Tag size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {allProducts.map(product => (
                            <div key={product.id} className="transform hover:scale-105 transition-transform duration-300">
                                <Link to={`/products/${product.id}`}>
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        addToCart={addToCart}
                                        email={product.email}
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;