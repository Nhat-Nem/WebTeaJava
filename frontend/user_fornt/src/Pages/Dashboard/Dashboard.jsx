import ProductCard from "../../Components/ProductCard/ProductCard"
import { useState, useEffect } from 'react'
import api from "../../service/api"
import "../Dashboard/Dashboard.css"
import { Link, useSearchParams } from "react-router-dom"
import Pagination from "../../Components/Panigation/Panigation"
import "../../Components/Panigation/Panigation.css"

function Dashboard({setCart}) {  

    const [searchParams] = useSearchParams()
    const search = searchParams.get("search") || ""
    const [banners, setBanners] = useState([])
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [topProducts, setTopProducts] = useState([]);
    const [currentBanner, setCurrentBanner] = useState(0)


    useEffect(() => {
        api.get("/products/top-selling")
            .then(res => setTopProducts(res.data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {

        if (banners.length === 0) return

        const interval = setInterval(() => {
            setCurrentBanner(prev => (prev + 1) % banners.length)
        }, 3000)

        return () => clearInterval(interval)

    }, [banners])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [page])

    useEffect(() => {

        if(search){

            api.get("/products/search",{
                params:{
                    keyword:search,
                    page:page
                }
            })
            .then(res=>{
                setProducts(res.data.products)
                setTotalPages(res.data.totalPages)
            })

        }else{

            api.get("/products")
                .then(res=>{
                    setProducts(res.data)
                    setTotalPages(1)
                })

        }

    },[search,page])

    return(
        <>
            <div className="dashboard-page">
                {search ? (
                    <h2>Tìm thấy {products.length} kết quả với từ khóa "{search}"</h2>
                ) : (

                    <>

                    <h2>Sản phẩm bán chạy</h2>

                        <div className="product-list">
                            {topProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    setCart={setCart}
                                />
                            ))}
                        </div>

                    <h2>Tất cả sản phẩm</h2>

                    </>
                )}

                <div className="product-list">
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                setCart={setCart}
                            />
                        ))
                    ) : (
                        <p>Không tìm thấy sản phẩm nào.</p>
                    )}
                </div>

                <Pagination page={page} totalPages={totalPages} setPage={setPage} />

            </div>
        </>
    )
}

export default Dashboard