import { useEffect, useState } from 'react';
import api from '../services/api'
import { toast } from 'react-toastify'
import Pagination from '../components/Panigations/Panigation';
import "../Products/Products.css"
import Swal from 'sweetalert2';

const defaultForm = () => ({
    id: null,
    name: "",
    status: true
});

function Categories() {

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [categories, setCategories] = useState([])
    const [showEdit, setShowEdit] = useState(false)
    const [formData, setFormData] = useState(defaultForm())

    useEffect(() => {
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
        document.title = 'Quản lý danh mục - Admin'
    }, [])

    const deleteCate = async (id) => {

        const result = await Swal.fire({
            title: "Xoá danh mục?",
            text: "Không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true
        });

        if (!result.isConfirmed) return;

        try {

            await api.delete(`/categories/${id}`);

            setCategories(categories.filter(c => c.id !== id));

            toast.success("Đã xoá");

        } catch (err) {
            toast.error("Xoá thất bại");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const filterCategory = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const res = await api.post("/categories", {
                name: formData.name,
                status: formData.status
            });

            setCategories([...categories, res.data]);

            setShowModal(false);
            setFormData(defaultForm());

            toast.success("Thêm danh mục thành công");

        } catch (err) {
            toast.error("Thêm thất bại");
        }
    };

    const handleEdit = (category) => {

        setFormData({
            id: category.id,
            name: category.name,
            status: category.status
        });

        setShowEdit(true);
    };

    const handleEdited = async (e) => {
        e.preventDefault();

        try {

            const res = await api.put(
                `/categories/${formData.id}`,
                {
                    name: formData.name,
                    status: formData.status
                }
            );

            setCategories(
                categories.map(c =>
                    c.id === formData.id ? res.data : c
                )
            );

            setShowEdit(false);
            setFormData(defaultForm());

            toast.success("Cập nhật thành công");

        } catch (err) {
            toast.error("Cập nhật thất bại");
        }
    };

    return (
        <>
            <div className="products-container">
                <div className="header">
                    <h2>Quản lý danh mục</h2>

                    <div className="filters">
                        <input type="text" placeholder='Tìm danh mục...' value={search} onChange={(e) => setSearch(e.target.value)}/>
                    </div>

                    <button className='add-btn' onClick={() => {setShowModal(true)}}>Add Category</button>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên danh mục</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>

                        <tbody>

                        {filterCategory.map((cate,index)=>(

                        <tr key={cate.id}>

                        <td>{index+1}</td>

                        <td>{cate.name}</td>

                        <td>
                            {cate.status ? "Hiển thị" : "Ẩn"}
                        </td>

                        <td>
                            <button
                                className="action-btn"
                                onClick={()=>handleEdit(cate)}
                            >
                                Edit
                            </button>

                            <button
                                className="action-btn"
                                onClick={()=>deleteCate(cate.id)}
                            >
                                Delete
                            </button>
                        </td>

                        </tr>

                        ))}

                        </tbody>
                    </table>

                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />

                    <p className="product-count">
                        Hiển thị {filterCategory.length} / {categories.length} danh mục
                    </p>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Add Category</h3>
                        <hr />
                        <form onSubmit={handleSubmit}>

                            <input
                                type="text"
                                name="name" required
                                placeholder="Tên danh mục"
                                value={formData.name}
                                onChange={handleChange}
                            />

                            <select
                                name="status"
                                value={String(formData.status)}
                                onChange={(e)=>
                                    setFormData({
                                        ...formData,
                                        status:e.target.value==="true"
                                    })
                                }
                            >

                            <option value="true">Hiển thị</option>
                            <option value="false">Ẩn</option>

                            </select>

                            <div className="button">

                            <button
                            type="button"
                            onClick={()=>setShowModal(false)}
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

            {showEdit && (
                <div className="edit-layout">
                    <div className="edit">
                        <h3>Edit Category</h3>
                        <hr />
                        <form onSubmit={handleEdited}>

                            <input
                                type="text"
                                name="name"
                                placeholder="Tên danh mục"
                                value={formData.name}
                                onChange={handleChange}
                            />

                            <select
                                name="status"
                                value={String(formData.status)}
                                onChange={(e)=>
                                    setFormData({
                                        ...formData,
                                        status:e.target.value==="true"
                                    })
                                }
                            >

                            <option value="true">Hiển thị</option>
                            <option value="false">Ẩn</option>

                            </select>

                            <div className="button">

                            <button
                            type="button"
                            onClick={()=>{setShowEdit(false); setFormData(defaultForm())}}
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

export default Categories;