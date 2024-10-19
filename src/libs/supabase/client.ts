import { createClient } from "@supabase/supabase-js";
import { env } from "../../config/env";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE } = env;

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
