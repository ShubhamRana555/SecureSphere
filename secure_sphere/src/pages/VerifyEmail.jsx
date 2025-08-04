
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if email was already verified (from URL parameter)
    const urlParams = new URLSearchParams(window.location.search);
    const isVerified = urlParams.get('verified');
    
    if (isVerified === 'true') {
      setStatus("success");
      setMessage("Email verified successfully!");
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/auth/verify-email/${token}`);
        console.log("✅ Email verified response:", res.data);
        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        console.error("❌ Error verifying email:", err.response?.data || err.message);
        console.log("Full error object:", err);
        console.log("Error response data:", err.response?.data);
        console.log("Error status:", err.response?.status);
        
        // Check if the error is because email is already verified
        if (err.response?.data?.message?.includes("already verified")) {
          setStatus("success");
          setMessage("Email has already been verified successfully!");
        } else {
          setStatus("error");
          setMessage(err.response?.data?.message || "Something went wrong during verification.");
        }
      }
    };


    verify();
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#0e1b2c]">
      <div className="text-center text-white bg-[#1e293b] p-8 rounded-lg shadow-md">
        {status === "loading" && <p>Verifying...</p>}
        {/* <p className="text-green-400 font-semibold text-lg">✅ Email Verified successfully</p> */}
        {status === "success" && (
          <p className="text-green-400 font-semibold text-lg">✅ {message}</p>
        )}
        {status === "error" && (
          <p className="text-red-400 font-semibold text-lg">❌ {message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
