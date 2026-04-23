import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import "../index.css";


const AdminProductPage=lazy(()=> import ("../pages/AdminProductPage"));
const  UserProductPage=lazy (()=> import ("../pages/UserProductPage"));


const ProductsApp = () => {

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role: string = user?.role || "User";

  return (
  <div className="max-w-screen-2xl mx-auto px-4">
      <Suspense  fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <Routes>
        <Route
          index
          element={
            role === "Admin"
              ? <AdminProductPage />
              : <UserProductPage />
          }
        />
      
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </Suspense>
  </div>
  );
};

export default ProductsApp;