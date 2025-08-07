import axios from 'axios';

export const getOrders = () => {
  return axios.get('http://localhost:8080/api/orders/admin',{
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });  // Adjust the API endpoint as needed
};

export const updateOrderStatus = (orderId, status) => {
  return axios.put(
      `http://localhost:8080/api/orders/${orderId}/status?status=${status}`,
      {}, // No request body
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
  );
};

