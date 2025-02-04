import { useParams, useNavigate } from "react-router-dom";
import { getSetList, createSetList, updateSetList } from "../../utils/setlists";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { UserAuth } from "../../context/AuthContext";
import { getProfile } from "../../utils/common";
import { getChordsheets } from "../../utils/chordsheets";
import { Plus, X, Trash, Edit, Link2, Eye } from "lucide-react";
import { createOutputs, deleteOutputs } from "../../utils/outputs";
import { handleCopyLink, handlePreview } from "../../utils/setlists";
import {v4 as uuidv4} from 'uuid';
import { useSongSelection } from "../../context/SongSelectionContext";
const SongSelectionDialog = ({ sheets, onAdd, isOpen, onClose }) => {
    const songStuff = useSongSelection();

    const handleAdd = () => {
        onAdd((prevOutputs) => [...prevOutputs, { song: songStuff.selectedSong.song, targetKey: songStuff.selectedSong.targetKey, index: uuidv4() }]);
        songStuff.setSelectedSong({song: "", targetKey: ""});
        onClose();
    };

    const handleEdit = () => {
        onAdd((prevOutputs) => prevOutputs.map((output) => output.index === songStuff.songId ? { song: songStuff.selectedSong.song, targetKey: songStuff.selectedSong.targetKey, index: output.index } : output));
        songStuff.setSelectedSong({song: "", targetKey: ""});
        songStuff.setIsEdit(false);
        onClose();
    };

    return (
        <dialog open={isOpen} className="w-full md:w-1/4 border rounded p-4 shadow-md">
            <label htmlFor="song">Song</label>
            <select id="song" className="w-full p-2 border rounded text-lg mt-2 mb-4" value={songStuff.selectedSong.song} onChange={(e) => songStuff.setSelectedSong((p) => ({...p, song: e.target.value}))}>
                <option value="">Select a song</option>
                {sheets.map((sheet) => (
                    <option key={sheet.id} value={sheet.id}>{sheet.title}</option>
                ))}
            </select>
            <label htmlFor="key">Key</label>
            <select id="key" className="w-full p-2 border rounded text-lg mt-2 mb-4" value={songStuff.selectedSong.targetKey} onChange={(e) => songStuff.setSelectedSong((p) => ({...p, targetKey: e.target.value}))}>
                <option value="">Select a key</option>
                <option value="C">C</option>
                <option value="C#">C#</option>
                <option value="D">D</option>
                <option value="D#">D#</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="F#">F#</option>
                <option value="G">G</option>
                <option value="G#">G#</option>
                <option value="A">A</option>
                <option value="A#">A#</option>
                <option value="B">B</option>
            </select>
            <div className="flex justify-end gap-2">
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex items-center gap-2 disabled:opacity-50" onClick={songStuff.isEdit ? handleEdit : handleAdd} disabled={!songStuff.selectedSong.song || !songStuff.selectedSong.targetKey}>
                    <Plus size={16} />
                    {songStuff.isEdit ? "Update" : "Add"}
                </button>
                <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded mt-4 flex items-center gap-2 disabled:opacity-50" onClick={onClose}>
                    <X size={16} />
                    Cancel
                </button>
            </div>
        </dialog>
    );
};

const SetListForm = () => {
    const { session } = UserAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [sheets, setSheets] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [outputs, setOutputs] = useState([]);
    const songStuff = useSongSelection();

    useEffect(() => {
        const fetchSheets = async () => {
            const profile = await getProfile(session.user.id);
            if (!profile) {
                navigate("/signin");
                return;
            }

            const data = await getChordsheets(profile.orgId);
            setSheets(data);
        };

        if (id !== 'new') {
            const fetchSetList = async () => {
                await fetchSheets();
                const data = await getSetList(id);
                setName(data.name);
                setOutputs(data.outputs.map((output) => ({ song: output.chordSheetId, targetKey: output.targetKey, index: uuidv4() })));
            };
            fetchSetList();
        }
        else {
            fetchSheets();
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

            const newSetList = await createSetList(setlist);
            
            if (newSetList) {
                await createOutputs(outputs.map(output => ({ chordSheetId: output.song, targetKey: output.targetKey, setListId: newSetList.id })));
            } else {
                console.error("Failed to create set list");
            }
            
            navigate("/setlists");
        } else {
            await updateSetList(id, setlist);
            await deleteOutputs(id);
            await createOutputs(outputs.map(output => ({ chordSheetId: output.song, targetKey: output.targetKey, setListId: id })));
            navigate("/setlists");
        }
    };

    const handleDeleteSong = (index) => {
        setOutputs(outputs.filter((output) => output.index !== index));
    };
    
    const openEditDialog = (index, song) => {
        setIsOpen(true);
        songStuff.setIsEdit(true);
        songStuff.setSongId(index);
        songStuff.setSelectedSong({song: song.song, targetKey: song.targetKey});
    };

    return (
        <div className="p-4">
            <SongSelectionDialog sheets={sheets} onAdd={setOutputs} isOpen={isOpen} onClose={() => setIsOpen(false)} />
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
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <button onClick={handleSave} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex items-center gap-2 disabled:opacity-50" disabled={!name}>
                        <Save size={16} /> 
                        Save
                    </button>
                    <button onClick={() => setIsOpen(true)} className="border border-gray-500 rounded p-2 text-gray-500 hover:text-gray-600 mt-4 flex items-center gap-2 disabled:opacity-50">
                        <Plus size={16} />
                        Add Song
                    </button>
                </div>
                <div className="flex gap-2">
                    {id !== 'new' && (
                        <button onClick={() => handleCopyLink(id)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex items-center gap-2 disabled:opacity-50">
                            <Link2 size={16} /> 
                            Copy Link
                        </button>
                    )}
                    {id !== 'new' && (
                        <button onClick={() => handlePreview(id)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex items-center gap-2 disabled:opacity-50">
                            <Eye size={16} /> 
                            Preview
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-4 overflow-y-auto">
                <table className="w-full border border-gray-300 bg-white rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            {['Song', 'Key', 'Actions'].map((header, index) => (
                                <th key={index} className="border-b border-gray-300 text-left text-gray-700 font-medium cursor-pointer hover:bg-gray-300">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {outputs.map((output, index) => (
                            <tr key={index} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                                <td>{sheets.find(sheet => sheet.id === output.song).title}</td>
                                <td>{output.targetKey}</td>
                                <td className="flex gap-2">
                                    <button className="text-gray-500 hover:text-gray-600 flex items-center gap-2 disabled:opacity-50" onClick={() => handleDeleteSong(output.index)}>
                                        <Trash size={16} />
                                    </button>
                                    <button className="text-gray-500 hover:text-gray-600 flex items-center gap-2 disabled:opacity-50" onClick={() => openEditDialog(output.index, output)}>
                                        <Edit size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SetListForm;