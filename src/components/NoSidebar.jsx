import { UserAuth } from "../context/AuthContext";
import { UserProfile } from "../context/ProfileContext";
import { useNavigate } from "react-router-dom";

const NoSidebar = ({ children }) => {
    const { signOut } = UserAuth();
    const { setUserProfile } = UserProfile();
    const navigate = useNavigate();

    const handleSignOut = async (e) => {
        e.preventDefault();
    
        try {
          await signOut();
          setUserProfile(null);
          navigate("/signin");
        } catch (err) {
          console.error(err);
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center align-center bg-gray-700">
            <div className="w-full md:w-1/2 lg:w-1/4 m-auto border rounded bg-gray-100 p-6 flex flex-col">
                {children}
                <button className="w-full mt-4 border border-gray-500 rounded bg-white p-2 text-gray-500 hover:bg-gray-600 hover:text-white disabled:opacity-50" onClick={handleSignOut}>Sign out</button>
            </div>
        </div>
    );
};

export default NoSidebar;