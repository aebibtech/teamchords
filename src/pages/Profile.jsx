import { useState } from 'react';
import { UserProfile } from "../context/ProfileContext";
import { UserAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import UpdatePassword from "./UpdatePassword";
import InviteUser from "../components/InviteUser";

const Profile = () => {
    const { session } = UserAuth();
    const { profile } = UserProfile();
    const [showModal, setShowModal] = useState(false);
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

    return (
        <>
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Profile</h1>
                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-sm font-bold text-gray-700">Email</label>
                    <p className="text-sm text-gray-500">{session?.user?.email}</p>
                    <label className="text-sm font-bold text-gray-700">Organization</label>
                    <p className="text-sm text-gray-500">{profile?.organizations?.name}</p>
                </div>
                <button 
                    onClick={() =>setShowModal(true)}
                    className="bg-gray-500 hover:bg-gray-600 disabled:opacity-50 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                >
                    Update Password
                </button>

                {showModal && (
                    <Modal onClose={() => setShowModal(false)}>
                        <UpdatePassword />
                    </Modal>
                )}
            </div>
            <div className="max-w-md mx-auto mt-5 p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Actions</h1>
                <button 
                    onClick={() => setIsInviteDialogOpen(true)}
                    className="bg-gray-500 hover:bg-gray-600 disabled:opacity-50 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                >
                    Invite User
                </button>

                {isInviteDialogOpen && (
                    <Modal onClose={() => setIsInviteDialogOpen(false)}>
                        <InviteUser close={() => setIsInviteDialogOpen(false)} />
                    </Modal>
                )}
            </div>
        </>
    )
};

export default Profile;
