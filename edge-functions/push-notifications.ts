import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200 });
  }

  const {
    message,
    content,
    eventId,
  }: { message: string; content: string; eventId: number } = await req.json();

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    },
  );

  // Check if user is authenticated
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser(token);

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 404,
    });
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabaseClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.is_admin) {
    return new Response(JSON.stringify({ error: "Not authorized" }), {
      status: 404,
    });
  }

  // Fetch expo_push_tokens for the given eventId
  const { data: tokens, error: tokenError } = await supabaseClient
    .from("profiles")
    .select("expo_push_token")
    .eq("event_id", eventId);

  if (tokenError) {
    return new Response(JSON.stringify({ error: "Failed to fetch tokens" }), {
      status: 500,
    });
  }

  // Send push notifications to each token
  const expoPushTokens = tokens.map((token) => token.expo_push_token);
  // Here you would integrate with Expo's push notification service
  // Example: await sendPushNotifications(expoPushTokens, message, content);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
