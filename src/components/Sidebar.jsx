import { User, Power, Library, BookAudio, Guitar } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import MobileSidebar from "./MobileSidebar";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, session } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      await signOut();
      navigate("/signin");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSidebarToggle = () => {
    if (document.body.clientWidth >= 720) {
      setIsOpen(!isOpen);
    }
    else {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className={`${ isOpen ? "w-64" : "w-20" } hidden md:flex bg-gray-700 text-white h-screen flex-col p-4 transition-all duration-300 ease-in-out`}>
        <button
            className="p-2 rounded-md hover:bg-gray-500"
            onClick={handleSidebarToggle}
            title="Toggle Sidebar"
        >
            {isOpen ? <span className="flex items-center space-x-4 p-2 cursor-pointer"><Guitar size={24} /> <span className="font-bold">Team Chords</span></span> : <Guitar size={24} />}
        </button>
        <hr className="my-4" />
        <nav className="flex flex-col justify-between h-full">
            <div className="flex flex-col space-y-4">
                <NavItem to="/library" icon={<Library size={24} />} label="Chord Library" isOpen={isOpen} />
                <NavItem to="/setlists" icon={<BookAudio size={24} />} label="Set Lists" isOpen={isOpen} />
            </div>
            <div className="flex flex-col space-y-4">
                <hr />
                <NavItem to="/profile" icon={<User size={24} />} label={session?.user?.email} isOpen={isOpen} />
                <NavItem onClick={handleSignOut} icon={<Power size={24} />} label="Sign out" isOpen={isOpen} />
            </div>
        </nav>
      </div>
      <MobileSidebar />
    </>
  );
};

function NavItem({ to, icon, label, isOpen, onClick }) {
    if (to) {
      return (
        <Link
          to={to}
          className="flex items-center space-x-4 p-2 rounded-md cursor-pointer hover:bg-gray-500"
          title={label}
        >
          {icon}
          {isOpen && <span>{label}</span>}
        </Link>
      );
    }
  
    return (
      <button
        onClick={onClick}
        className="flex items-center space-x-4 p-2 rounded-md cursor-pointer hover:bg-gray-500"
        title={label}
      >
        {icon}
        {isOpen && <span>{label}</span>}
      </button>
    );
  }
  

export default Sidebar;