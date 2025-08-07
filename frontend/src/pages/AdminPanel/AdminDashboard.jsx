// AdminDashboard.jsx
import React, {useEffect, useState} from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import adminApi from '../../api/admin';
import StockAlertCard from '../../components/Alerts/StockAlertCard';
import OrderAlertCard from '../../components/Alerts/OrderAlertCard';


const DashboardCard = ({ title, value, icon }) => (
    <div className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4">
        <div className="text-3xl">{icon}</div>
        <div>
            <h3 className="text-sm text-gray-500">{title}</h3>
            <p className="text-xl font-semibold">{value}</p>
        </div>
    </div>
);

// const recentOrders = [
//     { id: 'ORD123', customerName: 'John Doe', total: 2400, date: '2025-04-20' },
//     { id: 'ORD124', customerName: 'Jane Smith', total: 3100, date: '2025-04-21' },
//     { id: 'ORD125', customerName: 'Sam Wilson', total: 1250, date: '2025-04-22' },
// ];

const AdminDashboard = () => {
    const [stockAlerts, setStockAlerts] = useState([]);
    const [orderAlerts, setOrderAlerts] = useState([]);
    const { getStockAlerts, getIncomingOrderAlerts } = adminApi;

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const stockData = await getStockAlerts();
                const orderData = await getIncomingOrderAlerts();
                setStockAlerts(stockData || []);
                setOrderAlerts(orderData || []);
            } catch (err) {
                console.error("Failed to fetch admin alerts:", err);
            }
        };
        fetchAlerts();
    }, []);

    const totalProducts = 128;
    const totalOrders = 45;
    const monthlySales = 20400;

    const monthlySalesData = [
        { month: 'Jan', sales: 12000 },
        { month: 'Feb', sales: 18500 },
        { month: 'Mar', sales: 14200 },
        { month: 'Apr', sales: 20400 },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">📊 Admin Dashboard</h1>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title="Total Products" value={totalProducts} icon="📦" />
                <DashboardCard title="Total Orders" value={totalOrders} icon="🛒" />
                <DashboardCard title="Sales This Month" value={`Rs. ${monthlySales}`} icon="💵" />
                <DashboardCard title="Low Stock Items" value={stockAlerts.length} icon="🔻" />
            </div>

            {/* Low Stock Products */}
            <div className="mt-10">
                <h2 className="text-lg font-semibold mb-4">🚨 Low Stock Alerts</h2>
                <div>
                    {stockAlerts.length === 0 ? (
                        <p className="text-gray-500">No low-stock items at the moment.</p>
                    ) : (
                        stockAlerts.map((product) => (
                            <StockAlertCard key={product.productId} product={product} />
                        ))
                    )}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="mt-10">
                <h2 className="text-lg font-semibold mb-4">📦 Incoming Orders (Last 24h)</h2>
                <div>
                    {orderAlerts.length === 0 ? (
                        <p className="text-gray-500">No recent orders.</p>
                    ) : (
                        orderAlerts.map((order) => (
                            <OrderAlertCard key={order.orderId} order={order} />
                        ))
                    )}
                </div>
            </div>

            {/* Monthly Sales Chart */}
            <div className="mt-10">
                <h2 className="text-lg font-semibold mb-4">📈 Monthly Sales Chart</h2>
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlySalesData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
