import { useEffect, useState } from "react";
import "./Dashboard.css";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import api from "../services/api";

function Dashboard() {

    const [stats, setStats] = useState({
        products: 0,
        users: 0,
        orders: 0,
        revenue: 0
    });

    const [chartData, setChartData] = useState([]);

    const [recentOrders, setRecentOrders] = useState([]);

    const statusText = {
        Pending: "Chờ xác nhận",
        Confirmed: "Đã xác nhận",
        Shipping: "Đang giao",
        Completed: "Hoàn thành",
        Cancelled: "Đã huỷ"
    };

    const formatCurrency = (value) => {
        if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
        if (value >= 1000) return (value / 1000).toFixed(0) + "K";
        return value;
    };

    useEffect(() => {

        document.title = "Dashboard - Admin";

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const [
                statsRes,
                revenueRes,
                recentRes
            ] = await Promise.all([
                api.get("/dashboard/stats"),
                api.get("/dashboard/revenue"),
                api.get("/dashboard/recent-orders")
            ]);

            setStats(statsRes.data);
            setChartData(revenueRes.data);
            setRecentOrders(recentRes.data);

        } catch (err) {
            console.log(err);
        }

    };

    return (
        <>
            <div className="dashboard">
                <h2>Admin Dashboard</h2>

                {/* stat */}
                <div className="stats-grid">
                    <div className="card">
                        <h4>Sản phẩm</h4>
                        <p>{stats.products}</p>
                    </div>

                    <div className="card">
                        <h4>Người dùng</h4>
                        <p>{stats.users}</p>
                    </div>

                    <div className="card">
                        <h4>Đơn hàng</h4>
                        <p>{stats.orders}</p>
                    </div>

                    <div className="card">
                        <h4>Doanh thu</h4>
                        <p>{stats.revenue?.toLocaleString('vi-VN')}₫</p>
                    </div>
                </div>

                {/* chart */}
                <div className="chart-box">
                    <h3>Doanh thu theo tháng</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={formatCurrency} />
                            <Tooltip formatter={(value) => formatCurrency(value) + "₫"} />
                            <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} dot={{r:5}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* recent order */}
                <div className="recent-orders">
                    <h3>Đơn hàng gần đây</h3>

                    <table>
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Tên khách hàng</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>
                                        {order.user
                                            ? order.user.fullName
                                            : "User đã bị xoá"}
                                    </td>
                                    <td>{order.totalAmount.toLocaleString('vi-VN')}₫ </td>
                                    <td>
                                        <span className={`status ${order.status}`}>
                                            {statusText[order.status]}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Dashboard;