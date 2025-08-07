import { useState, useCallback } from "react";
import axios from "axios";

// Configuration
const API_BASE_URL = "http://localhost:8080";
const ACCESS_TOKEN_KEY = "accessToken";

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Required for HttpOnly cookies (refresh token)
    timeout: 10000, // 10-second timeout
});

/**
 * Custom React Hook for API calls
 */
const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiCall = useCallback(async (endpoint, method = "GET", data = null, params = null, headers = {}) => {
        setLoading(true);
        setError(null);

        try {
            let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
            const config = {
                url: endpoint,
                method,
                data,
                params,
                headers: {
                    Authorization: accessToken ? `Bearer ${accessToken}` : "",
                    "Content-Type": "application/json",
                    ...headers,
                },
            };

            const response = await api(config);
            setLoading(false);
            return response.data;
        } catch (error) {
            if (error.response?.status === 403) {
                // Session expired
                alert("Session expired. Please log in again.");
                localStorage.removeItem(ACCESS_TOKEN_KEY); // Remove access token
                window.location.href = "/"; // Redirect to login
            } else {
                setError("An error occurred. Please try again.");
            }

            setLoading(false);
            return null;
        }
    }, []);

    /**
     * Validate Discount Code
     */
    const validateDiscountCode = useCallback(async (code) => {
        const endpoint = `/api/promotions/validate-code`;
        const params = { code }; // Send the discount code as a query parameter
        return await apiCall(endpoint, "GET", null, params);
    }, [apiCall]);

    return { apiCall, validateDiscountCode, loading, error };
};

export default useApi;
