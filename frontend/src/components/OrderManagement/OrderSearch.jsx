import React from 'react';

const OrderSearch = ({ searchQuery, onSearch }) => {
  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search by Order ID or Customer Name"
        className="border p-2 w-full"
      />
    </div>
  );
};

export default OrderSearch;
