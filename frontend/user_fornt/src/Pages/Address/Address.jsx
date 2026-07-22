import { useEffect, useState } from 'react'
import './Address.css'
import api from "../../service/api"
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Address() {

    useEffect(() => {
        document.title = "Address"
    }, [])

    const [showForm, setShowForm] = useState(false)
    const [editId, setEditId] = useState(null)
    const [addresses, setAddresses] = useState([])
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        phone: "",
        isDefault: false
    })

    const navigate = useNavigate()

    const fetchAddress = async () => {
        try {
            const res = await api.get('/address')
            setAddresses(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAddress()
    }, [])

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Xoá địa chỉ?",
            text: "Bạn có chắc muốn xoá địa chỉ này không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xoá",
            cancelButtonText: "Huỷ"
        })

        if (!result.isConfirmed) return

        try {
            await api.delete(`/address/${id}`)
            fetchAddress()
            toast.success("Xoá địa chỉ thành công")
        } catch (error) {
            console.log(error)
            toast.error("Xoá địa chỉ thất bại")
        }
    }

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target
        setFormData({...formData, [name]: type === 'checkbox' ? checked : value})
    }

    const Submit = async (e) => {
        e.preventDefault()

        try {
            if (editId) {
                await api.put(`/address/${editId}`, formData)
                toast.success("Cập nhật địa chỉ thành công")
            } else {
                await api.post(`/address`, formData)
                toast.success("Thêm địa chỉ thành công")
            }
            
            setEditId(null)
            setShowForm(false)
            setFormData({
                fullName: "",
                address: "",
                phone: "",
                isDefault: false
            })

            fetchAddress()
        } catch (error) {
            console.log(error)
            toast.error("Có lỗi xảy ra")
        }
    }

    const handleEdit = (item) => {
        setShowForm(true)
        setEditId(item.id)

        setFormData({
            fullName: item.fullName,
            address: item.address,
            phone: item.phone,
            isDefault: item.isDefault
        })
    }

    return (
        <>
            <div className="address-page">
                <h3>Địa chỉ</h3>
                <div className="action-btn">
                    <button onClick={() => {setShowForm(prev => !prev), setEditId(null), setFormData({fullName: "", address:"", phone:"", isDefault: false})}}>
                        Thêm địa chỉ
                    </button>
                    <button onClick={() => navigate('/profile')}>Quay lại trang thông tin tài khoản</button>
                </div>

                {showForm && (
                    <form className='address-info' onSubmit={Submit}>
                        <h3>{editId ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}</h3>
                        <label>Họ và tên <span className='required'>*</span></label>
                        <input type="text" placeholder='Nhập họ và tên...' name='fullName' value={formData.fullName} onChange={handleChange} required/>
                        <label>Địa chỉ <span className='required'>*</span></label>
                        <input type="text" placeholder='Nhập số nhà, khu phố,...' name='address' value={formData.address} onChange={handleChange} required/>
                        <label>Số điện thoại <span className='required'>*</span></label>
                        <input type="text" placeholder='Nhập số điện thoại...' name='phone' value={formData.phone} onChange={handleChange} required/>
                        <label> <input type="checkbox" name='isDefault' checked={formData.isDefault} onChange={handleChange}/> Đặt làm mặc định</label>
                        <div className="form-action">
                            <button className='btn-add' type='submit'>{editId ? "Cập nhật" : "Thêm"}</button>
                            <button className='btn-huy' type='button' onClick={() => {
                                setShowForm(false);
                                setEditId(null);
                                setFormData({
                                    fullName: "",
                                    address: "",
                                    phone: "",
                                    isDefault: false
                                });
                            }}>Huỷ
                            </button>
                        </div>
                    </form>
                )}

                {addresses
                    .filter(item => item.id !== editId)
                    .map((item) => (
                        <div key={item.id} className='address-card'>
                            <p>
                                {item.fullName}
                                {item.isDefault && (
                                    <span className='default-badge'> Mặc định </span>
                                )}
                            </p>

                            <p>{item.address}</p>
                            <p>{item.phone}</p>

                            <div className="card-actions">
                                <button onClick={() => handleEdit(item)}>Sửa</button>
                                <button onClick={() => handleDelete(item.id)}>Xoá</button>
                            </div>
                        </div>
                ))}
            </div>
        </>
    )
}

export default Address