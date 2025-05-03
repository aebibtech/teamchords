import { User, Power, Library, BookAudio, Guitar } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const MobileSidebar = () => {
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

  return (
    <nav className={`md:hidden bg-gray-700 text-white w-screen fixed bottom-0 flex justify-between p-2 transition-all duration-300 ease-in-out z-50`}>
      <MobileNavItem to="/library" icon={<Library size={16} />} label="Chord Library" />
      <MobileNavItem to="/setlists" icon={<BookAudio size={16} />} label="Set Lists" />
      <MobileNavItem to="/profile" icon={<User size={16} />} label="Profile" />
      <MobileNavItem onClick={handleSignOut} icon={<Power size={16} />} label="Sign out" />
    </nav>
  );
};

function MobileNavItem({ to, icon, label, onClick }) {
  if (to) {
    return (
      <Link
        to={to}
        className="flex flex-col w-full justify-center items-center space-y-2 rounded-md cursor-pointer hover:bg-gray-500"
        title={label}
      >
        {icon}
        <span className="text-xs">{label}</span>
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex flex-col w-full justify-center items-center space-y-2 rounded-md cursor-pointer hover:bg-gray-500"
      title={label}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}
  

export default MobileSidebar;