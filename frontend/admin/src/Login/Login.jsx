import { useState } from "react";
import "./Login.css";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/admin/login", {
                email,
                password
            })


            // lưu JWT thật
            localStorage.setItem(
                "token",
                res.data.token
            )

            localStorage.setItem(
                "role",
                res.data.role
            )


            navigate("/admin")

        } catch (err) {
            alert(err.response?.data?.message || "Login failed")
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <h2>Admin Login</h2>

                <p className="login-notice">
                    Chỉ dành cho quản trị viên. Vui lòng đăng nhập để truy cập
                    hệ thống quản lý.
                </p>

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">
                        Đăng nhập
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;



