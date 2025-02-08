import { useEffect, useState } from "react";
import { getChordsheets } from "../utils/chordsheets";
import ChordLibraryTable from "../components/chordlibrary/ChordLibraryTable";
import ChordFilesUploadDialog from "../components/chordlibrary/ChordFilesUploadDialog";
import { Link } from "react-router-dom";
import { Plus, Upload } from 'lucide-react';
import { getProfile } from "../utils/common";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { useProfile } from "../context/ProfileContext";

const ChordLibrary = () => {
  const [chordsheets, setChordsheets] = useState([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { session } = UserAuth();

  useEffect(() => {
    const fetchData = async () => {
      const profile = await getProfile(session.user.id);
      const chordsheets = await getChordsheets(profile.orgId);
      setChordsheets(chordsheets);
    };
    fetchData();
    
    const channels = supabase.channel('custom-insert-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chordsheets' },
      (payload) => {
        console.log('Change received!', payload)
        setChordsheets((prev) => [...prev, payload.new]);
      }
    )
    .subscribe();
  }, []);

  return (
    <>
      <h1 className="w-full flex justify-between mb-4">
        <p className="text-2xl font-bold">Library</p>
        <div className="flex gap-2">
          <Link to="/library/new" className="border rounded px-2 py-2 bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2">
            <Plus size={16} />
            New Song
          </Link>
          <button onClick={() => setIsUploadDialogOpen(true)} className="border rounded px-2 py-2 bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"><Upload size={16} /> Upload</button>
        </div>
      </h1>
      {chordsheets && <ChordLibraryTable data={chordsheets} />}
      <ChordFilesUploadDialog isOpen={isUploadDialogOpen} close={() => setIsUploadDialogOpen(false)} />
    </>
  );
};

export default ChordLibrary;
