import Sidebar from "./Sidebar";
import type { FC, ReactNode } from 'react';

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout: FC<SidebarLayoutProps> = ({ children }) => (
  <div className="flex w-full h-screen bg-gray-100">
    {/* Sidebar */}
    <Sidebar />

    {/* Main content */}
    <div className="flex-1 w-full p-4 overflow-auto">
      {children}
    </div>
  </div>
);

export default SidebarLayout;
