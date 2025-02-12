import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { createProfile, createOrganization } from "../utils/common";
import { UserProfile } from "../context/ProfileContext";

const Onboarding = () => {
  const { session } = UserAuth();
  const { profile, setUserProfile } = UserProfile();
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (profile) {
      navigate("/library");
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(orgName);
    const newOrg = {
      name: orgName
    }
    const dataOrg = await createOrganization(newOrg);
    if (!dataOrg) {
      console.error("Error creating organization");
      return;
    }

    const newProfile = {
      userId: session.user.id,
      orgId: dataOrg.id
    }
    const data = await createProfile(newProfile);
    if (data) {
      setUserProfile(data);
    }
    setOrgName((p) => data ? "" : p);
    inputRef.current.value = data ? "" : orgName;
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Create Organization</h1>
      <p className="text-sm text-gray-500 mb-3">Create an organization to get started.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input ref={inputRef} className="border rounded p-2 mb-3" placeholder="Organization Name" onChange={(e) => setOrgName(e.target.value)} />
        <button className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded disabled:opacity-50" disabled={!orgName}>Create</button>
      </form>
    </>
  );
};

export default Onboarding;