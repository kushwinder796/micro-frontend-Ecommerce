import { Navigate, Outlet } from "react-router-dom";

interface Props {
  role: "User" | "Admin";
}

const ProtectedRoute = ({ role }: Props) => {
  const token   = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token) return <Navigate to="/auth/login" replace />;

  let userRole = "";
  try {
    const user = JSON.parse(userStr || "{}");
    userRole = user.role ?? "";
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }


  if (!userRole) return <Navigate to="/auth/login" replace />;
  if (userRole !== role) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;