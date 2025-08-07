import { useState, useEffect } from "react";
import axios from "axios";

const FilterSidebar = ({ isOpen, setIsOpen, setProducts, setTotalPages }) => {
    const [filters, setFilters] = useState({
        minPrice: "",
        maxPrice: "",
        inStock: null,  // Set initial inStock to null to allow a proper filter
        categoryId: "",
        author: "",
        publisher: "",
        page: 0,
        size: 10,
    });



    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const accessToken = localStorage.getItem("accessToken");

    // Fetch categories, authors, and publishers when the sidebar opens
    useEffect(() => {
        if (isOpen) {
            fetchOptions();
        }
    }, [isOpen]);

    const fetchOptions = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/filters/options", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            console.log("Filter options:", res.data);
            setCategories(res.data.categories);
            setAuthors(res.data.authors);
            setPublishers(res.data.publishers);
        } catch (err) {
            console.error("Error fetching filter options", err);
        }
    };

    // Fetch filtered products based on the selected filters
    const fetchProductsWithFilters = async () => {
        const payload = {
            minPrice: filters.minPrice !== "" ? Number(filters.minPrice) : null,
            maxPrice: filters.maxPrice !== "" ? Number(filters.maxPrice) : null,
            categoryId: filters.categoryId ? Number(filters.categoryId) : null,
            author: filters.author || null,
            publisher: filters.publisher || null,
            inStock: filters.inStock,  // Allow null, true, or false for inStock
            page: 0,
            size: 10,
        };

        console.log("Sending filters:", payload); // Debugging log

        try {
            const response = await axios.post(
                "http://localhost:8080/api/filters/products",
                payload,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            console.log("Filtered Products Response:", response.data);

            setProducts(response.data.content || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            console.error("Error applying filters", err);
        }
    };

    const applyFilters = () => {
        fetchProductsWithFilters();
        setIsOpen(false);
    };

    const handleApplyFilters = () => {
        applyFilters(); 
    };
    
    return (
        <div
            className={`fixed right-0 top-0 h-full w-80 bg-[#D7CCC8] shadow-lg z-50 transition-transform transform ${
                isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-[#5D4037]">Filters</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-[#8D6E63] text-2xl"
                    >
                        &times;
                    </button>
                </div>

                {/* Min Price */}
                <label className="block mb-2 text-[#5D4037]">
                    Min Price:
                    <input
                        type="number"
                        value={filters.minPrice || ""}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        className="w-full border p-2 mt-1"
                    />
                </label>

                {/* Max Price */}
                <label className="block mb-2 text-[#5D4037]">
                    Max Price:
                    <input
                        type="number"
                        value={filters.maxPrice || ""}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        className="w-full border p-2 mt-1"
                    />
                </label>

                {/* In Stock */}
                <label className="flex items-center mb-4 text-[#5D4037]">
                    <input
                        type="checkbox"
                        checked={filters.inStock === true}
                        onChange={(e) => setFilters({ ...filters, inStock: e.target.checked ? true : false })}
                        className="mr-2"
                    />
                    In Stock
                </label>

                {/* Category */}
                <label className="block mb-2 text-[#5D4037]">
                    Category:
                    <select
                        value={filters.categoryId || ""}
                        onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                        className="w-full border p-2 mt-1"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Author */}
                <label className="block mb-2 text-[#5D4037]">
                    Author:
                    <input
                        type="text"
                        value={filters.author || ""}
                        onChange={(e) => setFilters({ ...filters, author: e.target.value })}
                        className="w-full border p-2 mt-1"
                    />
                </label>

                {/* Publisher */}
                <label className="block mb-2 text-[#5D4037]">
                    Publisher:
                    <input
                        type="text"
                        value={filters.publisher || ""}
                        onChange={(e) => setFilters({ ...filters, publisher: e.target.value })}
                        className="w-full border p-2 mt-1"
                    />
                </label>

                {/* Apply Filters Button */}
                <button
                    onClick={handleApplyFilters}
                    className="bg-[#8D6E63] text-white px-4 py-2 rounded-lg w-full hover:bg-[#5D4037] transition"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
};

export default FilterSidebar;
