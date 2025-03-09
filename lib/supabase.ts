import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ljjhtynzegxittmgmdvd.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqamh0eW56ZWd4aXR0bWdtZHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NTM0ODMsImV4cCI6MjA1NzAyOTQ4M30.noDqqiEJ-Uly7h0PUFUDHNTXL3KEw4Oudv9rRWEtZmc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
