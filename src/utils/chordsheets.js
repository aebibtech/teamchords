import { supabase } from "../supabaseClient";

async function getChordsheets(orgId, pageIndex = 0, pageSize = 10, searchTerm = "") {
    const from = pageIndex * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
        .from("chordsheets")
        .select("*", { count: "exact" })
        .eq("orgId", orgId)
        .order("artist", { ascending: true })
        .range(from, to);

    if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,artist.ilike.%${searchTerm}%`);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error("Error fetching chordsheets:", error);
        return { data: [], count: 0 };
    }

    return { data, count };
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

async function createChordsheet(chordsheet) {    
    const { data, error } = await supabase
    .from("chordsheets")
    .insert({ ...chordsheet });

    if (error) {
        console.error("Error creating chordsheet:", error);
        return null;
    }

    return data;
}

async function updateChordsheet(id, chordsheet) {
    const { data, error } = await supabase
    .from("chordsheets")
    .update({ ...chordsheet, updated_at: new Date().toISOString() })
    .eq("id", id);

    if (error) {
        console.error("Error updating chordsheet:", error);
        return null;
    }

    return data;
}

export { getChordsheets, getChordsheet, createChordsheet, updateChordsheet };
