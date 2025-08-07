import React from 'react';

const OrderList = ({ orders, onOrderSelect }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Order ID</th>
            <th className="px-4 py-2">Customer Name</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Total Amount</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId}>
              <td className="px-4 py-2">{order.orderId}</td>
              <td className="px-4 py-2">{order.userName}</td>
              <td className="px-4 py-2">{order.status}</td>
              <td className="px-4 py-2">{order.amount}</td>
              <td className="px-4 py-2">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => onOrderSelect(order.orderId)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
