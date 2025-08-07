import React, { useEffect, useState } from 'react';
import EditProductModal from './EditProductModal';
import { Trash2, Pencil } from 'lucide-react';

const ProductTable = ({ products, fetchProducts, setPage, page, totalPages }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        console.log(products);
    }, []);

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await fetch(`http://localhost:8080/api/admin/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                fetchProducts();
            } catch (err) {
                console.error('Failed to delete product:', err);
            }
        }
    };

    return (
        <div className="bg-[#EAE1BD] shadow-lg rounded-2xl p-6 mt-6 max-w-full mx-auto">
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                    <tr className="bg-[#D4B57D] text-left text-[#7A5C3E] font-semibold">
                        <th className="p-4 text-sm md:text-base">Name</th>
                        <th className="p-4 text-sm md:text-base">Author</th>
                        <th className="p-4 text-sm md:text-base">Price</th>
                        <th className="p-4 text-sm md:text-base">Stock</th>
                        <th className="p-4 text-sm md:text-base">Category</th>
                        <th className="p-4 text-sm md:text-base">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products?.map((product) => (
                        <tr
                            key={product.id}
                            className="border-b border-[#DFCB9B]/50 hover:bg-[#DFCB9B]/30 transition-colors duration-200"
                        >
                            <td className="p-4 text-[#7A5C3E] text-sm md:text-base">{product.name}</td>
                            <td className="p-4 text-[#7A5C3E] text-sm md:text-base">{product.author}</td>
                            <td className="p-4 text-[#7A5C3E] text-sm md:text-base">${product.price.toFixed(2)}</td>
                            <td className="p-4 text-[#7A5C3E] text-sm md:text-base">{product.stock}</td>
                            <td className="p-4 text-[#7A5C3E] text-sm md:text-base">{product.category?.name}</td>
                            <td className="p-4 flex gap-3">
                                <button
                                    onClick={() => setSelectedProduct(product)}
                                    className="text-[#B97B41] hover:text-[#C7995C] transition-colors duration-200"
                                    aria-label="Edit product"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="text-[#B97B41] hover:text-[#C7995C] transition-colors duration-200"
                                    aria-label="Delete product"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    className="bg-[#B97B41] text-[#EAE1BD] px-6 py-2 rounded-lg hover:bg-[#C7995C] transition-colors duration-200 disabled:opacity-50 text-sm md:text-base"
                    disabled={page === 0}
                >
                    Previous
                </button>
                <span className="text-[#7A5C3E] font-medium text-sm md:text-base">
                    Page {page + 1} of {totalPages}
                </span>
                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    className="bg-[#B97B41] text-[#EAE1BD] px-6 py-2 rounded-lg hover:bg-[#C7995C] transition-colors duration-200 disabled:opacity-50 text-sm md:text-base"
                    disabled={page >= totalPages - 1}
                >
                    Next
                </button>
            </div>

            {/* Edit Modal */}
            {selectedProduct && (
                <EditProductModal
                    product={selectedProduct}
                    closeModal={() => setSelectedProduct(null)}
                    refresh={fetchProducts}
                />
            )}
        </div>
    );
};

export default ProductTable;