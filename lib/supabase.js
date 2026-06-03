import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mbkxrijrywveupjhplil.supabase.co";

const supabaseAnonKey = "sb_publishable_LzqE6h-E3gXhf8ZDAOkbYg_9kYoyEvP";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
