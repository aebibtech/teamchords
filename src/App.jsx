import { Link } from "react-router-dom";
import { Guitar } from "lucide-react";

function App() {
  return (
    <div className="flex justify-between p-2 shadow-md">
      <h1 className="text-3xl my-auto">
        <Guitar size={32} className="inline-block" /> Team Chords
      </h1>
      <div className="flex">
        <Link
          className="px-4 py-3 mt-1 my-auto hover:text-gray-500"
          to="/signin"
        >
          Sign in
        </Link>
        <Link
          className="px-4 py-3 mt-1 my-auto hover:text-gray-500"
          to="/signup"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default App;
