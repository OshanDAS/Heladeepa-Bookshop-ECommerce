import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductTable from '../../components/StockMgt/ProductTable.jsx';
import FilterBar from '../../components/StockMgt/FilterBar.jsx';

const AdminProductPage = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({ name: '', categoryId: '', maxStock: '' });
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');

    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        author: '',
        publisher: '',
        categoryId: '',
        image: null
    });

    const [editProduct, setEditProduct] = useState({
        id: null,
        name: '',
        description: '',
        price: '',
        stock: '',
        author: '',
        publisher: '',
        categoryId: ''
    });
    const [editImage, setEditImage] = useState(null);

    const fetchProducts = async () => {
        try {
            let url = `http://localhost:8080/api/products?page=${page}`;
            if (filters.name) url = `http://localhost:8080/api/admin/products/search?name=${filters.name}&page=${page}`;
            else if (filters.categoryId) url = `http://localhost:8080/api/admin/products/category?categoryId=${filters.categoryId}&page=${page}`;
            else if (filters.maxStock) url = `http://localhost:8080/api/admin/products/stock?maxStock=${filters.maxStock}&page=${page}`;

            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setProducts(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/products/categories', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setCategories(res.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const res = await axios.post(
                'http://localhost:8080/api/products/categories',
                { name: newCategoryName },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );
            setCategories([...categories, res.data]);
            setNewCategoryName('');
        } catch (err) {
            console.error('Failed to create category:', err);
        }
    };

    const handleAddProduct = async () => {
        try {
            const formData = new FormData();
            const { image, ...productData } = newProduct;
            formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
            formData.append('image', image);

            await axios.post('http://localhost:8080/api/admin/products/add', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            setIsModalOpen(false);
            setNewProduct({
                name: '', description: '', price: '', stock: '', author: '', publisher: '', categoryId: '', image: null
            });
            fetchProducts();
        } catch (error) {
            console.error('Failed to add product', error);
        }
    };

    const handleUpdateProduct = async () => {
        try {
            const formData = new FormData();
            const productData = { ...editProduct };
            formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
            if (editImage) formData.append('image', editImage);

            await axios.put(`http://localhost:8080/api/admin/products/${editProduct.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            setIsEditModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [page, filters]);

    return (
        <div className="p-4 sm:p-6 bg-white min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-black mb-4 sm:mb-0">
                    Admin Product Management
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#B97B41] hover:bg-[#C7995C] text-[#EAE1BD] px-6 py-3 rounded-lg shadow-md transition duration-300 text-sm sm:text-base"
                >
                    + Add Product
                </button>
            </div>

            <FilterBar filters={filters} setFilters={setFilters} />

            <ProductTable
                products={products}
                fetchProducts={fetchProducts}
                setPage={setPage}
                page={page}
                totalPages={totalPages}
                setEditProduct={setEditProduct}
                setEditImage={setEditImage}
                setIsEditModalOpen={setIsEditModalOpen}
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-[#7A5C3E]/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl">
                        <h2 className="text-xl sm:text-2xl font-semibold text-black mb-6">Add New Product</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {['name', 'description', 'price', 'stock', 'author', 'publisher'].map((field) => (
                                <input
                                    key={field}
                                    type={['price', 'stock'].includes(field) ? 'number' : 'text'}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={newProduct[field]}
                                    onChange={(e) => setNewProduct({ ...newProduct, [field]: e.target.value })}
                                    className="bg-[#EAE1BD]/20 border border-[#D4B57D]/50 text-black p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#C7995C] transition-all duration-200 text-sm sm:text-base placeholder-black/60"
                                />
                            ))}

                            <select
                                value={newProduct.categoryId}
                                onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                                className="bg-[#EAE1BD]/20 border border-[#D4B57D]/50 text-black p-3 rounded-lg w-full col-span-1 sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#C7995C] transition-all duration-200 text-sm sm:text-base"
                            >
                                <option value="" className="text-black/60">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id} className="text-black">
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    placeholder="New Category Name"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="bg-[#EAE1BD]/20 border border-[#D4B57D]/50 text-black p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-[#C7995C] transition-all duration-200 text-sm sm:text-base placeholder-black/60"
                                />
                                <button
                                    type="button"
                                    onClick={handleCreateCategory}
                                    className="bg-[#B97B41] text-[#EAE1BD] px-6 py-3 rounded-lg hover:bg-[#C7995C] transition-colors duration-200 text-sm sm:text-base"
                                >
                                    + Create
                                </button>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                                className="col-span-1 sm:col-span-2 bg-[#EAE1BD]/20 border border-[#D4B57D]/50 text-black p-3 rounded-lg w-full file:bg-[#B97B41] file:text-[#EAE1BD] file:border-none file:px-4 file:py-2 file:rounded-lg file:mr-4 file:cursor-pointer hover:file:bg-[#C7995C] transition-all duration-200 text-sm sm:text-base"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end mt-6 gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-black hover:text-[#C7995C] px-6 py-3 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddProduct}
                                className="bg-[#B97B41] text-[#EAE1BD] px-6 py-3 rounded-lg hover:bg-[#C7995C] transition-colors duration-200 text-sm sm:text-base"
                            >
                                Save Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductPage;