import { supabase } from "../supabaseClient";

async function getSetLists(orgId) {
    const { data, error } = await supabase
    .from("setlists")
    .select('*')
    .eq("orgId", orgId)
    .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching set lists:", error);
        return null;
    }

    return data;
}

async function getSetList(id) {
    const { data, error } = await supabase
    .from("setlists")
    .select(`*, outputs(*)`)
    .eq("id", id)
    .limit(1)
    .single();

    if (error) {
        console.error("Error fetching set list:", error);
        return null;
    }

    return data;
}

async function createSetList(setlist) {    
    const { data, error } = await supabase
    .from("setlists")
    .insert({ ...setlist })
    .select()
    .limit(1)
    .single();

    if (error) {
        console.error("Error creating set list:", error);
        return null;
    }

    console.log("Set list created:", data);
    return data;
}

async function updateSetList(id, setlist) {
    const { data, error } = await supabase
    .from("setlists")
    .update({ ...setlist, updated_at: new Date().toISOString() })
    .eq("id", id);
    
    if (error) {
        console.error("Error updating set list:", error);
        return null;
    }

    return data;
}

async function deleteSetList(id) {
    const { error } = await supabase
    .from("setlists")
    .delete()
    .eq("id", id);

    if (error) {
        console.error("Error deleting set list:", error);
        return null;
    }

    return true;
}

const handleCopyLink = async (id) => {
    const url = `${window.location.origin}/setlists/share/${id}`;
    await navigator.clipboard.writeText(url);
};

const handlePreview = async (id) => {
    const url = `${window.location.origin}/setlists/share/${id}`;
    window.open(url, '_blank');
};

export { getSetLists, getSetList, createSetList, updateSetList, deleteSetList, handleCopyLink, handlePreview };