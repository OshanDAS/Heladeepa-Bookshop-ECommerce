import React from 'react';

const OrderFilter = ({ currentStatus, onFilterChange }) => {
  const handleChange = (e) => {
    onFilterChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="status" className="mr-2">Filter by Status:</label>
      <select
        id="status"
        value={currentStatus}
        onChange={handleChange}
        className="border p-2"
      >
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
  );
};

export default OrderFilter;
