import { useParams, useNavigate } from "react-router-dom";
import { getSetList, createSetList, updateSetList } from "../utils/setlists";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { getChordsheets } from "../utils/chordsheets";
import { Plus, X, Trash, Edit, Link2, Eye } from "lucide-react";
import { createOutputs, deleteOutputs, getCapoText } from "../utils/outputs";
import { handleCopyLink, handlePreview } from "../utils/setlists";
import { v4 as uuidv4 } from 'uuid';
import { useSongSelection } from "../context/SongSelectionContext";
import { UserProfile } from "../context/ProfileContext";
import { defaultFretValue, defaultKeyValue, defaultOutputValue, defaultSelectedSongValue, frets, keys } from "../constants";
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Toaster, toast } from 'react-hot-toast';
import Spinner from "../components/Spinner";
import Select from "react-select";

const SongSelectionDialog = ({ sheets, onAdd, isOpen, onClose }) => {
    const songStuff = useSongSelection();
    const selectSongOptions = [defaultSelectedSongValue].concat(sheets.map((sheet) => ({ value: sheet.id, label: `${sheet.title} - ${sheet.artist} - ${sheet.key}`})));
    const selectKeyOptions = [defaultKeyValue].concat(keys.map(k => ({ value: k, label: k })));
    const selectCapoOptions = [defaultFretValue].concat(frets.map(f => ({ value: f, label: getCapoText(f) })));

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
            <h3 className="text-lg font-bold flex justify-between items-center mb-4">
                <span>{songStuff.isEdit ? "Edit" : "Add"} Song</span>
                <X size={24} onClick={songStuff.isEdit ? handleEditClose : onClose} className="cursor-pointer text-gray-500 hover:text-gray-600" />
            </h3>

            <label htmlFor="song">Song</label>
            <Select value={songStuff.selectedSong.song !== "" ? selectSongOptions.find((v) => v.value === songStuff.selectedSong.song) : defaultSelectedSongValue} options={selectSongOptions} isSearchable id="song" onChange={(e) => songStuff.setSelectedSong((p) => ({...p, song: e.value}))} />

            <label className="mt-4 block" htmlFor="key">Key</label>
            <Select onChange={(e) => songStuff.setSelectedSong((p) => ({...p, targetKey: e.value}))} value={songStuff.selectedSong.targetKey !== "" ? selectKeyOptions.find(k => k.value === songStuff.selectedSong.targetKey) : defaultKeyValue} options={selectKeyOptions} isSearchable id="key" />

            <label className="mt-4 block" htmlFor="capo">Capo</label>
            <Select onChange={(e) => songStuff.setSelectedSong((p) => ({...p, capo: Number(e.value)}))} value={songStuff.selectedSong.song !== "" ? selectCapoOptions.find(f => f.value === songStuff.selectedSong.capo) : defaultFretValue} options={selectCapoOptions} isSearchable id="capo" />
            
            <div className="mt-4 flex justify-end gap-2">
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex items-center gap-2 disabled:opacity-50" onClick={songStuff.isEdit ? handleEdit : handleAdd} disabled={!songStuff.selectedSong.song || !songStuff.selectedSong.targetKey}>
                    {songStuff.isEdit ? "Update" : "Add"}
                </button>
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex items-center gap-2 disabled:opacity-50" onClick={songStuff.isEdit ? handleEditClose : onClose}>
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
                <button
                    data-no-dnd="true"
                    className="text-gray-500 hover:text-gray-600 flex items-center gap-2 disabled:opacity-50"
                    onClick={(event) => handleDeleteSong(output.index, event)}
                >
                    <Trash size={16} />
                </button>

                <button
                    data-no-dnd="true"
                    className="text-gray-500 hover:text-gray-600 flex items-center gap-2 disabled:opacity-50"
                    onClick={(event) => openEditDialog(output.index, output, event)}
                >
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
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Prevent accidental drags
            },
        })
    );

    const handleDragStart = (event) => {
        if (event.active.data.current?.type === "button") {
            return; // Prevent dragging when clicking buttons
        }
    };

    useEffect(() => {
        const fetchSheets = async () => {
            const { data } = await getChordsheets(profile.orgId, 0, -1, "");
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
            fetchSetList().then(() => setIsLoading(false)).catch((err) => toast.error("A network error has occured."));
        }
        else {
            fetchSheets().then(() => setIsLoading(false)).catch((err) => toast.error("A network error has occured."));
        }
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
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
                // console.error("Failed to create set list");
                toast.error("Failed to create set list.");
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
            // navigate("/setlists");
            toast.success("Set list updated!");
        }
        setIsSaving(false);
    };

    const handleDeleteSong = (index, event) => {
        event.stopPropagation();
        event.preventDefault();
        setOutputs((prevOutputs) => prevOutputs.filter((output) => output.index !== index));
    };
    
    const openEditDialog = (index, song, event) => {
        event.stopPropagation();
        event.preventDefault();
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

    if (isLoading) {
        return (
            <>
                <Toaster />
                <Spinner />
            </>
        );
    }

    return (
        <>
            <Toaster />
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
            <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex flex-col sm:flex-row sm:gap-1 flex-wrap">
                    <button onClick={handleSave} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex justify-center items-center gap-2 disabled:opacity-50" disabled={!name || isSaving}>
                        <Save size={16} /> Save
                    </button>
                    <button onClick={() => setIsOpen(true)} className="border border-gray-500 rounded p-2 text-gray-500 hover:text-gray-600 mt-4 flex justify-center items-center gap-2 disabled:opacity-50" disabled={isSaving}>
                        <Plus size={16} /> Add Song
                    </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-1 flex-wrap">
                    {id !== "new" && (
                        <>
                            <button onClick={() => handleCopyLink(id)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex justify-center items-center gap-2 disabled:opacity-50" disabled={isSaving}>
                                <Link2 size={16} /> Copy Link
                            </button>
                            <button onClick={() => handlePreview(id)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex justify-center items-center gap-2 disabled:opacity-50" disabled={isSaving}>
                                <Eye size={16} /> Preview
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="mt-4 overflow-y-auto">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors} onDragStart={handleDragStart}>
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