# React Query + Supabase Setup

This project now has a unified React Query + Supabase setup that eliminates the duplicate configurations you had before.

## What was cleaned up

1. **Removed duplicate files**: Your tutorial created `utils/supabase-browser.ts`, `utils/supabase-server.ts`, and `utils/Types.ts` which duplicated functionality from the existing `lib/supabase/` files.

2. **Unified providers**: Replaced the separate `ReactQueryClientProvider` and React Query DevTools with a single `SupabaseProvider` that includes both React Query and Supabase context.

## Key Components

### SupabaseProvider (`components/providers/SupabaseProvider.tsx`)

- Combines React Query and Supabase in one provider
- Provides typed Supabase client throughout the app
- Includes user authentication state
- Includes React Query DevTools

### Database Hooks (`hooks/useDatabase.ts`)

- `useMembers()` - Get all members
- `useProfiles()` - Get all profiles
- `useLeaderMembers()` - Get leader-member relationships
- `useCustomQuery()` - For complex custom queries
- `useCustomMutation()` - For database mutations
- `useCreateMember()` - Create new member
- `useUpdateMember()` - Update existing member

### Updated Files

- `lib/supabase/client.ts` - Now includes proper TypeScript typing
- `lib/supabase/server.ts` - Now includes proper TypeScript typing
- `app/protected/layout.tsx` - Uses new `SupabaseProvider`

## Usage Examples

### Basic Query

```tsx
import { useMembers } from "@/hooks/useDatabase";

function MembersList() {
  const { data: members, isLoading, error } = useMembers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {members?.map((member) => (
        <div key={member.id}>{member.name}</div>
      ))}
    </div>
  );
}
```

### Custom Query

```tsx
import { useCustomQuery } from "@/hooks/useDatabase";

function MembersByStatus() {
  const { data } = useCustomQuery(["members", "active"], async (supabase) => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("status_flag", "active");

    if (error) throw error;
    return data;
  });

  return <div>{/* render data */}</div>;
}
```

### Mutations

```tsx
import { useCreateMember } from "@/hooks/useDatabase";

function CreateMemberButton() {
  const createMember = useCreateMember();

  const handleCreate = () => {
    createMember.mutate({
      name: "New Member",
      awpl_id: "AWPL123",
      levelSao: 1,
      levelSgo: 1,
    });
  };

  return (
    <button onClick={handleCreate} disabled={createMember.isPending}>
      {createMember.isPending ? "Creating..." : "Create Member"}
    </button>
  );
}
```

### Authentication

```tsx
import { useUser } from "@/components/providers/SupabaseProvider";

function UserProfile() {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return <div>Welcome, {user.email}</div>;
}
```

## Database Access

You now have access to:

- Typed Supabase client via `useSupabase()` hook
- User authentication state via `useUser()` hook
- Pre-built hooks for common database operations
- React Query for caching, background updates, and optimistic updates
- Automatic query invalidation after mutations

## Next Steps

1. **Add more specific hooks** in `hooks/useDatabase.ts` for your specific use cases
2. **Use real-time subscriptions** for live data updates
3. **Add optimistic updates** for better UX during mutations
4. **Add error boundaries** for better error handling

The setup is now clean, efficient, and follows best practices for both React Query and Supabase!
