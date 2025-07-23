import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("leader_members")
    .select("members(*)")
    .eq("leader_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const teamMembers = data.map((item) => item.members);
  return NextResponse.json(teamMembers);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { awpl_id, name, awpl_pass } = await request.json();

  const { data, error } = await supabase.rpc("add_member_to_leader", {
    leader_id_param: user.id,
    member_awpl_id_param: awpl_id.toUpperCase(),
    member_name_param: name,
    member_pass_param: awpl_pass,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// PUT is for updating a member's details (like name or password).
// The logic for changing an awpl_id should be handled on the client as a 'delete' then 'add'.
export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...updateData } = await request.json();

  // Note: This relies on RLS to ensure a leader can only update their own members.
  const { data, error } = await supabase
    .from("members")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// DELETE now only removes the *link* in the leader_members table.
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ids } = await request.json(); // Expecting an array of member IDs to unlink.

  const { error } = await supabase
    .from("leader_members")
    .delete()
    .eq("leader_id", user.id)
    .in("member_id", ids);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
