import { useParams, useNavigate } from "react-router-dom";
import { getChordsheet, createChordsheet, updateChordsheet } from "../../utils/chordsheets";
import { useState, useEffect } from "react";
import ChordSheetJS from "chordsheetjs";
import { Save } from "lucide-react";
import { UserAuth } from "../../context/AuthContext";
import { getProfile } from "../../utils/common";
import Editor from "@monaco-editor/react";

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
    }, [id]);

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
        <>
            <div className="mb-4">
                <label htmlFor="title" className="block font-semibold">Title</label>
                <input 
                    id="title"
                    type="text" 
                    className="w-full p-2 border rounded text-lg" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
                <label htmlFor="artist" className="block font-semibold mt-2">Artist</label>
                <input 
                    id="artist"
                    type="text" 
                    className="w-full p-2 border rounded text-lg mt-2" 
                    value={artist} 
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Artist"
                />
                <label htmlFor="key" className="block font-semibold mt-2">Key</label>
                <select 
                    id="key" 
                    className="w-full p-2 border rounded text-lg mt-2 mb-4" 
                    value={key} 
                    onChange={(e) => setKey(e.target.value)}
                >
                    {"C C# D D# E F F# G G# A A# B".split(" ").map((note) => (
                        <option key={note} value={note}>{note}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[64vh]">
                <div className="flex-1 min-h-[240px] h-auto lg:h-[64vh] border rounded overflow-hidden">
                    <Editor 
                        height="64vh"
                        defaultLanguage="plaintext"
                        value={content}
                        onChange={(value) => setContent(value)}
                        options={{ minimap: { enabled: false }, wordWrap: "on" }}
                    />
                </div>
                <div 
                    className="flex-1 min-h-[240px] h-auto lg:h-[64vh] p-4 border border-gray-300 rounded overflow-auto bg-gray-50 shadow-inner text-gray-800 text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: renderChordPro(content) }}
                />
            </div>
            <button 
                onClick={handleSave} 
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 flex items-center gap-2 disabled:opacity-50" 
                disabled={!title || !artist || !key || !content}
            >
                <Save size={16} /> 
                Save
            </button>
        </>
    );
};

export default ChordProSheet;
