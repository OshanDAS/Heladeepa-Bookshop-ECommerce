import React from "react";

const CategoryDropdown = ({ isOpen, categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className={`relative sm:hidden ${isOpen ? "block" : "hidden"}`}>
            <ul className="absolute right-0 w-48 bg-white border rounded-md shadow-md mt-1">
                {categories.map((category) => (
                    <li
                        key={category.id}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                            selectedCategory === category.id ? "bg-blue-100 font-bold" : ""
                        }`}
                        onClick={() => onSelectCategory(category.id)}
                    >
                        {category.name} {selectedCategory === category.id && "✔"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryDropdown;
