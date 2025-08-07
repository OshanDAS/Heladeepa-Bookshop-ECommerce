import React from "react";

const CategorySidebar = ({ isOpen, setIsOpen, categories, selectedCategory, onSelectCategory }) => {
    return (
        <div
            className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 sm:block hidden z-50`}
        >
            {/* Close button */}
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-600"
            >
                ✖
            </button>

            {/* Categories List */}
            <div className="p-6">
                <h2 className="text-lg font-bold mb-4">Categories</h2>
                <ul>
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            className={`py-2 cursor-pointer hover:text-blue-600 ${
                                selectedCategory === category.id ? "text-blue-600 font-bold" : ""
                            }`}
                            onClick={() => onSelectCategory(category.id)}
                        >
                            {category.name} {selectedCategory === category.id && "✔"}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategorySidebar;
