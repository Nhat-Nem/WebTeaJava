import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Sidebar.css'
import {
  LayoutDashboard,
  Tags,
  Package,
  ReceiptText,
  Users,
  Gift,
  LogOut,
  ChevronDown,
  ChevronRight
} from "lucide-react"

function Sidebar() {

    const navigate = useNavigate()

    const [admin] = useState({
        firstname: "Admin",
        lastname: "",
        email: "admin@gmail.com"
    });

    const [openPromotion, setOpenPromotion] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/admin/login"
    };

    return (
        <div className="sidebar">

            <div className="sidebar-top">
                <h3>Admin</h3>

                <ul>
                    <li><NavLink to='/admin' end><LayoutDashboard size={18}/> Dashboard</NavLink></li>
                    <li><NavLink to='/admin/categories'><Tags size={18}/> Danh mục</NavLink></li>
                    <li><NavLink to='/admin/products'><Package size={18}/> Sản phẩm</NavLink></li>
                    <li><NavLink to='/admin/orders'><ReceiptText size={18}/> Đơn hàng</NavLink></li>
                    <li><NavLink to='/admin/users'><Users size={18}/> Người dùng</NavLink></li>
                    <li>
                        <button
                            className="menu-dropdown"
                            onClick={() => setOpenPromotion(!openPromotion)}
                        >
                            <div className="menu-left">
                                <Gift size={18} />
                                <span>Khuyến mãi</span>
                            </div>

                            {openPromotion ? (
                                <ChevronDown size={16} />
                            ) : (
                                <ChevronRight size={16} />
                            )}
                        </button>

                        {openPromotion && (
                            <ul className="submenu">
                                <li>
                                    <NavLink to="/admin/promotions">
                                        Promotion
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>

            <div className="sidebar-bottom">

                
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={18}/> Đăng xuất
                </button>

            </div>

        </div>
    )
}

export default Sidebar