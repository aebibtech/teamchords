import { supabase } from "../supabaseClient";

async function getChordsheets(orgId) {
    const { data, error } = await supabase
    .from("chordsheets")
    .select('*')
    .eq("orgId", orgId);

    if (error) {
        console.error("Error fetching chordsheets:", error);
        return null;
    }

    return data;
}

async function getChordsheet(id) {
    const { data, error } = await supabase
    .from("chordsheets")
    .select('*')
    .eq("id", id)
    .limit(1)
    .single();

    if (error) {
        console.error("Error fetching chordsheet:", error);
        return null;
    }

    return data;
}

export { getChordsheets, getChordsheet };