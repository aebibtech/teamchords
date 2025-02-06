import { useParams, useNavigate } from "react-router-dom";
import { getChordsheet, createChordsheet, updateChordsheet } from "../../utils/chordsheets";
import { useState, useEffect } from "react";
import ChordSheetJS from "chordsheetjs";
import { Save } from "lucide-react";
import { UserAuth } from "../../context/AuthContext";
import { getProfile } from "../../utils/common";

const ChordProSheet = () => {
    const { session } = UserAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [key, setKey] = useState("C");
    const [content, setContent] = useState("");

    useEffect(() => {
        if (id !== 'new') {
            const fetchChordsheet = async () => {
                const data = await getChordsheet(id);
                setTitle(data.title);
                setArtist(data.artist);
                setKey(data.key);
                setContent(data.content);
            };
            fetchChordsheet();
        }
    }, []);

    const renderChordPro = (chordProContent) => {
        try {
            if (chordProContent) {
                const parser = new ChordSheetJS.ChordProParser();
                chordProContent = chordProContent.replaceAll('{ci:', '{c:');
                const song = parser.parse(chordProContent);
                const formatter = new ChordSheetJS.HtmlTableFormatter();
                return formatter.format(song);
            }
            return '';
        } catch (error) {
            console.error(error);
            return '';
        }
    };

    const handleSave = async () => {
        const chordsheet = { title, artist, key, content };
        if (id === 'new') {
            const profile = await getProfile(session.user.id);
            chordsheet.orgId = profile.orgId;

            await createChordsheet(chordsheet);
            navigate("/library");
        } else {
            await updateChordsheet(id, chordsheet);
            navigate("/library");
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <label htmlFor="title">Title</label>
                <input 
                    id="title"
                    type="text" 
                    className="w-full p-2 border rounded text-lg" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
                <label htmlFor="artist">Artist</label>
                <input 
                    id="artist"
                    type="text" 
                    className="w-full p-2 border rounded text-lg mt-2" 
                    value={artist} 
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Artist"
                />
                <label htmlFor="key">Key</label>
                <select id="key" className="w-full p-2 border rounded text-lg mt-2 mb-4" value={key} onChange={(e) => setKey(e.target.value)}>
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
            </div>
            <div className="flex gap-4">
                <textarea 
                    className="w-1/2 p-2 border rounded h-[68vh] overflow-auto" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Your ChordPro sheet here..."
                />
                <div className="w-1/2 p-4 border border-gray-300 rounded h-[68vh] overflow-auto bg-gray-50 shadow-inner text-gray-800 text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: renderChordPro(content) }}
                />
            </div>
            <button onClick={handleSave} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex items-center gap-2 disabled:opacity-50" disabled={!title || !artist || !key || !content}>
                <Save size={16} /> 
                Save
            </button>
        </div>
    );
};

export default ChordProSheet;