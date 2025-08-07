import { useState, useEffect } from "react";
import { message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const API_BASE_URL = "http://localhost:8080/api/promotions";

const AdminPromotionsPanel = () => {
    const [promotions, setPromotions] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        discountPercentage: "",
        startDate: "",
        expiryDate: "",
        applicableProducts: "",
        status: "ACTIVE",
    });

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            console.log("Fetching promotions...");

            const response = await axios.get(API_BASE_URL);
            console.log("Response received:", response);

            setPromotions(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to fetch promotions:", error);
            message.error("Failed to fetch promotions.");
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.discountPercentage || !formData.startDate || !formData.expiryDate || !formData.applicableProducts || !formData.status) {
            message.error("Please fill in all fields.");
            return;
        }

        if (new Date(formData.expiryDate) <= new Date(formData.startDate)) {
            message.error("Expiry date must be after the start date.");
            return;
        }

        try {
            const formattedData = {
                ...formData,
                discountPercentage: parseFloat(formData.discountPercentage),
                startDate: new Date(formData.startDate).toISOString(),
                expiryDate: new Date(formData.expiryDate).toISOString(),
                applicableProducts: formData.applicableProducts.split(",").map((item) => item.trim()).join(", "),
            };

            if (editingPromo) {
                await axios.put(`${API_BASE_URL}/${editingPromo.id}`, formattedData);
                message.success("Promotion updated!");
            } else {
                await axios.post(API_BASE_URL, formattedData);
                message.success("Promotion created!");
            }

            fetchPromotions();
            setModalOpen(false);
            setEditingPromo(null);
            resetForm();
        } catch (error) {
            message.error("Failed to save promotion.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this promotion?")) {
            return;
        }
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            message.success("Promotion deleted!");
            fetchPromotions();
        } catch (error) {
            message.error("Failed to delete promotion.");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            discountPercentage: "",
            startDate: "",
            expiryDate: "",
            applicableProducts: "",
            status: "ACTIVE",
        });
    };

    return (
        <div className="p-6 bg-[#EAE1BD] min-h-screen">
            <h2 className="text-2xl font-semibold text-[#B97B41] mb-4">Manage Promotions</h2>

            <div className="mb-6">
                <button
                    className="bg-[#B97B41] text-white px-4 py-2 rounded-lg hover:bg-[#C7995C] transition-all duration-300 cursor-pointer"
                    onClick={() => {
                        setModalOpen(true);
                        resetForm();
                    }}
                >
                    Add Promotion
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="bg-[#DFCB9B] text-[#B97B41]">
                    <tr>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Discount</th>
                        <th className="p-3 text-left">Start Date</th>
                        <th className="p-3 text-left">Expiry Date</th>
                        <th className="p-3 text-left">Products</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {promotions.length > 0 ? promotions.map((promo) => (
                        <tr key={promo.id} className="border-b bg-[#D4B57D] hover:bg-[#DFCB9B] transition-all duration-200">
                            <td className="p-3">{promo.name}</td>
                            <td className="p-3">{promo.discountPercentage}%</td>
                            <td className="p-3">{new Date(promo.startDate).toLocaleDateString()}</td>
                            <td className="p-3">{new Date(promo.expiryDate).toLocaleDateString()}</td>
                            <td className="p-3">
                                {promo.applicableProducts.split(",").map((product, index) => (
                                    <span key={index}>{product.trim()}{index < promo.applicableProducts.split(",").length - 1 && ", "}</span>
                                ))}
                            </td>
                            <td className="p-3">{promo.status}</td>
                            <td className="p-3 text-center">
                                <button
                                    className="bg-[#C7995C] text-white px-3 py-1 rounded-lg mr-2 hover:bg-[#B97B41] transition-all duration-300 cursor-pointer"
                                    onClick={() => {
                                        setEditingPromo(promo);
                                        setFormData({
                                            name: promo.name,
                                            discountPercentage: promo.discountPercentage,
                                            startDate: promo.startDate.split('T')[0],
                                            expiryDate: promo.expiryDate.split('T')[0],
                                            applicableProducts: promo.applicableProducts,
                                            status: promo.status,
                                        });
                                        setModalOpen(true);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-all duration-300 cursor-pointer"
                                    onClick={() => handleDelete(promo.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="7" className="p-3 text-center">No promotions available.</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Manage Books Section - Below Promotions */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold text-[#B97B41] mb-4">Manage Books</h2>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <p className="text-[#7A5C3E] mb-4">Use the tool below to upload multiple books in bulk.</p>
                    <button
                        className="w-full bg-green-600 text-white text-lg py-3 rounded-lg hover:bg-green-700 transition-all duration-300 cursor-pointer"
                        onClick={() => navigate("/upload/books")}
                    >
                        Bulk Upload Books
                    </button>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-all duration-300">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold text-[#B97B41] mb-4">
                            {editingPromo ? "Edit Promotion" : "New Promotion"}
                        </h3>

                        <input type="text" className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                               placeholder="Promotion Name"
                               value={formData.name}
                               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <input type="number" className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                               placeholder="Discount %"
                               value={formData.discountPercentage}
                               onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                        />

                        <input type="date" className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                               value={formData.startDate}
                               onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />

                        <input type="date" className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                               value={formData.expiryDate}
                               onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        />

                        <input type="text" className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                               placeholder="Applicable Products (comma-separated)"
                               value={formData.applicableProducts}
                               onChange={(e) => setFormData({ ...formData, applicableProducts: e.target.value })}
                        />

                        <div className="flex justify-between mt-4">
                            <button className="bg-[#B97B41] text-white px-4 py-2 rounded-lg" onClick={handleSave}>Save</button>
                            <button className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                                    onClick={() => {
                                        setModalOpen(false);
                                        setEditingPromo(null);
                                        resetForm();
                                    }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPromotionsPanel;