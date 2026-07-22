import { useEffect, useState } from 'react';
import api from '../services/api'
import '../Products/Products.css'
import { toast } from 'react-toastify'
import Pagination from '../components/Panigations/Panigation';
import '../components/Panigations/Panigation.css'
import Swal from 'sweetalert2';
import Select from "react-select";

const defaultForm = () => ({
    id: null,
    code: "",
    name: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
    active: true,
    products: []
});

function Promotion() {

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState("")
    const [filcategory, setFilCategory] = useState("")
    const [promotions, setPromotions] = useState([]);
    const [products, setProducts] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [categories, setCategories] = useState([])
    const [showEdit, setShowEdit] = useState(false)
    const [formData, setFormData] = useState(defaultForm())

    useEffect(() => {
        console.log(api.defaults.baseURL)
        api.get("/promotions")
            .then(res => {
                console.log("API:", res.data);
                console.log("isArray:", Array.isArray(res.data));
                setPromotions(res.data);
            })
            .catch(console.error);

        api.get("/products")
            .then(res => {console.log("cate", res.data); setProducts(res.data)})
            .catch(console.error);
    }, []);


    const handleProductChange = (e) => {
        const values = [...e.target.selectedOptions].map(option => Number(option.value));

        setFormData({
            ...formData,
            products: values
        });
    };

    useEffect(() => {
        //nếu modal mở có thể ấn "esc" de thoát form
        if (!showModal && !showEdit) return;
        const handleKeydown = async (e) => {
            if (e.key == "Escape") {
                console.log("ESC")
                setShowModal(false)
                setShowEdit(false)
                setFormData(defaultForm())
            }
        }

        window.addEventListener("keydown", handleKeydown)
        return () => {
            window.removeEventListener("keydown", handleKeydown)
        }
    }, [showModal, showEdit])

    useEffect(() => {
        document.title = 'Quản lý voucher - Admin'
    }, [])

    const deleteProd = async (id) => {
        const result = await Swal.fire({
            title: "Xoá sản phẩm?",
            text: "Sản phẩm này sẽ bị xoá vĩnh viễn!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Xoá",
            cancelButtonText: "Huỷ"
        })

        if (!result.isConfirmed) return

        try {
            await api.delete(`/promotions/${id}`)
            setPromotions(promotions.filter(p => p.id !== id))
            toast.success('Xoá voucher thành công')
        } catch (error) {
            console.log(error)
            toast.error('Xoá voucher thất bại')
        }
    }

    const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        
    }

    const filterProduct = promotions.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                ...formData,
                products: formData.products.map(id => ({ id }))
            };
            const res = await api.post("/promotions", data);

            const list = await api.get("/promotions");
            setPromotions(list.data);

            setShowModal(false);
            setFormData(defaultForm());

            toast.success("Thêm voucher thành công");
        } catch (error) {
            console.log(error);
            toast.error("Thêm voucher thất bại");
        }
    };

    const handleEdit = (promotion) => {
        setFormData({
            id: promotion.id,
            code: promotion.code,
            name: promotion.name,
            description: promotion.description,
            discount: promotion.discount,
            startDate: promotion.startDate?.substring(0, 10),
            endDate: promotion.endDate?.substring(0, 10),
            active: promotion.active,
            products: promotion.products?.map(p => p.id) || []
        });

        setShowEdit(true);
    }

    const handleEdited = async (e) => {
        e.preventDefault()

        try {

            const data = {
                ...formData,
                products: formData.products.map(id => ({ id }))
            };

            const res = await api.put(`/promotions/${formData.id}`, data);

            setPromotions(promotions.map(p =>
                p.id === res.data.id ? res.data : p
            ));

            setShowEdit(false);
            setFormData(defaultForm());

            toast.success("Cập nhật voucher thành công!")
        } catch (error) {
            console.log(error)
            toast.error("Cập nhật voucher thất bại")
        }
    }

    const productOptions = products.map(product => ({
        value: product.id,
        label: product.name
    }));

    return (
        <>
            <div className="products-container">
                <div className="header">
                    <h2>Quản lý Voucher</h2>

                    <div className="filters">
                        <input type="text" placeholder='Tìm voucher...' value={search} onChange={(e) => setSearch(e.target.value)}/>
                    </div>

                    <button className='add-btn' onClick={() => {setShowModal(true)}}>Add Voucher</button>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên</th>
                                <th>Mã voucher</th>
                                <th>Giảm (%)</th>
                                <th>Bắt đầu</th>
                                <th>Kết thúc</th>
                                <th>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {filterProduct.map((product, index) => (
                                <tr key = {product.id}>
                                    <td> {(page - 1) * 20 + index + 1} </td>
                                    <td>{product.name}</td>
                                    <td>{product.code}</td>
                                    <td>{product.discount}%</td>
                                    <td>{product.startDate}</td>
                                    <td>{product.endDate}</td>
                                    <td>{product.active ? "Đang áp dụng" : "Ngừng"}</td>
                                    <td>
                                        <button className='action-btn' onClick={() => handleEdit(product)}>Edit</button>
                                        <button className='action-btn' onClick={() => deleteProd(product.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />

                    <p className="product-count">
                        Showing {(page - 1) * 20 + 1} - {(page - 1) * 20 + filterProduct.length} trong tổng {promotions.length} chương trình
                    </p>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Thêm chương trình khuyến mãi</h3>
                        <hr />

                        <form onSubmit={handleSubmit}>

                            <input
                                type="text"
                                name="name"
                                placeholder="Tên chương trình"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="code"
                                placeholder="Mã voucher (VD: WELCOME10)"
                                value={formData.code}
                                onChange={handleChange}
                                required
                            />

                            <textarea
                                name="description"
                                placeholder="Mô tả"
                                value={formData.description}
                                onChange={handleChange}
                            />

                            <input
                                type="number"
                                name="discount"
                                placeholder="Giảm giá (%)"
                                min="0"
                                max="100"
                                value={formData.discount}
                                onChange={handleChange}
                                required
                            />

                            <label>Ngày bắt đầu</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />

                            <label>Ngày kết thúc</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />

                            <label>Sản phẩm áp dụng</label>

                            <Select
                                isMulti
                                options={productOptions}
                                value={productOptions.filter(option =>
                                    formData.products.includes(option.value)
                                )}
                                onChange={(selected) =>
                                    setFormData({
                                        ...formData,
                                        products: selected
                                            ? selected.map(item => item.value)
                                            : []
                                    })
                                }
                                placeholder="Chọn sản phẩm..."
                                closeMenuOnSelect={false}
                            />

                            <div className="button">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setFormData(defaultForm());
                                    }}
                                >
                                    Huỷ
                                </button>

                                <button type="submit">
                                    Save
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {showEdit && (
                <div className="edit-layout">
                    <div className="edit">
                        <h3>Cập nhật chương trình khuyến mãi</h3>
                        <hr />

                        <form onSubmit={handleEdited}>

                            <input
                                type="text"
                                name="name"
                                placeholder="Tên chương trình"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="code"
                                placeholder="Mã voucher (VD: WELCOME10)"
                                value={formData.code}
                                onChange={handleChange}
                                required
                            />

                            <textarea
                                name="description"
                                placeholder="Mô tả"
                                value={formData.description}
                                onChange={handleChange}
                            />

                            <input
                                type="number"
                                name="discount"
                                placeholder="Giảm giá (%)"
                                min="0"
                                max="100"
                                value={formData.discount}
                                onChange={handleChange}
                                required
                            />

                            <label>Ngày bắt đầu</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />

                            <label>Ngày kết thúc</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />

                            <select
                                name="active"
                                value={String(formData.active)}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        active: e.target.value === "true"
                                    })
                                }
                            >
                                <option value="true">Đang áp dụng</option>
                                <option value="false">Ngừng áp dụng</option>
                            </select>

                            <label>Sản phẩm áp dụng</label>

                            <Select
                                isMulti
                                options={productOptions}
                                value={productOptions.filter(option =>
                                    formData.products.includes(option.value)
                                )}
                                onChange={(selected) =>
                                    setFormData({
                                        ...formData,
                                        products: selected
                                            ? selected.map(item => item.value)
                                            : []
                                    })
                                }
                                placeholder="Chọn sản phẩm..."
                                closeMenuOnSelect={false}
                            />

                            <div className="button">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEdit(false);
                                        setFormData(defaultForm());
                                    }}
                                >
                                    Huỷ
                                </button>

                                <button type="submit">
                                    Lưu
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </>
    )
}

export default Promotion;