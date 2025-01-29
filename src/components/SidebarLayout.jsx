import Sidebar from "./Sidebar";
export default function SidebarLayout({ children }) {
  return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
  );
}