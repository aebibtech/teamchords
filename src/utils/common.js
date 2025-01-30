import { supabase } from "../supabaseClient";

async function getProfile(id) {
    const { data, error } = await supabase
    .from("profiles")
    .select(`
        orgId,
        organizations(
            name
        )
    `)
    .eq("userId", id)
    .limit(1)
    .single();

    if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }

    return data;
}

export { getProfile };
