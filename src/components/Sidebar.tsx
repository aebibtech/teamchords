import { User, Power, Library, BookAudio } from "lucide-react";
import { useState, type MouseEvent, type ReactNode, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import MobileSidebar from "./MobileSidebar";
import MainLogo from "./MainLogo";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/useProfileStore";

const Sidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, session, setSession } = useAuthStore();
  const { setUserProfile } = useProfileStore();
  const navigate = useNavigate();

  const handleSignOut = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      await signOut();
      setSession(null);
      setUserProfile(null);
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
            {isOpen ? <span className="flex items-center space-x-4 p-2 cursor-pointer"><MainLogo size={32} /> <span className="font-bold">Team Chords</span></span> : <MainLogo size={32} />}
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

interface NavItemProps {
  to?: string;
  icon: ReactNode;
  label: React.ReactNode;
  isOpen?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

function NavItem({ to, icon, label, isOpen, onClick }: NavItemProps) {
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