import { useEffect, useState } from "react";
import { getProfile } from "../utils/common";
import { UserAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from 'lucide-react'
import { getSetLists } from "../utils/setlists";
import SetListTable from "../components/setlist/SetListTable";

const SetList = () => {
  const { session } = UserAuth();
  const [setLists, setSetLists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const profile = await getProfile(session.user.id);
      const setLists = await getSetLists(profile.orgId);
      setSetLists(setLists);
    };
    fetchData();
  }, []);

  return (
    <>
      <h1 className="w-full flex justify-between mb-4">
        <p className="text-2xl font-bold">Set Lists</p>
        <Link to="/setlists/new" className="border rounded px-2 py-2 bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2">
          <Plus size={16} />
          New Set List
        </Link>
      </h1>
      {setLists && <SetListTable data={setLists} />}
    </>
  );
};

export default SetList;