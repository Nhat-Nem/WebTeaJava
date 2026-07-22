import './Header.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from "../../service/api"

function Header({ cart }) {

    const location = useLocation()
    const navigate = useNavigate()

    const [inputValue, setInputValue] = useState("")
    const [isLogin, setIsLogin] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    const [openMenu, setOpenMenu] = useState(false)

    //cookie
    // useEffect(() => {
    //     const checkLogin = async () => {
    //         try {
    //             const res = await api.get("/auth/me")
    //             setIsLogin(true)
    //             setIsAdmin(res.data.isAdmin)
    //         } catch (err) {
    //             if (err.response?.status === 401) {
    //                 setIsLogin(false)
    //                 setIsAdmin(false)
    //             } else {
    //                 console.error(err)
    //             }
    //         }
    //     }

    //     checkLogin()
    // }, [location.pathname])

    //token
    useEffect(() => {

        const user = JSON.parse(localStorage.getItem("user"));

        if(user){
            setIsLogin(true);
            setIsAdmin(user.role === "ADMIN");
        }
        else{
            setIsLogin(false);
            setIsAdmin(false);
        }

    }, [location.pathname]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }, [location.pathname])

    const tongquantity = cart?.reduce(
        (sum, item) => sum + item.quantity,0) || 0

    const handleChange = (e) => {
        setInputValue(e.target.value)
    }

    const toggleMenu = () => {
        setOpenMenu(prev => !prev)
    }

    const handleSearch = () => {
        const keyword = inputValue.trim()

        if (!keyword) {
            navigate('/')
            return
        }

        navigate(`/?search=${encodeURIComponent(keyword)}`)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const handleHome = () => {
        setInputValue("")
        navigate("/", { replace: true })
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const keyword = params.get("search") || ""
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInputValue(keyword)
    }, [location.search])

    return (
        <header className='header'>

            <div className="menu-toggle" onClick={toggleMenu}>
                <i className='fa-solid fa-bars'></i>
            </div>

            <nav className={`navi ${openMenu ? "active" : ""}`}>
                <Link to='/' onClick={() => {handleHome(), setOpenMenu(false)}} >Tất cả sản phẩm</Link>
                <Link to='/category/tea' onClick={() => setOpenMenu(false)} >Trà</Link>
                <Link to='/category/cake' onClick={() => setOpenMenu(false)} >Bánh</Link>
                <Link to='/about-us' onClick={() => setOpenMenu(false)} >About Us</Link>
            </nav>

            <div className="right">

                <div className="tim-kiem">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={inputValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />

                    <i
                        className="fa-solid fa-magnifying-glass"
                        onClick={handleSearch}
                    ></i>
                </div>

                <div className="icons">

                    {/* user icon */}
                    <Link to={isLogin ? "/profile" : "/login"} style={{color: 'black'}}>
                        <i className="fa-regular fa-user"></i>
                    </Link>

                    {!isAdmin && (
                        <div className="cart">
                            <Link to='/cart'>
                                <i className="fa-solid fa-cart-shopping"></i>
                            </Link>
                            <span>{tongquantity}</span>
                        </div>
                    )}

                </div>

            </div>

        </header>
    )
}

export default Header