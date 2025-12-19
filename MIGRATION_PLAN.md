# Migration Plan: Lucia-auth → Better-auth

## Overview

This document outlines a comprehensive migration strategy from Lucia-auth to Better-auth for your Next.js application.

## Current Architecture Analysis

### Lucia-auth Implementation Points:

1. **Core Setup**: `src/lib/lucia.ts` - Lucia instance with Prisma adapter
2. **Session Management**: `src/lib/get-user.ts` - Session validation and cookie handling
3. **Authentication Actions**: `src/lib/server-only-actions/authenticate.ts` - Sign up, sign in, logout, password reset
4. **Auth Middleware**: `src/middlewares/auth.ts` - ORPC middleware for protected routes
5. **User Context**: `src/lib/getAuthUser.ts` - Extended user data with relations
6. **Client Provider**: `src/components/customComponents/SessionProvider.tsx` - React context for user
7. **API Route**: `src/app/api/auth/validate/route.ts` - Session validation endpoint
8. **Middleware Proxy**: `src/proxy.ts` - Next.js middleware for route protection

### Database Schema:

- `User` model with `id`, `email`, `username`, `password`
- `Session` model with `id`, `userId`, `expiresAt`

## Migration Strategy

### Phase 1: Setup & Configuration (Low Risk)

#### 1.1 Install Better-auth Dependencies

```bash
pnpm add better-auth
pnpm remove lucia @lucia-auth/adapter-prisma
```

#### 1.2 Create Better-auth Configuration

**File**: `src/lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set based on your needs
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        unique: true,
      },
      picture: {
        type: "string",
        required: false,
      },
      roleId: {
        type: "string",
        required: false,
      },
      resetPasswordRequired: {
        type: "boolean",
        required: false,
        default: false,
      },
      // Add other custom fields as needed
    },
  },
});
```

#### 1.3 Create Better-auth API Route

**File**: `src/app/api/auth/[...all]/route.ts`

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### Phase 2: Database Schema Migration (Medium Risk)

#### 2.1 Update Prisma Schema

Better-auth uses a different schema structure. You'll need to:

**Option A: Use Better-auth's schema (Recommended)**

- Run Better-auth's Prisma generator to add its tables
- Keep your existing User table but align fields
- Map Better-auth's session/user to your User model

**Option B: Custom Schema (More Control)**

- Manually create Better-auth compatible tables
- Maintain your existing User structure
- Create mapping layer between Better-auth and your User model

**Recommended Schema Updates**:

```prisma
// Add Better-auth required fields to User model
model User {
  // ... existing fields
  emailVerified Boolean? @default(false)
  image         String?  // Better-auth uses 'image' instead of 'picture'

  // Better-auth session relationship
  sessions      Session[]
  accounts      Account[]
}

// Better-auth Session model (if not using their generator)
model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  token     String   @unique
  ipAddress String?
  userAgent String?
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

// Better-auth Account model (for OAuth if needed)
model Account {
  id                String  @id @default(cuid())
  userId            String
  accountId         String
  providerId        String
  accessToken       String?
  refreshToken      String?
  expiresAt         DateTime?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
  @@map("accounts")
}
```

#### 2.2 Migration Script

Create a migration script to:

- Migrate existing sessions to Better-auth format
- Map existing user data
- Preserve password hashes (if using same algorithm)

### Phase 3: Core Authentication Functions (High Risk)

#### 3.1 Replace Session Management

**File**: `src/lib/get-user.ts` → `src/lib/get-session.ts`

```typescript
import { auth } from "@/lib/auth";
import { cache } from "react";

export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });
  return session;
});
```

#### 3.2 Update Authentication Actions

**File**: `src/lib/server-only-actions/authenticate.ts`

**Sign Up**:

```typescript
import { auth } from "@/lib/auth";

export const signUpAction = async (data: SignUpType) => {
  try {
    const { username, email, password } = SignUpSchema.parse(data);

    // Check existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existingUser?.email) {
      return { success: false, error: "Email is already taken!" };
    }

    if (existingUser?.username) {
      return { success: false, error: "Username already taken!" };
    }

    // Create user with Better-auth
    const result = await auth.api.signUpEmail({
      body: {
        email: email.toLowerCase(),
        password,
        name: username, // Better-auth uses 'name' field
      },
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    // Update user with custom fields
    await prisma.user.update({
      where: { id: result.user.id },
      data: {
        username,
        roleId: role.id, // Get role as before
        resetPasswordRequired: false,
      },
    });

    return redirect("/admin/dashboard");
  } catch (error) {
    // Error handling
  }
};
```

**Sign In**:

```typescript
export const signInAction = async (data: SignInType) => {
  try {
    const { email, password } = SignInSchema.parse(data);

    // Check reset password requirement
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true },
    });

    if (user?.resetPasswordRequired) {
      const resetToken = generateToken(user.id);
      return { resetPasswordRequired: true, resetToken };
    }

    // Sign in with Better-auth
    const result = await auth.api.signInEmail({
      body: { email: email.toLowerCase(), password },
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (result.error) {
      return { error: result.error.message };
    }

    // Role-based redirect
    if (user?.role?.name === "admin") {
      return redirect("/admin/dashboard");
    }
    // ... other redirects
  } catch (error) {
    // Error handling
  }
};
```

**Logout**:

```typescript
export const logOut = async () => {
  await auth.api.signOut({
    headers: await import("next/headers").then((m) => m.headers()),
  });
  return { success: true };
};
```

### Phase 4: Middleware & Route Protection (High Risk)

#### 4.1 Update ORPC Auth Middleware

**File**: `src/middlewares/auth.ts`

```typescript
import { auth } from "@/lib/auth";
import { ORPCError, os } from "@orpc/server";

const middlewareAuth = os
  .$context<{
    session?: Awaited<ReturnType<typeof auth.api.getSession>>;
  }>()
  .middleware(async ({ context, next }) => {
    const session =
      context.session ??
      (await auth.api.getSession({
        headers: await import("next/headers").then((m) => m.headers()),
      }));

    if (!session?.user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    // Fetch full user data with relations
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        role: { include: { permissions: true } },
        permissions: true,
      },
    });

    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    return next({ context: { user } });
  });

export const authMiddleware = os.use(middlewareAuth);
```

#### 4.2 Update Next.js Middleware

**File**: `src/proxy.ts` (or `middleware.ts`)

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const publicRoutes = ["/", "/about", "/contact", "/sign-in", "/register"];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get session using Better-auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Role-based access control
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  const role = user?.role?.name;
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isTeacherRoute = request.nextUrl.pathname.startsWith("/teachers");
  const isStudentRoute = request.nextUrl.pathname.startsWith("/students");

  // Role-based redirects
  if (
    isStudentRoute &&
    role === "student" &&
    request.nextUrl.pathname !== "/students"
  ) {
    return NextResponse.redirect(new URL("/students", request.url));
  }
  // ... other role checks

  return NextResponse.next();
}
```

#### 4.3 Update Auth Validation API

**File**: `src/app/api/auth/validate/route.ts`

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
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

    return NextResponse.json({
      valid: true,
      role: user?.role?.name,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication service unavailable" },
      { status: 503 }
    );
  }
}
```

### Phase 5: Client-Side Updates (Medium Risk)

#### 5.1 Update Session Provider

**File**: `src/components/customComponents/SessionProvider.tsx`

```typescript
"use client";

import { createContext, useContext } from "react";
import { useSession } from "@/lib/auth-client";

export type AuthUser = Awaited<ReturnType<typeof useSession>>["user"];

const SessionContext = createContext<AuthUser>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: AuthUser }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(SessionContext);
  if (context === undefined)
    throw new Error("useAuth must be used inside a SessionProvider!");
  return context;
};
```

#### 5.2 Create Better-auth Client

**File**: `src/lib/auth-client.ts`

```typescript
"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const { useSession, signIn, signOut, signUp } = authClient;
```

### Phase 6: Testing & Validation (Critical)

#### 6.1 Test Checklist

- [ ] User registration flow
- [ ] User login flow
- [ ] Session persistence across page reloads
- [ ] Logout functionality
- [ ] Password reset flow
- [ ] Protected route access
- [ ] Role-based redirects
- [ ] ORPC middleware authentication
- [ ] Permission checks
- [ ] Session expiration handling
- [ ] Concurrent session handling
- [ ] Cookie security settings

#### 6.2 Migration Testing Strategy

1. **Parallel Running**: Run both systems side-by-side during transition
2. **Feature Flags**: Use feature flags to switch between auth systems
3. **Gradual Rollout**: Migrate one route/feature at a time
4. **Rollback Plan**: Keep Lucia code commented for quick rollback

### Phase 7: Cleanup (Low Risk)

#### 7.1 Remove Lucia Dependencies

- Remove `lucia` and `@lucia-auth/adapter-prisma` from package.json
- Delete `src/lib/lucia.ts`
- Remove Lucia type declarations

#### 7.2 Update Documentation

- Update API documentation
- Update authentication flow diagrams
- Update developer onboarding docs

## Key Differences & Considerations

### 1. Session Management

- **Lucia**: Manual session cookie management
- **Better-auth**: Automatic session handling via API routes

### 2. Password Hashing

- **Lucia**: Uses your custom argon2 implementation
- **Better-auth**: Has built-in password hashing (bcrypt by default)
- **Action**: Configure Better-auth to use argon2 or migrate passwords

### 3. User Attributes

- **Lucia**: Custom `getUserAttributes` function
- **Better-auth**: Uses `additionalFields` in config
- **Action**: Map your custom fields to Better-auth's structure

### 4. API Structure

- **Lucia**: Direct function calls (`lucia.createSession()`)
- **Better-auth**: API-based (`auth.api.signInEmail()`)
- **Action**: Update all authentication calls

### 5. Type Safety

- **Lucia**: Custom type declarations via module augmentation
- **Better-auth**: Built-in TypeScript support
- **Action**: Update type imports and declarations

## Migration Timeline Estimate

- **Phase 1**: 2-4 hours (Setup)
- **Phase 2**: 4-8 hours (Database)
- **Phase 3**: 8-12 hours (Core functions)
- **Phase 4**: 6-10 hours (Middleware)
- **Phase 5**: 4-6 hours (Client)
- **Phase 6**: 8-16 hours (Testing)
- **Phase 7**: 2-4 hours (Cleanup)

**Total Estimated Time**: 34-60 hours

## Risk Mitigation

1. **Database Backup**: Full backup before schema changes
2. **Feature Branch**: Work in dedicated migration branch
3. **Staging Environment**: Test thoroughly in staging first
4. **User Communication**: Notify users of potential auth downtime
5. **Monitoring**: Enhanced logging during migration
6. **Rollback Plan**: Keep Lucia code for 2-4 weeks post-migration

## Additional Resources

- [Better-auth Documentation](https://better-auth.com/docs)
- [Better-auth Next.js Guide](https://better-auth.com/docs/guides/nextjs)
- [Better-auth Prisma Adapter](https://better-auth.com/docs/adapters/prisma)

## Notes

- Better-auth is already in your `package.json` (v1.4.3)
- Your current password hashing (argon2) should be compatible
- Your role-based access control can be maintained
- Session structure is similar, making migration smoother
