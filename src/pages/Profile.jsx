import { UserProfile } from "../context/ProfileContext";
import { UserAuth } from "../context/AuthContext";
const Profile = () => {
    const { session } = UserAuth();
    const { profile } = UserProfile();

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Email</label>
                <p className="text-sm text-gray-500">{session?.user?.email}</p>
                <label className="text-sm font-bold text-gray-700">Organization</label>
                <p className="text-sm text-gray-500">{profile?.organizations?.name}</p>
            </div>
        </>
    )
};

export default Profile;
