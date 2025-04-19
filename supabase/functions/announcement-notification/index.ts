import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Expo } from "expo-server-sdk";
import type { Tables } from "../../../supabase.ts";

const expo = new Expo({
  // accessToken: Deno.env.get("EXPO_ACCESS_TOKEN"), // only needed if you have enabled push security
  useFcmV1: true,
});

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    req.headers.get("Authorization")!.replace("Bearer ", ""),
  );

  const { data: user, error } = await supabase.from("admin-only").select("*");
  if (error) throw error;

  if (user.length === 0) {
    throw new Error("Not service account...");
  }

  const { record }: { record: Tables<"announcements"> } = await req.json();

  // Fetch expo_push_tokens for the given eventId
  const { data, error: tokenError } = await supabase
    .from("event_invite")
    .select<
      "profiles!inner(expo_push_token)", // column list
      { profiles: Pick<Tables<"profiles">, "expo_push_token"> } // row shape
    >("profiles!inner(expo_push_token)")
    .eq("event_id", record.event_id);

  if (tokenError) {
    console.error(tokenError);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch tokens",
        errorJson: JSON.stringify(tokenError),
      }),
      {
        status: 500,
      },
    );
  }

  // Send push notifications to each token
  const expoPushTokens =
    data?.map(({ profiles }) => profiles.expo_push_token).filter(Boolean) ?? [];

  const messages = [];
  for (const pushToken of expoPushTokens) {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push({
      to: pushToken,
      sound: "default",
      body: record.content,
      title: record.title,
      // data: { withSome: 'data' },
    });
  }

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  }

  // Later, after the Expo push notification service has delivered the
  // notifications to Apple or Google (usually quickly, but allow the service
  // up to 30 minutes when under load), a "receipt" for each notification is
  // created. The receipts will be available for at least a day; stale receipts
  // are deleted.
  //
  // The ID of each receipt is sent back in the response "ticket" for each
  // notification. In summary, sending a notification produces a ticket, which
  // contains a receipt ID you later use to get the receipt.
  //
  // The receipts may contain error codes to which you must respond. In
  // particular, Apple or Google may block apps that continue to send
  // notifications to devices that have blocked notifications or have uninstalled
  // your app. Expo does not control this policy and sends back the feedback from
  // Apple and Google so you can handle it appropriately.
  const receiptIds = [];
  const ticketToTokenMap = new Map();

  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i];
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.status === "ok") {
      receiptIds.push(ticket.id);
      // Store the mapping between receipt ID and push token
      ticketToTokenMap.set(ticket.id, expoPushTokens[i]);
    }
  }

  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  // Like sending notifications, there are different strategies you could use
  // to retrieve batches of receipts from the Expo service.
  for (const chunk of receiptIdChunks) {
    try {
      const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      console.log(receipts);

      // The receipts specify whether Apple or Google successfully received the
      // notification and information about an error, if one occurred.
      for (const receiptId in receipts) {
        const { status, details } = receipts[receiptId];
        if (status === "ok") {
          continue;
        } else if (status === "error") {
          console.error(
            `There was an error sending a notification: ${details?.error}`,
          );
          if (details && details.error) {
            // The error codes are listed in the Expo documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
            // You must handle the errors appropriately.

            if (details.error === "DeviceNotRegistered") {
              // Remove the expo token from the profile in the database
              const pushToken = ticketToTokenMap.get(receiptId);
              if (pushToken) {
                await supabase
                  .from("profiles")
                  .update({ expo_push_token: null })
                  .eq("expo_push_token", pushToken);
              }
            } else if (details.error === "MessageTooBig") {
              console.error(
                "Notification payload too large. Must be at most 4096 bytes.",
              );
            } else if (details.error === "MessageRateExceeded") {
              console.error(
                "Message rate exceeded. Implement exponential backoff for retries.",
              );
            } else if (details.error === "InvalidCredentials") {
              console.error(
                "Invalid push notification credentials. Check FCM server key or APN key.",
              );
            } else {
              console.error(`Unknown error code: ${details.error}`);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
