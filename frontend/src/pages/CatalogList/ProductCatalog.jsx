import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard.jsx";
import CategorySidebar from "../../components/Category/CategorySidebar.jsx";
import CategoryDropdown from "../../components/Category/CategoryDropdown.jsx";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "../../components/Filter/FilterSidebar.jsx";

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
    const accessToken = localStorage.getItem("accessToken");
    const userEmail = jwtDecode(accessToken).sub;
    const navigate = useNavigate();

    const fetchProducts = async (pageNum, categoryId = null) => {
        try {
            let url = `http://localhost:8080/api/products?page=${pageNum}&size=10`;
            if (categoryId) {
                url = `http://localhost:8080/api/products/categories/${categoryId}`;
            }

            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            setProducts(res.data.content || res.data);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error("Error fetching products", err);
        }
    };

    const fetchPromotions = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/promotions", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Filter only active promotions based on date and status
            const currentDate = new Date();
            const activePromotions = res.data.filter((promo) => {
                const startDate = new Date(promo.startDate);
                const endDate = new Date(promo.expiryDate);  // Use expiryDate for accurate end time
                const isActive = promo.status === "ACTIVE";  // Check if status is ACTIVE
                return isActive && currentDate >= startDate && currentDate <= endDate;
            });

            setPromotions(activePromotions);
        } catch (err) {
            console.error("Error fetching promotions", err);
            setPromotions([]);  // Ensure empty promotions if an error occurs
        }
    };

    const addToCart = async (productId) => {
        try {
            await axios.post("http://localhost:8080/api/cart/add", null, {
                params: { productId, quantity: 1, email: userEmail },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }
            });
            alert("Successfully added to cart");
        } catch (err) {
            console.error("Error adding to cart", err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/products/categories", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories", err);
        }
    };

    useEffect(() => {
        fetchProducts(page);
        fetchCategories();
        fetchPromotions();
    }, [page]);

    const handleCategorySelect = (categoryId) => {
        if (selectedCategory === categoryId) {
            setSelectedCategory(null);
            fetchProducts(0);
        } else {
            setSelectedCategory(categoryId);
            fetchProducts(0, categoryId);
        }
        setIsSidebarOpen(false);
        setIsDropdownOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#F5E6CA] p-6">
            {/* Promotion Banner */}
            {promotions.length > 0 && (
                <div className="bg-yellow-300 p-4 rounded-lg mb-6 shadow-md">
                    <h3 className="text-lg font-bold text-center text-[#5D4037]">🔥 Ongoing Promotions 🔥</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {promotions.map((promo) => {
                            const startDate = new Date(promo.startDate);
                            console.log(startDate);
                            const expiryDate = new Date(promo.expiryDate);
                            console.log(expiryDate);
                            const currentDate = new Date();
                            console.log(currentDate);
                            const remainingDays = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
                            console.log(remainingDays);

                            // Check for invalid date calculation
                            if (isNaN(remainingDays)) {
                                return (
                                    <div key={promo.id} className="bg-white p-3 rounded-lg shadow-md">
                                        <h4 className="font-semibold text-[#5D4037]">{promo.title}</h4>
                                        <p className="text-sm text-gray-700">{promo.description}</p>
                                        <p className="text-sm text-red-600">Invalid promotion dates</p>
                                    </div>
                                );
                            }

                            return (
                                <div key={promo.id} className="bg-white p-3 rounded-lg shadow-md">
                                    <h4 className="font-semibold text-[#5D4037]">{promo.title}</h4>
                                    <p className="text-sm text-gray-700">{promo.description}</p>
                                    <p className="text-sm font-semibold text-red-600">
                                        {promo.discountPercentage}% OFF | Ends in {remainingDays} days
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-[#5D4037]">
                    {selectedCategory
                        ? `Category: ${categories.find((cat) => cat.id === selectedCategory)?.name}`
                        : "Explore Our Collection"}
                </h2>
                <div className="flex space-x-4 mt-4 sm:mt-0">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="hidden sm:block bg-[#8D6E63] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#5D4037] transition"
                    >
                        Browse Categories
                    </button>
                    <button
                        onClick={() => setIsFilterSidebarOpen(true)}
                        className="bg-[#8D6E63] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#5D4037] transition"
                    >
                        Filters
                    </button>
                </div>
            </div>

            <FilterSidebar isOpen={isFilterSidebarOpen} setIsOpen={setIsFilterSidebarOpen} />
            <CategorySidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
            />
            <CategoryDropdown
                isOpen={isDropdownOpen}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
            />

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} addToCart={addToCart} email={userEmail} />
                ))}
            </div>

            {/* Pagination */}
            {!selectedCategory && (
                <div className="mt-8 flex justify-center gap-2">
                    {[...Array(totalPages).keys()].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                                p === page
                                    ? "bg-[#8D6E63] text-white shadow-md"
                                    : "bg-[#D7CCC8] hover:bg-[#BCAAA4] text-[#5D4037]"
                            }`}
                        >
                            {p + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductCatalog;
