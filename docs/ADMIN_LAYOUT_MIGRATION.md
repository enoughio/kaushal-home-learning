# Admin Layout Server Component Migration

## Overview

This migration converts the admin layout from a client component to a server component pattern, similar to the Next.js dashboard tutorial structure. This provides better performance, SEO (where applicable), and follows Next.js best practices.

## New Structure

### Server Components
- `AdminLayoutServer` - Main server-side layout component
- `AdminSideNav` - Server-rendered sidebar navigation
- Admin pages can now be server components

### Client Components (Interactive Parts)
- `AdminNavLinks` - Navigation with active state and routing
- `AdminLogout` - Logout functionality
- `AdminUserInfo` - User information display
- `AdminMobileHeader` - Mobile navigation with sidebar toggle
- `AdminLayout` - Wrapper for backward compatibility

## File Structure

```
components/layout/
├── admin-layout.tsx              # Backward-compatible wrapper
├── admin-layout-server.tsx       # Main server layout
├── admin-layout-wrapper.tsx      # Client wrapper with auth
├── admin-sidenav.tsx            # Server-side navigation
├── admin-nav-links.tsx          # Client-side navigation links
├── admin-user-info.tsx          # Client-side user info
├── admin-logout.tsx             # Client-side logout
└── admin-mobile-header.tsx      # Client-side mobile header
```

## Usage Patterns

### Option 1: Server Component (Recommended for new pages)
```tsx
import { AdminLayoutServer } from "@/components/layout/admin-layout-server"
// import { requireAuth } from "@/lib/server-auth" // In production

export default async function MyAdminPage() {
  // const user = await requireAuth('admin') // Server-side auth
  
  return (
    <AdminLayoutServer>
      <div>
        <h1>My Admin Page</h1>
        {/* Server-rendered content */}
      </div>
    </AdminLayoutServer>
  )
}
```

### Option 2: Client Component (Existing pages)
```tsx
import { AdminLayout } from "@/components/layout/admin-layout"

export default function MyAdminPage() {
  return (
    <AdminLayout>
      <div>
        <h1>My Admin Page</h1>
        {/* Client-rendered content */}
      </div>
    </AdminLayout>
  )
}
```

## Key Benefits

1. **Better Performance**: Server components render on the server, reducing client-side JavaScript
2. **Faster Initial Load**: Less hydration needed on the client
3. **SEO Ready**: Server-rendered content is immediately available to search engines
4. **Separation of Concerns**: Interactive parts are clearly separated from static content
5. **Backward Compatibility**: Existing pages continue to work without changes

## Authentication Patterns

### Current (Client-Side)
Uses localStorage and client-side checks. Works for the current mock implementation.

### Production (Server-Side)
```tsx
// lib/server-auth.ts
export async function requireAuth(role?: string) {
  const user = await getCurrentUser() // From cookies/JWT
  if (!user || (role && user.role !== role)) {
    redirect('/')
  }
  return user
}

// In pages
export default async function AdminPage() {
  const user = await requireAuth('admin')
  // Page content...
}
```

## Migration Steps for Existing Pages

1. **No changes needed**: Existing pages using `AdminLayout` will continue to work
2. **For new pages**: Use `AdminLayoutServer` directly
3. **For gradual migration**: Replace `AdminLayout` with `AdminLayoutServer` and convert page to async server component

## Component Responsibilities

- **Server Components**: Static layout, navigation structure, server-side data fetching
- **Client Components**: User interactions, routing, state management, authentication checks
- **Hybrid Approach**: Server components for structure, client components for interactivity

## Example Server Action for Logout

```tsx
// lib/server-auth.ts
export async function signOut() {
  'use server'
  const cookieStore = cookies()
  cookieStore.delete('user-session')
  redirect('/')
}

// In component
import { signOut } from "@/lib/server-auth"

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button type="submit">
        <LogOut className="mr-3 h-4 w-4" />
        Logout
      </button>
    </form>
  )
}
```

This structure provides the flexibility to use either pattern based on your needs while maintaining backward compatibility with existing code.