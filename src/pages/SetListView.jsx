import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOutputs } from "../utils/outputs";
import { getSetList } from "../utils/setlists";
import ChordSheetJS from "chordsheetjs";
import { Key } from "chordsheetjs";
import { Guitar } from "lucide-react";

const SetListView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [setlist, setSetlist] = useState(null);
    const [outputs, setOutputs] = useState([]);

    useEffect(() => {
        const fetchSet = async () => {
            const setlist = await getSetList(id);
            const outputs = await getOutputs(id);

            if (outputs.length === 0) {
                navigate(`/setlists/${id}`);
            }
            
            setSetlist(setlist);
            setOutputs(outputs);
        };
        fetchSet();
    }, [id]);
    

    const renderChordPro = (chordProContent, originalKey, targetKey) => {
        try {
            if (chordProContent) {
                console.log(originalKey, targetKey);
                const parser = new ChordSheetJS.ChordProParser();
                const distance = Key.distance(originalKey, targetKey);
                const song = parser.parse(chordProContent);
                const transposedSong = song.transpose(distance);
                const formatter = new ChordSheetJS.HtmlTableFormatter();
                return formatter.format(transposedSong);
            }
            return '';
        } catch (error) {
            console.error(error);
            return '';
        }
    };

  
    return (
        <div className="bg-gray-100">
            {setlist && <h2 className="text-center text-2xl font-bold sticky top-0 left-0 z-10 w-full bg-white py-4 shadow-md">{setlist.name}</h2>}
            <div className="setlist-view bg-white">
                {outputs.map((output) => <div key={output.id} dangerouslySetInnerHTML={{ __html: renderChordPro(output.chordsheets.content, output.chordsheets.key, output.targetKey) }} />)}
            </div>
            <footer className="text-center text-sm text-gray-500 pt-4">
                <p>Generated by <a href={window.location.origin} target="_blank" rel="noopener noreferrer"><Guitar className="inline-block" /> Team Chords</a></p>
            </footer>
        </div>
    );
};

export default SetListView;

