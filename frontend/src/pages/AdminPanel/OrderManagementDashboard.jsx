import React, { useState, useEffect } from 'react';
import OrderList from '../../components/OrderManagement/OrderList.jsx';
import OrderFilter from '../../components/OrderManagement/OrderFilter.jsx';
import OrderSearch from '../../components/OrderManagement/OrderSearch.jsx';
import OrderDetailModal from '../../components/OrderManagement/OrderDetailModal.jsx';
import { getOrders } from '../../api/orderApi.jsx';

const OrderManagementDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    // Fetch orders from backend
    getOrders().then(response => {
      const data = Array.isArray(response.data) ? response.data : [];
      setOrders(data);
      setFilteredOrders(data);
    }).catch(error => {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
      setFilteredOrders([]);
    });
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterOrders(query, statusFilter);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    filterOrders(searchQuery, status);
  };

  const filterOrders = (query, status) => {
    let filtered = orders.filter(order =>
      order.orderId.toLowerCase().includes(query.toLowerCase()) ||
      order.userName.toLowerCase().includes(query.toLowerCase())
    );

    if (status !== 'All') {
      filtered = filtered.filter(order => order.status === status);
    }

    setFilteredOrders(filtered);
  };

  const handleOrderSelect = (orderId) => {
    const order = orders.find(o => o.orderId === orderId);
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Management Dashboard</h1>

      <OrderSearch searchQuery={searchQuery} onSearch={handleSearch} />
      <OrderFilter currentStatus={statusFilter} onFilterChange={handleStatusFilterChange} />

      <OrderList
        orders={filteredOrders}
        onOrderSelect={handleOrderSelect}
      />

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default OrderManagementDashboard;
