// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nzodwzaqoifbvjarvuek.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56b2R3emFxb2lmYnZqYXJ2dWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTQ5MDQsImV4cCI6MjA2NTQ3MDkwNH0.cGYNjsYcTNus6eteNTPxSu_Mkp-4Bz_wl-TpF6xydKY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);