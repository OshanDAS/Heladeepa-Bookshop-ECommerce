import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProductModal = ({ product, closeModal, refresh }) => {
    const [form, setForm] = useState({ ...product });
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/products/categories', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setCategories(res.data);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            const { imgUrl, id, ...productData } = form;

            formData.append(
                'product',
                new Blob([JSON.stringify(productData)], { type: 'application/json' })
            );

            if (imageFile) {
                formData.append('image', imageFile);
            }

            await axios.post(`http://localhost:8080/api/admin/products/${product.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            refresh();
            closeModal();
        } catch (err) {
            console.error('Failed to update product:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#7A5C3E]/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl">
                <h2 className="text-xl md:text-2xl font-semibold text-[#7A5C3E] mb-6">Edit Product</h2>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                        className="bg-[#EAE1BD]/20 border border-[#D4B57D]/50 text-[#7A5C3E] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#C7995C] transition-all duration-200 text-sm md:text-base placeholder-[#7A5C3E]/60"
                    />
                    <input
                        type="text"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        placeholder="Author"
                        className="bg-[#EAE1BD]/20 border border-[#D4B57D]/50 text-[#7A5C3E] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#C7995C] transition-all duration-200 text-sm md:text-base placeholder-[#7A5C3E]/60"
                    />
                    <input
                        type="text"
                        name="publisher"
                        value={form.publisher}
                        onChange={handleChange}
                        placeholder="Publisher"
                        className="bg-[#EAE1BD]/20 border border-[#D4B57D]/50 text-[#7A5C3E] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#C7995C] transition-all duration-200 text-sm md:text-base placeholder-[#7A5C3E]/60"
                    />
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Price"
                        className="bg-[#EAE1BD]/20 border border-[#D4B57D]/50 text-[#7A5C3E] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#C7995C] transition-all duration-200 text-sm md:text-base placeholder-[#7A5C3E]/60"
                    />
                    <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        placeholder="Stock"
                        className="bg-[#EAE1BD]/20 border border-[#D4B57D]/50 text-[#7A5C3E] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#C7995C] transition-all duration-200 text-sm md:text-base placeholder-[#7A5C3E]/60"
                    />

                    {/* Category dropdown */}
                    <select
                        name="categoryId"
                        value={form.categoryId || ''}
                        onChange={handleChange}
                        className="bg-[#EAE1BD]/20 border border-[#D4B57D]/50 text-[#7A5C3E] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#C7995C] transition-all duration-200 text-sm md:text-base"
                    >
                        <option value="" className="text-[#7A5C3E]/60">
                            {product.category?.name || 'Select Category'}
                        </option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="text-[#7A5C3E]">
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* Optional image upload */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="bg-[#EAE1BD]/20 border border-[#D4B57D]/50 text-[#7A5C3E] p-3 rounded-lg w-full file:bg-[#B97B41] file:text-[#EAE1BD] file:border-none file:px-4 file:py-2 file:rounded-lg file:mr-4 file:cursor-pointer hover:file:bg-[#C7995C] transition-all duration-200 text-sm md:text-base"
                    />

                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                        <button
                            type="submit"
                            className="bg-[#B97B41] text-[#EAE1BD] px-6 py-3 rounded-lg hover:bg-[#C7995C] transition-colors duration-200 text-sm md:text-base"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-[#7A5C3E] hover:text-[#C7995C] px-6 py-3 rounded-lg transition-colors duration-200 text-sm md:text-base"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;