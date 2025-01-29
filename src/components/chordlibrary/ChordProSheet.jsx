import { useParams } from "react-router-dom";
import { getChordsheet } from "../../utils/chordsheets";
import { useState, useEffect } from "react";

const ChordProSheet = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [key, setKey] = useState("");
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

    return (
        <div className="p-4">
            <div className="mb-4">
                <input 
                    type="text" 
                    className="w-full p-2 border rounded text-2xl font-bold" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
                <input 
                    type="text" 
                    className="w-full p-2 border rounded text-lg mt-2" 
                    value={artist} 
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Artist"
                />
                <input 
                    type="text" 
                    className="w-full p-2 border rounded text-lg mt-2 mb-4" 
                    value={key} 
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Key"
                />
            </div>
            <div className="flex gap-4">
                <textarea 
                    className="w-1/2 p-2 border rounded h-[75vh] overflow-auto" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Your ChordPro sheet here..."
                />
                <div className="w-1/2 p-2 border rounded h-[75vh] overflow-auto">
                    <pre className="whitespace-pre-wrap">{content ? content : "Output area"}</pre>
                </div>
            </div>
        </div>
    );
};

export default ChordProSheet;