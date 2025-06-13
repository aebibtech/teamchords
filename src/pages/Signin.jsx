import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/useProfileStore";
import { getProfile } from "../utils/common";
import MainLogo from "../components/MainLogo";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signInUser, signInWithProvider, session } = useAuthStore();
  const { setUserProfile } = useProfileStore();
  const navigate = useNavigate();

  const fetchProfile = async (data) => {
    const d = await getProfile(data?.user?.id);
    if (d) {
      setUserProfile(d);
      setLoading(false);
      navigate("/library");
    }
    else {
      navigate("/onboard");
    }
  };

  useEffect(() => {
    if (session) {
      fetchProfile(session);
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await signInUser(email, password); // Use your signIn function

    if (error) {
      setError(error); // Set the error message if sign-in fails
      setLoading(false);
      // Set a timeout to clear the error message after a specific duration (e.g., 3 seconds)
      setTimeout(() => {
        setError("");
      }, 3000); // 3000 milliseconds = 3 seconds
    } else {
      // Redirect or perform any necessary actions after successful sign-in
      await fetchProfile(data);
    }
  };

  const handleOAuthSignIn = async (provider) => {
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
      <form onSubmit={handleSignIn} className="m-auto p-12 border rounded bg-gray-100">
        <h1 className="text-2xl mb-12 font-bold text-center flex justify-center"><Link to="/"><MainLogo size={96} /></Link></h1>
        <h2 className="font-bold pb-2">Sign in</h2>
        <p>
          Don&apos;t have an account yet? <Link className="text-blue-500" to="/signup">Sign up</Link>
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
        <button className="w-full mt-4 border rounded bg-gray-500 p-2 text-white hover:bg-gray-600 disabled:opacity-50" disabled={loading}>Sign In</button>
        <div className="flex flex-col gap-2 mt-4">
          <button
            type="button"
            className="w-full border rounded flex items-center justify-center gap-2 bg-white p-2 text-gray-700 hover:bg-gray-200 shadow"
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
          >
            <FcGoogle size={20} />
            <span>Sign in with Google</span>
          </button>
          <button
            type="button"
            className="w-full border rounded flex items-center justify-center gap-2 bg-blue-800 p-2 text-white hover:bg-blue-900 shadow"
            onClick={() => handleOAuthSignIn('facebook')}
            disabled={loading}
          >
            <FaFacebookF size={20} />
            <span>Sign in with Facebook</span>
          </button>
        </div>
        {error && <p className="text-red-600 text-center pt-4">{error}</p>}
      </form>
    </div>
  );
};

export default Signin;
