import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import api from "../../service/api";

function Register() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [birthday, setBirthday] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const isValidName = (name) => {
        const trimmed = name.trim()

        // it nhat 2 ky tu
        if (trimmed.length < 2) return false

        // cho chu cai dau hoa + khoang trang
        const regex = /^[a-zA-ZÀ-ỹ\s]+$/
        if (!regex.test(trimmed)) return false

        // k dc spam 'aaa'
        const cleaned = trimmed.toLowerCase().replace(/\s/g, "")
        if (/(.)\1{3,}/.test(cleaned)) return false

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};

        if (!fullName) {
            newErrors.fullName = "Nhập họ và tên";
        } else if (!isValidName(fullName)) {
            newErrors.fullName = "Họ và tên không hợp lệ";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            newErrors.email = "Nhập email";
        } else if (!emailRegex.test(email)) {
            console.log(emailRegex.test(value));
            console.log(value);
            newErrors.email = "Email không hợp lệ";
        }

        if (!phone) {
            newErrors.phone = "Nhập số điện thoại";
        }

        if (!birthday) {
            newErrors.birthday = "Chọn ngày sinh";
        }

        if (!password) {
            newErrors.password = "Nhập mật khẩu";
        } else if (password.length < 6) {
            newErrors.password = "Mật khẩu phải tối thiểu 6 ký tự";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Nhập lại mật khẩu";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Không khớp";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            await api.post("/auth/register", {
                fullName,
                email,
                password,
                phone,
                birthday
            });

            alert("Đăng ký thành công");
            navigate("/");
        } catch (error) {
            const err = error.response?.data

            console.log(err.response) // debug

            if (err?.errors) {
                setErrors(err.errors)
            } else {
                alert(err?.message || "Đăng kí thất bại")
            }
        }
    };

    return (
        <div className="register-container">
            {/* LEFT */}
            <div className="register-left">
                <div className="register-left-content">
                    <h1>NamKhang Tea Shop</h1>
                    <p>Create your account</p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="register-right">
                <div className="register-form-box">
                    <h2>Register</h2>
                    <p className="register-sub">Tạo tài khoản mới</p>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">
                            <input
                                className={errors.fullName ? "input-error" : ""}
                                type="text"
                                placeholder="Họ và tên"
                                value={fullName}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFullName(value);

                                    if (!value) {
                                        setErrors(prev => ({ ...prev, fullName: "Nhập họ và tên" }));
                                    } else if (!isValidName(value)) {
                                        setErrors(prev => ({ ...prev, fullName: "Họ và tên không hợp lệ" }));
                                    } else {
                                        setErrors(prev => ({ ...prev, fullName: "" }));
                                    }
                                }}
                            />
                            {errors.fullName && <span className="error">{errors.fullName}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                className={errors.email ? "input-error" : ""}
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={async (e) => {
                                    const value = e.target.value;
                                    setEmail(value);

                                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                                    if (!value) {
                                        setErrors(prev => ({ ...prev, email: "Nhập email" }));
                                        return;
                                    }

                                    if (!emailRegex.test(value)) {
                                        setErrors(prev => ({ ...prev, email: "Email không hợp lệ" }));
                                        return;
                                    }

                                    const res = await api.get(`/auth/check?email=${value}`);

                                    if (res.data.email) {
                                        setErrors(prev => ({ ...prev, email: "Email đã tồn tại" }));
                                    } else {
                                        setErrors(prev => ({ ...prev, email: "" }));
                                    }
                                }}
                            />
                            {errors.email && <span className="error">{errors.email}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                className={errors.phone ? "input-error" : ""}
                                type="text"
                                placeholder="Số điện thoại"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setErrors(prev => ({ ...prev, phone: "" }));
                                }}
                            />
                            {errors.phone && <span className="error">{errors.phone}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                className={errors.birthday ? "input-error" : ""}
                                type="date"
                                value={birthday}
                                onChange={(e) => {
                                    setBirthday(e.target.value);
                                    setErrors(prev => ({ ...prev, birthday: "" }));
                                }}
                            />
                            {errors.birthday && <span className="error">{errors.birthday}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                className={errors.password ? "input-error" : ""}
                                type="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrors(prev => ({ ...prev, password: "" }));
                                }}
                            />
                            {errors.password && <span className="error">{errors.password}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                className={errors.confirmPassword ? "input-error" : ""}
                                type="password"
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setConfirmPassword(value);

                                    if (value !== password) {
                                        setErrors(prev => ({ ...prev, confirmPassword: "Không khớp" }));
                                    } else {
                                        setErrors(prev => ({ ...prev, confirmPassword: "" }));
                                    }
                                }}
                            />
                            {errors.confirmPassword && (
                                <span className="error">{errors.confirmPassword}</span>
                            )}
                        </div>

                        <button type="submit">Đăng ký</button>

                    </form>

                    <p className="register-login">
                        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;