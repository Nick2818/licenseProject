import { useNavigate } from "react-router-dom";
import useUserRole from "./useUserRole";
import { useEffect } from "react";

const RoleBasedRedirect = () => {
  const role = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "ADMIN") {
      navigate("/admin");
    } else if (role === "USER") {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [role, navigate]);

  return null;
};
