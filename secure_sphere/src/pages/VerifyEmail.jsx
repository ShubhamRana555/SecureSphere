
import { useEffect, useState } from "react";

const VerifyEmail = () => {
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isVerified = urlParams.get('verified');
    const error = urlParams.get('error');

    console.log("VerifyEmail: URL Parameters:", { isVerified, error });
    console.log("VerifyEmail: Full URL:", window.location.href);

    if (isVerified === 'true') {
      setStatus("success");
      setMessage("Email verified successfully!");
    } else if (error === 'expired') {
      setStatus("error");
      setMessage("Verification token has expired. Please request a new verification email.");
    } else if (error === 'invalid') {
      setStatus("error");
      setMessage("Invalid verification token. Please check your email link or request a new one.");
    } else {
      setStatus("error");
      setMessage("Something went wrong during verification.");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-[#0e1b2c]">
      <div className="text-center text-white bg-[#1e293b] p-8 rounded-lg shadow-md">
        <h2 className="text-white text-xl mb-4">Email Verification</h2>
        {status === "loading" && <p>Verifying...</p>}
        {status === "success" && (
          <p className="text-green-400 font-semibold text-lg">✅ {message}</p>
        )}
        {status === "error" && (
          <p className="text-red-400 font-semibold text-lg">❌ {message}</p>
        )}
        <p className="text-gray-400 text-sm mt-4">Status: {status}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
