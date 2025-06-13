import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import MainLogo from "../components/MainLogo";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signUpNewUser, signInWithProvider } = useAuthStore();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signUpNewUser(email, password); // Call context function

      if (result.success) {
        navigate("/onboard"); // Navigate to dashboard on success
      } else {
        setError(result.error.message); // Show error message on failure
      }
    } catch (err) {
      setError("An unexpected error occurred."); // Catch unexpected 
      console.error(err);
    } finally {
      setLoading(false); // End loading state
    }
  };

  const handleOAuthSignUp = async (provider) => {
    setLoading(true);
    const { error } = await signInWithProvider(provider);
    if (error) {
      setError(error);
      setLoading(false);
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="bg-gray-700 w-screen h-screen flex flex-col items-center align-center">
      <form onSubmit={handleSignUp} className="m-auto p-12 border rounded bg-gray-100">
        <h1 className="text-2xl mb-12 font-bold text-center flex justify-center"><Link to="/"><MainLogo size={96} /></Link></h1>
        <h2 className="font-bold pb-2">Sign up today!</h2>
        <p>
          Already have an account? <Link className="text-blue-500" to="/signin">Sign in</Link>
        </p>
        <div className="flex flex-col py-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 mt-2 border rounded"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
          />
        </div>
        <div className="flex flex-col py-4">
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 mt-2 border rounded"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
        </div>
        <button type="submit" disabled={loading} className="w-full mt-4 border rounded bg-gray-500 p-2 text-white hover:bg-gray-600 disabled:opacity-50">
          Sign Up
        </button>
        <div className="flex flex-col gap-2 mt-4">
          <button
            type="button"
            className="w-full border rounded flex items-center justify-center gap-2 bg-white p-2 text-gray-700 hover:bg-gray-200 shadow"
            onClick={() => handleOAuthSignUp('google')}
            disabled={loading}
          >
            <FcGoogle size={20} />
            <span>Sign up with Google</span>
          </button>
          <button
            type="button"
            className="w-full border rounded flex items-center justify-center gap-2 bg-blue-800 p-2 text-white hover:bg-blue-900 shadow"
            onClick={() => handleOAuthSignUp('facebook')}
            disabled={loading}
          >
            <FaFacebookF size={20} />
            <span>Sign up with Facebook</span>
          </button>
        </div>
        {error && <p className="text-red-600 text-center pt-4">{error}</p>}
      </form>
    </div>
  );
};

export default Signup;
