import { supabase } from "../supabaseClient";

async function getSetLists(orgId) {
    const { data, error } = await supabase
    .from("setlists")
    .select('*')
    .eq("orgId", orgId);

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
    .insert({ ...setlist });

    if (error) {
        console.error("Error creating set list:", error);
        return null;
    }

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

export { getSetLists, getSetList, createSetList, updateSetList };