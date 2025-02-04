import { useEffect, useState } from "react";
import { getChordsheets } from "../utils/chordsheets";
import { UserAuth } from "../context/AuthContext";
import ChordLibraryTable from "../components/chordlibrary/ChordLibraryTable";
import { Link } from "react-router-dom";
import { Plus } from 'lucide-react'

const ChordLibrary = () => {
  const { profile } = UserAuth();
  const [chordsheets, setChordsheets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) {
        return;
      }
      const chordsheets = await getChordsheets(profile.orgId);
      setChordsheets(chordsheets);
    };
    fetchData();
  }, []);

  return (
    <>
      <h1 className="w-full flex justify-between mb-4">
        <p className="text-2xl font-bold">Library</p>
        <Link to="/library/new" className="border rounded px-2 py-2 bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2">
          <Plus size={16} />
          New Song
        </Link>
      </h1>
      {chordsheets && <ChordLibraryTable data={chordsheets} />}
    </>
  );
};

export default ChordLibrary;
