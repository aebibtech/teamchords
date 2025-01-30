import { useParams, useNavigate } from "react-router-dom";
import { getSetList, createSetList, updateSetList } from "../../utils/setlists";
import { useState, useEffect } from "react";
import ChordSheetJS from "chordsheetjs";
import { Save } from "lucide-react";
import { UserAuth } from "../../context/AuthContext";
import { getProfile } from "../../utils/common";

const SetListForm = () => {
    const { session } = UserAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");

    useEffect(() => {
        if (id !== 'new') {
            const fetchSetList = async () => {
                const data = await getSetList(id);
                setName(data.name);
            };
            fetchSetList();
        }
    }, []);

    const handleSave = async () => {
        const setlist = { name };
        if (id === 'new') {
            const profile = await getProfile(session.user.id);
            if (!profile) {
                console.error("Profile not found");
                return;
            }
            setlist.orgId = profile.orgId;

            await createSetList(setlist);
            navigate("/setlists");
        } else {
            await updateSetList(id, setlist);
            navigate("/setlists");
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <label htmlFor="name">Set List Name</label>
                <input 
                    id="name"
                    type="text" 
                    className="w-full p-2 border rounded text-lg" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Set List Name"
                />
            </div>
            <div className="flex gap-4">
                Song selection
            </div>
            <button onClick={handleSave} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex items-center gap-2 disabled:opacity-50" disabled={!name}>
                <Save size={16} /> 
                Save
            </button>
        </div>
    );
};

export default SetListForm;