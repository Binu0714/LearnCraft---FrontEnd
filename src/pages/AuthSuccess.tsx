import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/authContext"; 
import { getMyDetails } from "../services/auth";  
import { useSnackbar } from 'notistack';    

const AuthSuccess: React.FC = () => {

  const { enqueueSnackbar } = useSnackbar();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const handleSocialLogin = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");

      if (accessToken) {
        try {
          localStorage.setItem("accessToken", accessToken);
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }

            const res = await getMyDetails();
            setUser(res.data); 

            setTimeout(() => {
                navigate("/dashboard"); 
            }, 1000);

        } catch (error) {
            console.error("Failed to verify social login:", error);
            enqueueSnackbar("Social login failed. Please try logging in again.", { variant: "error" });
            navigate("/login");
        }
      } else {
            enqueueSnackbar("No access token found. Please try logging in again.", { variant: "error" });
            navigate("/login");

      }
    };

    handleSocialLogin();
  }, [searchParams, navigate, setUser]);

  // A simple loading screen while processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-slate-700">Logging you in...</h2>
        <p className="text-slate-500">Please wait a moment.</p>
      </div>
    </div>
  );
};

export default AuthSuccess;