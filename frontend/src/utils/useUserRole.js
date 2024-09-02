import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useUserRole = () => {
  const [role, setRole] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken(true);
          //console.log("TOKEN:", token);
          const decodedToken = jwtDecode(token);
          setRole(decodedToken.role); // Assuming 'role' is a custom claim set in the token
        } catch (error) {
          console.error("Failed to retrieve or decode token", error);
          setRole(null);
        }
      } else {
        setRole(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return role;
};

export default useUserRole;
