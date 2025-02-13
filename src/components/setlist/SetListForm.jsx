import { useParams, useNavigate } from "react-router-dom";
import { getSetList, createSetList, updateSetList } from "../../utils/setlists";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { getChordsheets } from "../../utils/chordsheets";
import { Plus, X, Trash, Edit, Link2, Eye } from "lucide-react";
import { createOutputs, deleteOutputs } from "../../utils/outputs";
import { handleCopyLink, handlePreview } from "../../utils/setlists";
import { v4 as uuidv4 } from 'uuid';
import { useSongSelection } from "../../context/SongSelectionContext";
import { UserProfile } from "../../context/ProfileContext";
import { defaultOutputValue } from "../../constants";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SongSelectionDialog = ({ sheets, onAdd, isOpen, onClose }) => {
    const songStuff = useSongSelection();

    const handleAdd = () => {
        onAdd((prevOutputs) => [...prevOutputs, { song: songStuff.selectedSong.song, targetKey: songStuff.selectedSong.targetKey, capo: songStuff.selectedSong.capo, index: uuidv4() }]);
        songStuff.setSelectedSong(defaultOutputValue);
        onClose();
    };

    const handleEdit = () => {
        onAdd((prevOutputs) => prevOutputs.map((output) => output.index === songStuff.songId ? { song: songStuff.selectedSong.song, targetKey: songStuff.selectedSong.targetKey, capo: songStuff.selectedSong.capo, index: output.index } : output));
        songStuff.setSelectedSong(defaultOutputValue);
        songStuff.setIsEdit(false);
        onClose();
    };

    const handleEditClose = () => {
        songStuff.setSelectedSong(defaultOutputValue);
        songStuff.setIsEdit(false);
        onClose();
    };

    return (
        <dialog open={isOpen} className="w-full sm:w-3/4 md:w-1/2 lg:w-1/4 border rounded p-4 shadow-md z-10">
            <label htmlFor="song">Song</label>
            <select id="song" className="w-full p-2 border rounded text-lg mt-2 mb-4" value={songStuff.selectedSong.song} onChange={(e) => songStuff.setSelectedSong((p) => ({...p, song: e.target.value}))}>
                <option value="">Select a song</option>
                {sheets.map((sheet) => (
                    <option key={sheet.id} value={sheet.id}>{sheet.title} - {sheet.artist} - {sheet.key}</option>
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
            <label htmlFor="capo">Capo</label>
            <select id="capo" className="w-full p-2 border rounded text-lg mt-2 mb-4" value={songStuff.selectedSong.capo} onChange={(e) => songStuff.setSelectedSong((p) => ({...p, capo: Number(e.target.value)}))}>
                <option value="0">Select Fret</option>
                {"1 2 3 4 5 6 7 8 9 10 11 12".split(" ").map((value) => (
                    <option key={value} value={value}>{value}</option>
                ))}
            </select>
            <div className="flex justify-end gap-2">
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex items-center gap-2 disabled:opacity-50" onClick={songStuff.isEdit ? handleEdit : handleAdd} disabled={!songStuff.selectedSong.song || !songStuff.selectedSong.targetKey}>
                    <Plus size={16} />
                    {songStuff.isEdit ? "Update" : "Add"}
                </button>
                <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded mt-4 flex items-center gap-2 disabled:opacity-50" onClick={songStuff.isEdit ? handleEditClose : onClose}>
                    <X size={16} />
                    Cancel
                </button>
            </div>
        </dialog>
    );
};

const SortableRow = ({ output, index, sheets, handleDeleteSong, openEditDialog }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: output.index });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
        >
            <td>{sheets.find(sheet => sheet.id === output.song)?.title || "Unknown"}</td>
            <td>{output.targetKey}</td>
            <td className="flex gap-2">
                <button className="text-gray-500 hover:text-gray-600 flex items-center gap-2" onClick={() => handleDeleteSong(output.index)}>
                    <Trash size={16} />
                </button>
                <button className="text-gray-500 hover:text-gray-600 flex items-center gap-2" onClick={() => openEditDialog(output.index, output)}>
                    <Edit size={16} />
                </button>
            </td>
        </tr>
    );
};

const SetListForm = () => {
    const { profile } = UserProfile();
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [sheets, setSheets] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [outputs, setOutputs] = useState([]);
    const songStuff = useSongSelection();

    useEffect(() => {
        const fetchSheets = async () => {
            const data = await getChordsheets(profile.orgId);
            setSheets(data);
        };

        if (id !== "new") {
            const fetchSetList = async () => {
                await fetchSheets();
                const data = await getSetList(id);
                setName(data.name);
                setOutputs(data.outputs.map(output => ({
                    song: output.chordSheetId,
                    targetKey: output.targetKey,
                    capo: String(output.capo),
                    index: uuidv4(),
                })));
            };
            fetchSetList();
        } else {
            fetchSheets();
        }
    }, []);

    const handleSave = async () => {
        const setlist = { name };
        if (id === "new") {
            setlist.orgId = profile.orgId;
            const newSetList = await createSetList(setlist);
            if (newSetList) {
                await createOutputs(outputs.map(output => ({
                    chordSheetId: output.song,
                    targetKey: output.targetKey,
                    capo: output.capo,
                    setListId: newSetList.id,
                })));
            } else {
                console.error("Failed to create set list");
            }
            navigate("/setlists");
        } else {
            await updateSetList(id, setlist);
            await deleteOutputs(id);
            await createOutputs(outputs.map(output => ({
                chordSheetId: output.song,
                targetKey: output.targetKey,
                capo: output.capo,
                setListId: id,
            })));
            navigate("/setlists");
        }
    };

    const handleDeleteSong = index => {
        setOutputs(outputs.filter(output => output.index !== index));
    };

    const openEditDialog = (index, song) => {
        setIsOpen(true);
        songStuff.setIsEdit(true);
        songStuff.setSongId(index);
        songStuff.setSelectedSong({ song: song.song, targetKey: song.targetKey, capo: song.capo });
    };

    const handleDragEnd = event => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = outputs.findIndex(output => output.index === active.id);
        const newIndex = outputs.findIndex(output => output.index === over.id);

        setOutputs(arrayMove(outputs, oldIndex, newIndex));
    };

    return (
        <>
            <SongSelectionDialog sheets={sheets} onAdd={setOutputs} isOpen={isOpen} onClose={() => setIsOpen(false)} />
            <div className="mb-4">
                <label htmlFor="name">Set List Name</label>
                <input
                    id="name"
                    type="text"
                    className="w-full p-2 border rounded text-lg"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Set List Name"
                />
            </div>
            <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex flex-col lg:flex-row gap-2 flex-wrap">
                    <button onClick={handleSave} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex items-center gap-2" disabled={!name}>
                        <Save size={16} /> Save
                    </button>
                    <button onClick={() => setIsOpen(true)} className="border border-gray-500 rounded p-2 text-gray-500 hover:text-gray-600 mt-4 flex items-center gap-2">
                        <Plus size={16} /> Add Song
                    </button>
                </div>
                <div className="flex flex-col lg:flex-row gap-2 flex-wrap">
                    {id !== "new" && (
                        <>
                            <button onClick={() => handleCopyLink(id)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex items-center gap-2">
                                <Link2 size={16} /> Copy Link
                            </button>
                            <button onClick={() => handlePreview(id)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex items-center gap-2">
                                <Eye size={16} /> Preview
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="mt-4 overflow-y-auto">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={outputs.map(output => output.index)}>
                        <table className="w-full border border-gray-300 bg-white rounded-lg">
                            <thead className="bg-gray-200">
                                <tr>
                                    {["Song", "Key", "Actions"].map((header, index) => (
                                        <th key={index} className="border-b border-gray-300 text-left text-gray-700 font-medium">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {outputs.map((output, index) => (
                                    <SortableRow key={output.index} output={output} index={index} sheets={sheets} handleDeleteSong={handleDeleteSong} openEditDialog={openEditDialog} />
                                ))}
                            </tbody>
                        </table>
                    </SortableContext>
                </DndContext>
            </div>
        </>
    );
};

export default SetListForm;