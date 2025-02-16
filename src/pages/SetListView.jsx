import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOutputs, getCapoText } from "../utils/outputs";
import { getSetList } from "../utils/setlists";
import ChordSheetJS from "chordsheetjs";
import { Key } from "chordsheetjs";
import { Guitar, PrinterIcon } from "lucide-react";
import { supabase } from "../supabaseClient";
import { Toaster, toast } from 'react-hot-toast';
import Spinner from "../components/Spinner";

const SetListView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [setlist, setSetlist] = useState(null);
    const [outputs, setOutputs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSet = async () => {
            const setlistData = await getSetList(id);
            const outputData = await getOutputs(id);
            
            setSetlist(setlistData);
            setOutputs(outputData);
            document.title = `Team Chords - ${setlistData.name}`;
        };
        fetchSet().then(() => setIsLoading(false)).catch((err) => toast.error("A network error has occured."));
        
        const channels = supabase.channel('custom-filter-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'setlists', filter: `id=eq.${id}` },
            (payload) => {
                fetchSet();
            }
        )
        .subscribe();
    }, [id]);

    useEffect(() => {
        if (outputs.length > 0) {
            document.querySelectorAll('.sheet h1').forEach((element) => {
                element.style.fontWeight = 'bold';
                element.style.textAlign = 'center';
                element.style.fontSize = '1.5rem';
            });
        }
    }, [outputs]);
    

    const renderChordPro = (chordProContent, originalKey, targetKey, capo) => {
        try {
            if (chordProContent) {
                const parser = new ChordSheetJS.ChordProParser();
                const distance = Key.distance(originalKey, targetKey);
                chordProContent = chordProContent.replaceAll('{ci:', '{c:');
                const song = parser.parse(chordProContent);
                const transposedSong = song.transpose(distance);
                const changedTitleSong = transposedSong.changeMetadata('title', capo !== 0 ? `${transposedSong.title} (Capo on ${getCapoText(capo)})` : transposedSong.title);
                const formatter = new ChordSheetJS.HtmlTableFormatter();
                return formatter.format(changedTitleSong);
            }
            return '';
        } catch (error) {
            console.error(error);
            return '';
        }
    };

    const renderPrintOutput = (chordProContent, originalKey, targetKey, capo) => {
        try {
            if (chordProContent) {
                const parser = new ChordSheetJS.ChordProParser();
                const distance = Key.distance(originalKey, targetKey);
                chordProContent = chordProContent.replaceAll('{ci:', '{c:');
                const song = parser.parse(chordProContent);
                const transposedSong = song.transpose(distance);
                const changedTitleSong = transposedSong.changeMetadata('title', capo !== 0 ? `${transposedSong.title} (Capo on ${getCapoText(capo)})` : transposedSong.title);
                const formatter = new ChordSheetJS.TextFormatter();
                return formatter.format(changedTitleSong);
            }
            return '';
        } catch (error) {
            console.error(error);
            return '';
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <Toaster />
                <Spinner />
            </div>
        );
    }
  
    return (
        <div className="bg-gray-100">
            <div className="hidden print:block">
                {outputs.map((output) => <pre key={output.id} dangerouslySetInnerHTML={{ __html: renderPrintOutput(output.chordsheets.content, output.chordsheets.key, output.targetKey, output.capo) }} />)}
            </div>
            {setlist && <h2 className="print:hidden text-center text-sm md:text-base lg:text-lg font-bold sticky top-0 left-0 z-10 w-full bg-gray-700 text-white py-4 shadow-md flex items-center gap-2 justify-center"><span>{setlist.name}</span><button onClick={handlePrint} className="flex items-center justify-center gap-1 bg-gray-500 hover:bg-gray-600 p-2 rounded font-normal"><PrinterIcon size={18} /> Print</button></h2>}
            <div className="print:hidden flex flex-col items-center">
                {outputs.map((output) => <div key={output.id} dangerouslySetInnerHTML={{ __html: renderChordPro(output.chordsheets.content, output.chordsheets.key, output.targetKey, output.capo) }} className="sheet text-[10px] md:text-sm lg:text-base mt-4 bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full border border-gray-200" />)}
            </div>
            <footer className="print:hidden text-center text-sm text-white w-full bg-gray-700">
                <p>Generated by <a href={window.location.origin} target="_blank" rel="noopener noreferrer"><Guitar className="inline-block" /> Team Chords</a></p>
            </footer>
        </div>
    );
};

export default SetListView;

