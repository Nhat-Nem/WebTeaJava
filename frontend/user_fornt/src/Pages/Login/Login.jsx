import { useState } from "react";
import api from "../../service/api";
import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify({
                name: res.data.name,
                role: res.data.role
            }));

            window.location.replace("/");

        } catch (error) {
                console.log(error.response?.data);
                alert(error.response?.data?.message || "Login thất bại");
            }
    };

    return (
        <div className="login-container">
            {/* LEFT SIDE */}
            <div className="login-left">
                <div className="left-content">
                    <h1>NamKhang Tea Shop</h1>
                    <p>Healing and chilling</p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="login-right">
                <div className="form-box">
                    <h2>Welcome Back</h2>
                    <p className="sub">Đăng nhập để tiếp tục</p>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
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

                        <div className="options">
                            <label>
                                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Nhớ tài khoản
                            </label>

                            <Link to="/forgot-password">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <button type="submit">Đăng nhập</button>
                    </form>

                    <p className="register">
                        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;