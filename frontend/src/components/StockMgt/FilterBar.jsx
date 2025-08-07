import React from 'react';

const FilterBar = ({ filters, setFilters }) => {
    const handleChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleClear = () => {
        setFilters({ name: '', categoryId: '', maxStock: '' });
    };

    return (
        <div className="flex flex-wrap gap-4 items-center mb-6 bg-[#EAE1BD] p-6 rounded-2xl shadow-lg max-w-full mx-auto">
            <input
                type="text"
                name="name"
                placeholder="Filter by name"
                value={filters.name}
                onChange={handleChange}
                className="bg-[#DFCB9B]/30 border border-[#D4B57D]/50 text-[#7A5C3E] p-3 rounded-lg w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-[#C7995C] transition-all duration-200 text-sm md:text-base placeholder-[#7A5C3E]/60"
            />
            <input
                type="text"
                name="categoryId"
                placeholder="Filter by category ID"
                value={filters.categoryId}
                onChange={handleChange}
                className="bg-[#DFCB9B]/30 border border-[#D4B57D]/50 text-[#7A5C3E] p-3 rounded-lg w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-[#C7995C] transition-all duration-200 text-sm md:text-base placeholder-[#7A5C3E]/60"
            />
            <input
                type="number"
                name="maxStock"
                placeholder="Max Stock"
                value={filters.maxStock}
                onChange={handleChange}
                className="bg-[#DFCB9B]/30 border border-[#D4B57D]/50 text-[#7A5C3E] p-3 rounded-lg w-full sm:w-36 focus:outline-none focus:ring-2 focus:ring-[#C7995C] transition-all duration-200 text-sm md:text-base placeholder-[#7A5C3E]/60"
            />
            <button
                onClick={handleClear}
                className="bg-[#B97B41] text-[#EAE1BD] px-6 py-3 rounded-lg hover:bg-[#C7995C] transition-colors duration-200 text-sm md:text-base"
            >
                Clear Filters
            </button>
        </div>
    );
};

export default FilterBar;