// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";

// const VerifyOtpPage = () => {
//   const { state } = useLocation();
//   const email = state?.email || "";
//   const navigate = useNavigate();

//   const [otp, setOtp] = useState("");
//   const [message, setMessage] = useState("");
//   const [resending, setResending] = useState(false);

//   const handleVerify = async () => {
//     try {
//       const res = await axios.post("http://localhost:5000/api/verify-otp", { email, otp });
//       setMessage(res.data.message);
       
      
//     //   here handle signup logic 
//       const response = await axios.post("http://localhost:3000/api/v1/signup", {
//              name,
//              email,
//              password,
//              phone,
//              // role: "user", // optional field, or set default in schema
//            });
//            if (response.data.success) {
//              // Assuming the backend sends a token in response
//            const { token } = response.data;
     
//            // Save the token in localStorage (or sessionStorage)
//            localStorage.setItem("token", token);
//            setToken(token);
//              // toast.success(response.data.message);
//              toast.success("Wellcome to study hub ");
//              setIsLoggedIn(true);
//              navigate("/ask");
//            } else {
//              toast.error(response.data.message || "Signup failed");
//            }
//     } catch (err) {
//       setMessage("Invalid or expired OTP");
//     }
//   };

//   const handleResend = async () => {
//     setResending(true);
//     try {
//       await axios.post("http://localhost:5000/api/send-otp", { email });
//       setMessage("OTP resent");
//     } catch {
//       setMessage("Resend failed");
//     } finally {
//       setResending(false);
//     }
//   };

//   return (
//     <div>
//       <h3>OTP sent to {email}</h3>
//       <input
//         type="text"
//         placeholder="Enter OTP"
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//       />
//       <button onClick={handleVerify}>Verify OTP</button>
//       <p>{message}</p>
//       <button onClick={handleResend} disabled={resending}>
//         {resending ? "Resending..." : "Resend OTP"}
//       </button>
//     </div>
//   );
// };

// export default VerifyOtpPage;




import { useAppContext } from '../context/AppContext';
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyOtpPage = () => {
  const { state } = useLocation();
  const { email, name, password, phone } = state || {};
  const navigate = useNavigate();
  const { setIsLoggedIn, setToken } = useAppContext();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    try {
      if (!otp) {
        setMessage("Please enter the OTP.");
        return;
      }

      const res = await axios.post("http://localhost:3000/api/verify-otp", { email, otp });
      setMessage(res.data.message);

      const response = await axios.post("http://localhost:3000/api/v1/signup", { name, email, password, phone });

      if (response.data.success) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        setToken(token);
        toast.success("Welcome to Study Hub!");
        setIsLoggedIn(true);
        navigate("/ask");
      } else {
        if (response.data.message === "User already exists") {
          toast.error("User already exists. Please try logging in.");
          navigate("/signup", { state: { message: "User already exists" } });
        } else {
          toast.error(response.data.message || "Signup failed");
        }
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage("Invalid or expired OTP");
        toast.error("Error during OTP verification");
      } else {
        toast.error("Error during verification or signup");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);

    try {
      await axios.post("http://localhost:3000/api/send-otp", { email });
      setMessage("OTP resent");
      toast.success("OTP resent successfully");
    } catch (err) {
      setMessage("Resend failed");
      toast.error("Error while resending OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">OTP sent to {email}</h3>
        <input
          type="text"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          className={`w-full p-3 mb-4 text-white font-semibold rounded-md ${isVerifying ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          onClick={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </button>
        <p className="text-red-500 text-sm mb-4">{message}</p>
        <button
          className={`w-full p-3 text-white font-semibold rounded-md ${resending ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? "Resending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
