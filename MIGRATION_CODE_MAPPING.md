# Code Mapping: Lucia-auth → Better-auth

Quick reference for translating Lucia-auth code to Better-auth equivalents.

## Setup & Configuration

### Lucia
```typescript
// src/lib/lucia.ts
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia } from "lucia";

const adapter = new PrismaAdapter(prisma.session, prisma.user);
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "auth-session-token",
    expires: true,
  },
  getUserAttributes: (attributes) => ({
    id: attributes.id,
    username: attributes.username,
    email: attributes.email,
  }),
});
```

### Better-auth
```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  user: {
    additionalFields: {
      username: { type: "string", required: true },
    },
  },
});
```

## Session Management

### Get Session (Lucia)
```typescript
// src/lib/get-user.ts
import { lucia } from "./lucia";
import { cookies } from "next/headers";

const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value;
const result = await lucia.validateSession(sessionId);
return result; // { user, session } or { user: null, session: null }
```

### Get Session (Better-auth)
```typescript
// src/lib/get-session.ts
import { auth } from "./auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({
  headers: await headers(),
});
return session; // { user, session } or null
```

## User Authentication

### Sign Up (Lucia)
```typescript
// Create user manually, then create session
const user = await prisma.user.create({ data: {...} });
const session = await lucia.createSession(user.id, {});
const sessionCookie = lucia.createSessionCookie(session.id);
(await cookies()).set(
  sessionCookie.name,
  sessionCookie.value,
  sessionCookie.attributes
);
```

### Sign Up (Better-auth)
```typescript
// Better-auth handles user creation and session
const result = await auth.api.signUpEmail({
  body: {
    email: "user@example.com",
    password: "password123",
    name: "Username",
  },
  headers: await headers(),
});

if (result.error) {
  // Handle error
}

// Session is automatically created and cookie set
// Update user with custom fields if needed
await prisma.user.update({
  where: { id: result.user.id },
  data: { username: "custom", roleId: "..." },
});
```

### Sign In (Lucia)
```typescript
// Verify password manually, then create session
const user = await prisma.user.findUnique({ where: { email } });
const isValid = await argon2.verify(user.password, password);

if (isValid) {
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
```

### Sign In (Better-auth)
```typescript
// Better-auth handles password verification
const result = await auth.api.signInEmail({
  body: {
    email: "user@example.com",
    password: "password123",
  },
  headers: await headers(),
});

if (result.error) {
  // Handle error: result.error.message
}

// Session is automatically created and cookie set
```

### Logout (Lucia)
```typescript
const { session } = await getSession();
if (session?.id) {
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
```

### Logout (Better-auth)
```typescript
await auth.api.signOut({
  headers: await headers(),
});
// Session invalidated and cookie cleared automatically
```

## Middleware

### ORPC Middleware (Lucia)
```typescript
// src/middlewares/auth.ts
import { getAuthUser } from "@/lib/getAuthUser";

const middlewareAuth = os
  .$context<{ session?: ... }>()
  .middleware(async ({ context, next }) => {
    const user = context.session ?? await getAuthUser();
    if (!user) throw new ORPCError("UNAUTHORIZED");
    return next({ context: { user } });
  });
```

### ORPC Middleware (Better-auth)
```typescript
// src/middlewares/auth.ts
import { auth } from "@/lib/auth";

const middlewareAuth = os
  .$context<{ session?: ... }>()
  .middleware(async ({ context, next }) => {
    const session = context.session ?? await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user) throw new ORPCError("UNAUTHORIZED");
    
    // Fetch full user with relations
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true, permissions: true },
    });
    
    return next({ context: { user } });
  });
```

### Next.js Middleware (Lucia)
```typescript
// src/proxy.ts or middleware.ts
const authCookie = request.cookies.get("auth-session-token");
if (!authCookie) {
  return NextResponse.redirect(new URL("/sign-in", request.url));
}

// Validate via API
const response = await fetch("/api/auth/validate", {
  headers: { cookie: `auth-session-token=${authCookie.value}` },
});
```

### Next.js Middleware (Better-auth)
```typescript
// middleware.ts
import { auth } from "@/lib/auth";

const session = await auth.api.getSession({
  headers: request.headers,
});

if (!session?.user) {
  return NextResponse.redirect(new URL("/sign-in", request.url));
}
```

## Client-Side

### Client Session (Lucia)
```typescript
// Usually server-side only with Lucia
// Client gets session via props/context
```

### Client Session (Better-auth)
```typescript
// src/lib/auth-client.ts
"use client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const { useSession, signIn, signOut, signUp } = authClient;

// Usage in component
const { data: session, isPending } = useSession();
```

## API Routes

### Validation Route (Lucia)
```typescript
// src/app/api/auth/validate/route.ts
import { getAuthUser } from "@/lib/getAuthUser";

const user = await getAuthUser();
if (!user) {
  return NextResponse.json({ valid: false }, { status: 401 });
}
return NextResponse.json({ valid: true, role: user.role?.name });
```

### Validation Route (Better-auth)
```typescript
// src/app/api/auth/validate/route.ts
import { auth } from "@/lib/auth";

const session = await auth.api.getSession({
  headers: request.headers,
});

if (!session?.user) {
  return NextResponse.json({ valid: false }, { status: 401 });
}

const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  include: { role: true },
});

return NextResponse.json({ valid: true, role: user?.role?.name });
```

## Type Definitions

### Lucia Types
```typescript
import { User, Session } from "lucia";

type AuthUser = User;
type AuthSession = Session;
```

### Better-auth Types
```typescript
import type { Session } from "better-auth/types";

type AuthUser = Session["user"];
type AuthSession = Session;
```

## Password Hashing

### Lucia (Custom)
```typescript
// You handle password hashing
import argon2 from "argon2";

const hashedPassword = await argon2.hash(password);
const isValid = await argon2.verify(hashedPassword, password);
```

### Better-auth
```typescript
// Better-auth handles password hashing automatically
// But you can configure it:
export const auth = betterAuth({
  // ... other config
  password: {
    minLength: 8,
    // Uses bcrypt by default, but can be configured
  },
});

// For existing users, you may need to:
// 1. Keep using your custom hashing for verification
// 2. Or migrate all passwords to Better-auth's format
```

## Common Patterns

### Check if User is Authenticated
```typescript
// Lucia
const { user, session } = await getSession();
if (!user || !session) {
  // Not authenticated
}

// Better-auth
const session = await auth.api.getSession({ headers });
if (!session?.user) {
  // Not authenticated
}
```

### Get User with Relations
```typescript
// Both approaches similar
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  include: { role: true, permissions: true },
});
```

### Create Session Cookie
```typescript
// Lucia - Manual
const sessionCookie = lucia.createSessionCookie(session.id);
cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

// Better-auth - Automatic
// Session cookie is set automatically by auth.api methods
```

## Migration Tips

1. **Start with Session Management**: Replace `getSession` first, test thoroughly
2. **Then Authentication Actions**: Update sign up/in/out one at a time
3. **Update Middleware Last**: After core functions work
4. **Test Each Step**: Don't move forward until current step works
5. **Keep Lucia Code**: Comment out, don't delete until migration is complete
6. **Use Feature Flags**: Toggle between Lucia and Better-auth during migration

## Key Differences Summary

| Feature | Lucia | Better-auth |
|---------|-------|-------------|
| Session Creation | Manual | Automatic |
| Cookie Management | Manual | Automatic |
| Password Hashing | Custom | Built-in (configurable) |
| API Structure | Direct functions | API routes |
| Client Support | Limited | Full React support |
| Type Safety | Module augmentation | Built-in |
| OAuth Support | Via adapters | Built-in |
| MFA Support | Via plugins | Built-in |

