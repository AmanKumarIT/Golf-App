import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Fetch premium users with entries
    const { data: eligibleUsers, error } = await supabase
      .from('users')
      .select('*')
      .eq('subscriptionStatus', 'active')
      .gt('entries', 0);

    if (error) throw error;

    if (!eligibleUsers || eligibleUsers.length === 0) {
      // Return a simulated fallback if no real users are active
      return NextResponse.json({
        ticket: [8, 8, 4, 1, 9],
        winnerName: "Guest Participant",
      });
    }

    // Pick a random user
    const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
    const winner = eligibleUsers[randomIndex];

    // Generate a random 5 digit ticket number specifically for this winner's animation
    const ticket = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));

    return NextResponse.json({
      ticket,
      winnerName: winner.name,
      userId: winner.id,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to run draw engine" }, { status: 500 });
  }
}
