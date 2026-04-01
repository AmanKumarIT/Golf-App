import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Missing Supabase environment variables.");
}

// We use the service role key by default for server-side logic (API routes)
// to securely bypass RLS policies just as the MongoDB integration did.
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
