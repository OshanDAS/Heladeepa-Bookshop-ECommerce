import axios from "axios";

const BASE_URL = "http://localhost:8080/api/admin/stock";

// Get the token from localStorage
const accessToken = localStorage.getItem("accessToken");

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        ...(accessToken && {
            Authorization: `Bearer ${accessToken}`
        }),
        "Content-Type": "application/json",
    },
});

/**
 * Admin API functions using full URLs
 */
const adminApi = {
    // Admin: Update stock threshold for a product
    updateStockThreshold: async (productId, threshold) => {
        const url = `${BASE_URL}/product/${productId}/threshold`;
        try {
            const response = await axiosInstance.put(url, null, {
                params: { threshold },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Admin: Get low-stock alerts
    getStockAlerts: async () => {
        const url = `${BASE_URL}/alerts/stock`;
        try {
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Admin: Get recent order alerts
    getIncomingOrderAlerts: async () => {
        const url = `${BASE_URL}/alerts/orders`;
        try {
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Public: Subscribe for stock notification
    subscribeForStockNotification: async (email, productId) => {
        const url = `${BASE_URL}/subscribe`;
        try {
            const response = await axios.post(url, null, {
                params: { email, productId },
                headers: {
                    "Content-Type": "application/json", // No auth needed
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Public: Check stock for a product
    checkStock: async (productId) => {
        const url = `${BASE_URL}/check-stock/${productId}`;
        try {
            const response = await axios.post(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default adminApi;