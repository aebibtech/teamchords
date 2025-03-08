import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { UserProfile } from "../context/ProfileContext";
import { getProfile } from "../utils/common";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signInUser, session } = UserAuth();
  const { setUserProfile } = UserProfile();
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

  return (
    <div className="bg-gray-700 w-screen h-screen flex flex-col items-center align-center">
      <form onSubmit={handleSignIn} className="m-auto p-12 border rounded bg-gray-100">
        <h1 className="text-2xl mb-12 font-bold text-center"><Link to="/">Team Chords</Link></h1>
        <h2 className="font-bold pb-2">Sign in</h2>
        <p>
          Don't have an account yet? <Link className="text-blue-500" to="/signup">Sign up</Link>
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
        {error && <p className="text-red-600 text-center pt-4">{error}</p>}
      </form>
    </div>
  );
};

export default Signin;
