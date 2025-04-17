import { supabase } from "@/lib/supabase";

export function getPublicAvatarUrl(avatarUrl: string) {
  const { data } = supabase.storage.from("avatars").getPublicUrl(avatarUrl);
  return data.publicUrl;
}
