import { useEffect, useState } from 'react';
import api from '../services/api'
import './Products.css'
import { toast } from 'react-toastify'
import Pagination from '../components/Panigations/Panigation';
import '../components/Panigations/Panigation.css'
import Swal from 'sweetalert2';

const defaultForm = () => ({
    _id: null,
    name: "",
    price: "",
    quantity: "",
    sold: 0,
    description: "",
    image: null,
    category: "",
    active: true
});

function Products() {

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState("")
    const [filcategory, setFilCategory] = useState("")
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [categories, setCategories] = useState([])
    const [imagePreview, setImagePreview] = useState(null)
    const [showEdit, setShowEdit] = useState(false)
    const [formData, setFormData] = useState(defaultForm())

    useEffect(() => {
        console.log(api.defaults.baseURL)
        api.get("/products")
            .then(res => {
                console.log("API:", res.data);
                console.log("isArray:", Array.isArray(res.data));
                setProducts(res.data);
            })
            .catch(console.error);

        api.get("/categories")
            .then(res => {console.log("cate", res.data); setCategories(res.data)})
            .catch(console.error);
    }, []);

    useEffect(() => {
        //nếu modal mở có thể ấn "esc" de thoát form
        if (!showModal && !showEdit) return;
        const handleKeydown = async (e) => {
            if (e.key == "Escape") {
                console.log("ESC")
                setShowModal(false)
                setImagePreview(null)
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
        document.title = 'Quản lý sản phẩm - Admin'
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
            await api.delete(`/products/${id}`)
            setProducts(products.filter(product => product.id != id))
            toast.success('Xoá sản phẩm thành công')
        } catch (error) {
            console.log(error)
            toast.error('Xoá sản phẩm thất bại')
        }
    }

    const handleChange = (e) => {

        if (e.target.name === 'image') {
            const file = e.target.files[0]
            setFormData({ ...formData, image: file })

            if (file) {
                setImagePreview(URL.createObjectURL(file))
            }
        }

        else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
    }

    const filterProduct = products.filter(product => {
        const matchName = product.name.toLowerCase().includes(search.toLowerCase())
        const matchCate =
            filcategory
                ? product.category?.id === Number(filcategory)
                : true;
        return matchName && matchCate
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData()

            data.append("name", formData.name)
            data.append("price", formData.price)
            data.append("category", formData.category)
            data.append("quantity", formData.quantity);
            data.append("sold", 0);
            data.append("description", formData.description);
            data.append("active", formData.active);
            data.append("image", formData.image)
            
            console.log(data);
    console.log(data instanceof FormData);

            const res = await api.post('/products', data)

            setPage(1)
            setProducts([...products, res.data])
            setShowModal(false)

            setFormData(defaultForm())
            setImagePreview(null)

            toast.success("Thêm sản phẩm thành công")
        } catch (error) {
            console.log(error)
            toast.error("Thêm sản phẩm thất bại")
        }
    }

    const handleEdit = (product) => {
 
        setFormData({
            _id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            sold: product.sold,
            description: product.description,
            category: product.category?.id,
            image: product.image,
            active: product.active
        });

        setImagePreview(product.image)
        setShowEdit(true)
    }

    const handleEdited = async (e) => {
        e.preventDefault()

        try {
            const data = new FormData()
            data.append("name", formData.name)
            data.append("price", formData.price)
            data.append("quantity", formData.quantity)
            data.append("description", formData.description)
            data.append("active", formData.active)
            data.append("category", formData.category)

            if (formData.image instanceof File) {
                data.append("image", formData.image)
            }


            const res = await api.put(`/products/${formData._id}`, data)

            setProducts(products.map(p => 
                p.id === formData._id ? res.data : p
            ))
        
            setFormData(defaultForm())
            setShowEdit(false)
            setImagePreview(null)

            toast.success("Cập nhật sản phẩm thành công!")
        } catch (error) {
            console.log(error)
            toast.error("Cập nhật sản phẩm thất bại")
        }
    }

    return (
        <>
            <div className="products-container">
                <div className="header">
                    <h2>Quản lý sản phẩm</h2>

                    <div className="filters">
                        <input type="text" placeholder='Tìm sản phẩm...' value={search} onChange={(e) => setSearch(e.target.value)}/>

                        <select value={filcategory} onChange={(e) => setFilCategory(e.target.value)}>
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}> {cat.name} </option>
                            ))}
                        </select>
                    </div>

                    <button className='add-btn' onClick={() => {setShowModal(true)}}>Add Product</button>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Hình ảnh</th>
                                <th>Tên </th>
                                <th>Giá tiền</th>
                                <th>Số lượng</th>
                                <th>Lượt mua</th>
                                <th>Danh mục</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filterProduct.map((product, index) => (
                                <tr key = {product.id}>
                                    <td> {(page - 1) * 20 + index + 1} </td>
                                    <td>
                                        <img src={product.image} 
                                        alt={product.name}
                                        style={{
                                            width: 70,
                                            height: 70,
                                            objectFit: "cover"
                                        }} 
                                        onError={(e) => console.log(e.target.src)}/>
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{Number(product.price).toLocaleString('vi-VN')}₫</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.sold}</td>
                                    <td>{product.category?.name}</td>
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
                        Showing {(page - 1) * 20 + 1} - {(page - 1) * 20 + filterProduct.length} trong tổng {products.length} sản phẩm
                    </p>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Add Product</h3>
                        <hr />
                        <form onSubmit={handleSubmit}>
                            <input type="text" name='name' placeholder='Tên sản phẩm' value={formData.name} onChange={handleChange} required/>
                            <input type="text" name='price' placeholder='Giá sản phẩm' value={formData.price} onChange={handleChange} required/>
                            <input
                                type="number"
                                name="quantity"
                                placeholder="Số lượng"
                                value={formData.quantity}
                                onChange={handleChange}
                            />

                            <div className="form-group">
                                <label>Đã bán</label>
                                <input
                                    type="number"
                                    value={0}
                                    readOnly
                                />
                            </div>

                            <textarea
                                name="description"
                                placeholder="Mô tả"
                                value={formData.description}
                                onChange={handleChange}
                            />
                            <select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">-- Chọn mục sản phẩm -- </option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            <label>Ảnh chính</label>
                            <input type="file" name='image' onChange={handleChange} required/>
                            
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview}/>
                                </div>
                            )}

                            

                            <div className="button">
                                <button type='button' onClick={() => {setShowModal(false); setFormData(defaultForm()); setImagePreview(null)}}>Huỷ</button>
                                <button type='submit' onClick={() => setImagePreview(null)}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEdit && (
                <div className="edit-layout">
                    <div className="edit">
                        <h3>Edit Products</h3>
                        <hr />
                        <form onSubmit={handleEdited}>
                            {/* Ảnh hien tai product */}
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview} />
                                </div>
                            )}

                            {/* button thay doi anh */}
                            <input type="file" name='image'onChange={handleChange} />


                            {/* cac gia tri con lai */}
                            <input type="text" name='name' value={formData.name} onChange={handleChange}/>
                            <input
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                            />

                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                            />

                            <div className="form-group">
                                <label>Đã bán</label>
                                <input
                                    type="number"
                                    value={formData.sold}
                                    readOnly
                                />
                            </div>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />

                            <select
                                name="active"
                                value={String(formData.active)}
                                onChange={(e)=>
                                    setFormData({
                                        ...formData,
                                        active: e.target.value === "true"
                                    })
                                }
                            >
                                <option value="true">Hiển thị</option>
                                <option value="false">Ẩn</option>
                            </select>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            <div className="button">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEdit(false);
                                        setFormData(defaultForm());
                                        setImagePreview(null);
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

export default Products;