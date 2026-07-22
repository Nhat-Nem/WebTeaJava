import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Dashboard from "./Dashboard/Dashboard";
import Products from "./Products/Products";
import Categories from "./Categories/Categories";
import Login from "./Login/Login";
import Order from "./Orders/Order";
import User from "./User/User";
import Promotion from "./Promotion/Promotion";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/admin/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element = {<Order />} />
            <Route path="users" element = {<User />} />
            <Route path="promotions" element = {<Promotion />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;