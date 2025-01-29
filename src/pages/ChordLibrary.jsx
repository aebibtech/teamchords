import { useEffect, useState } from "react";
import { getProfile } from "../utils/common";
import { getChordsheets } from "../utils/chordsheets";
import { UserAuth } from "../context/AuthContext";
import ChordLibraryTable from "../components/chordlibrary/ChordLibraryTable";

const ChordLibrary = () => {
  const { session } = UserAuth();
  const [chordsheets, setChordsheets] = useState([]);
  // const columns = [
  //   { data: 'title', title: 'Title', render: (data, type, row) => <Link to={`/library/${row.id}`}>{data}</Link> },
  //   { data: 'artist', title: 'Artist' },
  //   { data: 'key', title: 'Key' },
  // ];

  useEffect(() => {
    const fetchData = async () => {
      const profile = await getProfile(session.user.id);
      console.log(profile);
      const chordsheets = await getChordsheets(profile.orgId);
      console.log(chordsheets);
      setChordsheets(chordsheets);
    };
    fetchData();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Chord Library</h1>
      {chordsheets && <ChordLibraryTable data={chordsheets} />}
    </>
  );
};

export default ChordLibrary;
