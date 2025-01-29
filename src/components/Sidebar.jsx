import { Menu, X, Home, User, Power, Library, BookAudio, LucideFileMusic } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, session } = UserAuth();

  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      await signOut();
    } catch (err) {
      setError("An unexpected error occurred."); // Catch unexpected errors
    }
  };

  return (
    <div className={`${ isOpen ? "w-64" : "w-20" } bg-white shadow-md h-full flex flex-col p-4 transition-all duration-300 ease-in-out`}>
        <button
            className="mb-6 p-2 rounded-md hover:bg-gray-200"
            onClick={() => setIsOpen(!isOpen)}
        >
            {isOpen ? <span className="flex items-center space-x-4 p-2 rounded-md cursor-pointer hover:bg-gray-200"><LucideFileMusic size={24} /> <span className="text-gray-700 font-bold">Team Chords</span></span> : <LucideFileMusic size={24} />}
        </button>

        <nav className="flex flex-col justify-between h-full">
            <div className="flex flex-col space-y-4">
                <NavItem to="/library" icon={<Library size={24} />} label="Chord Library" isOpen={isOpen} />
                <NavItem to="/setlist" icon={<BookAudio size={24} />} label="Set List" isOpen={isOpen} />
            </div>
            <div className="flex flex-col space-y-4">
                <hr />
                <NavItem onClick={e => e.preventDefault()} icon={<User size={24} />} label={session?.user?.email} isOpen={isOpen} />
                <NavItem onClick={handleSignOut} icon={<Power size={24} />} label="Sign out" isOpen={isOpen} />
            </div>
        </nav>
    </div>
  );
};

function NavItem({ to, icon, label, isOpen, onClick }) {
    if (to) {
      return (
        <Link
          to={to}
        className="flex items-center space-x-4 p-2 rounded-md cursor-pointer hover:bg-gray-200"
      >
        {icon}
          {isOpen && <span className="text-gray-700">{label}</span>}
        </Link>
      );
    }
  
    return (
      <button
        onClick={onClick}
        className="flex items-center space-x-4 p-2 rounded-md cursor-pointer hover:bg-gray-200"
      >
        {icon}
        {isOpen && <span className="text-gray-700">{label}</span>}
      </button>
    );
  }
  

export default Sidebar;