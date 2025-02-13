import { Link, useNavigate } from "react-router-dom";
import { Guitar } from "lucide-react";
import { UserAuth } from "./context/AuthContext";
import { useEffect } from "react";

function App() {
  const { session } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/library");
    }
  }, [session]);

  return (
    <div>
      <div className="flex justify-between p-2 shadow-md text-white bg-gray-700">
        <h1 className="my-auto">
          <Guitar size={32} className="inline-block" /> Team Chords
        </h1>
        <div className="flex">
          <Link
            className="px-4 py-3 mt-1 rounded my-auto hover:bg-gray-500"
            to="/signin"
          >
            Sign in
          </Link>
        </div>
      </div>
      <div className="text-center font-bold">Home Page Content</div>
    </div>
  );
}

export default App;
