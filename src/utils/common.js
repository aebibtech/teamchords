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
    .eq("userId", id);

    if (error || data.length === 0) {
        return null;
    }

    return data[0];
}

async function createOrganization(profile) {
    const { data, error } = await supabase.from("organizations").insert({
        name: profile.name
    })
    .select('*')
    .limit(1)
    .single();

    if (error) {
        console.error("Error creating organization:", errorOrg);
        return null;
    }

    return data;
}

async function createProfile(profile) {
    const { data, error } = await supabase
    .from("profiles")
    .insert({
        userId: profile.userId,
        orgId: profile.orgId
    })
    .select('*');

    if (error) {
        console.error("Error creating profile:", error);
        return null;
    }

    return await getProfile(profile.userId);
}

export { getProfile, createOrganization, createProfile };