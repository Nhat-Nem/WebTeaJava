import './OrderDetail.css'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../service/api'

function OrderDetail() {
    const { id } = useParams()

    const navigate = useNavigate()

    const [order, setOrder] = useState(null)

    const statusText = {
        Pending: "Chờ xác nhận",
        Confirmed: "Đã xác nhận",
        Shipping: "Đang giao",
        Completed: "Hoàn thành",
        Cancelled: "Đã huỷ"
    }

    useEffect(() => {
        api.get(`/orders/${id}`).then(res => setOrder(res.data)).catch(err => console.log(err))
    }, [id])

    useEffect(() => {
        if (order) {
            document.title = `Đơn hàng #${order.id}`
        }
    }, [order])

    if (!order) return <h3> Loading... </h3>

    return (
        <>
            <div className="order-detail">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Quay lại
                </button>

                <h2> Đơn hàng #{order.id} </h2>

                <div className="order-info">
                    <p><b>Ngày đặt:</b> {new Date(order.orderDate).toLocaleDateString('vi-VN')} </p>
                    <p><b>Trạng thái:</b> <span className={`status ${order.status}`}> {statusText[order.status] || order.status} </span> </p>
                    <p><b>Tổng tiền:</b> {order.totalAmount.toLocaleString('vi-VN')}đ </p>
                    <p><b>Thanh toán:</b> {order.paymentMethod.toUpperCase()}</p>
                </div>

                <h3>Sản phẩm</h3>

                <div className="products">
                    {order.orderDetails?.map(item => (
                        <div key={item.id} className='product'>

                            <img src={product.image} alt={item.product?.name}/>

                            <div>
                                <p>{item.product.name}</p>
                                <p>Số lượng: {item.quantity}</p>
                                <p> {item.price.toLocaleString('vi-VN')}đ </p>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default OrderDetail