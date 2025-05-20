import { User, Power, Library, BookAudio } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import type { FC, MouseEvent, ReactNode } from 'react';

const MobileSidebar: FC = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async (e: MouseEvent<HTMLButtonElement>) => {
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

interface MobileNavItemProps {
  to?: string;
  icon: ReactNode;
  label: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

function MobileNavItem({ to, icon, label, onClick }: MobileNavItemProps) {
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