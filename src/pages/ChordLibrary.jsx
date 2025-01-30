import { useEffect, useState } from "react";
import { getProfile } from "../utils/common";
import { getChordsheets } from "../utils/chordsheets";
import { UserAuth } from "../context/AuthContext";
import ChordLibraryTable from "../components/chordlibrary/ChordLibraryTable";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from 'lucide-react'

const ChordLibrary = () => {
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [chordsheets, setChordsheets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const profile = await getProfile(session.user.id);
      if (!profile) {
        navigate("/signin");
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
