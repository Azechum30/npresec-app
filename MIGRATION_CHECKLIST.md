# Lucia-auth → Better-auth Migration Checklist

## Pre-Migration

- [ ] **Backup Database**: Create full database backup
- [ ] **Create Feature Branch**: `git checkout -b migrate-to-better-auth`
- [ ] **Document Current Behavior**: Note all auth flows and edge cases
- [ ] **Set Up Staging Environment**: Ensure staging mirrors production
- [ ] **Review Better-auth Docs**: Familiarize with API differences

## Phase 1: Setup & Configuration

- [ ] Remove Lucia dependencies: `pnpm remove lucia @lucia-auth/adapter-prisma`
- [ ] Verify Better-auth is installed (already in package.json v1.4.3)
- [ ] Create `src/lib/auth.ts` with Better-auth configuration
- [ ] Create `src/app/api/auth/[...all]/route.ts` for Better-auth API
- [ ] Test Better-auth API route is accessible

## Phase 2: Database Schema

- [ ] Review current Prisma schema
- [ ] Decide on schema approach (Better-auth generator vs custom)
- [ ] Add Better-auth required fields to User model
- [ ] Create Session model (if not using generator)
- [ ] Create Account model (if needed for OAuth)
- [ ] Run Prisma migration: `pnpm prisma migrate dev --name add-better-auth`
- [ ] Verify migration in database
- [ ] Create data migration script (if needed)
- [ ] Test database queries with new schema

## Phase 3: Core Authentication

### Session Management
- [ ] Replace `src/lib/get-user.ts` with Better-auth session
- [ ] Update `src/lib/getAuthUser.ts` to use Better-auth
- [ ] Test session retrieval
- [ ] Verify session cookie handling

### Authentication Actions
- [ ] Update `signUpAction` in `src/lib/server-only-actions/authenticate.ts`
- [ ] Update `signInAction` in `src/lib/server-only-actions/authenticate.ts`
- [ ] Update `logOut` in `src/lib/server-only-actions/authenticate.ts`
- [ ] Update `resetPasswordAction` (if using Better-auth's reset)
- [ ] Update `forgotPasswordActions` (if using Better-auth's forgot)
- [ ] Test sign up flow end-to-end
- [ ] Test sign in flow end-to-end
- [ ] Test logout flow
- [ ] Test password reset flow

## Phase 4: Middleware & Protection

### ORPC Middleware
- [ ] Update `src/middlewares/auth.ts` to use Better-auth
- [ ] Test protected ORPC routes
- [ ] Verify user context in handlers
- [ ] Test permission middleware still works

### Next.js Middleware
- [ ] Update `src/proxy.ts` or create `middleware.ts`
- [ ] Test route protection
- [ ] Test role-based redirects
- [ ] Test public routes still accessible
- [ ] Verify cookie handling in middleware

### API Routes
- [ ] Update `src/app/api/auth/validate/route.ts`
- [ ] Test validation endpoint
- [ ] Verify response format compatibility

## Phase 5: Client-Side

- [ ] Create `src/lib/auth-client.ts` with Better-auth client
- [ ] Update `src/components/customComponents/SessionProvider.tsx`
- [ ] Find all client-side auth usage
- [ ] Update sign in forms to use Better-auth client
- [ ] Update sign up forms to use Better-auth client
- [ ] Update logout buttons/actions
- [ ] Test client-side session updates
- [ ] Verify `useAuth` hook still works

## Phase 6: Testing

### Unit Tests
- [ ] Test session creation
- [ ] Test session validation
- [ ] Test user authentication
- [ ] Test password hashing/verification
- [ ] Test role-based access

### Integration Tests
- [ ] Test complete sign up flow
- [ ] Test complete sign in flow
- [ ] Test complete logout flow
- [ ] Test password reset flow
- [ ] Test protected route access
- [ ] Test role-based redirects
- [ ] Test ORPC protected endpoints
- [ ] Test permission checks

### Edge Cases
- [ ] Test expired sessions
- [ ] Test concurrent sessions
- [ ] Test invalid credentials
- [ ] Test missing sessions
- [ ] Test role changes during session
- [ ] Test permission changes during session

### User Acceptance Testing
- [ ] Test as admin user
- [ ] Test as teacher user
- [ ] Test as student user
- [ ] Test all user flows
- [ ] Verify no regression in existing features

## Phase 7: Cleanup

- [ ] Remove `src/lib/lucia.ts`
- [ ] Remove Lucia type declarations
- [ ] Remove unused Lucia imports
- [ ] Update all documentation
- [ ] Update README with new auth setup
- [ ] Clean up commented code
- [ ] Remove feature flags (if used)
- [ ] Update environment variables documentation

## Post-Migration

- [ ] **Monitor Production**: Watch for auth-related errors
- [ ] **User Feedback**: Collect feedback on auth experience
- [ ] **Performance Check**: Verify no performance degradation
- [ ] **Security Audit**: Review security implications
- [ ] **Documentation**: Update all relevant docs
- [ ] **Team Training**: Brief team on Better-auth usage
- [ ] **Keep Backup**: Keep Lucia code for 2-4 weeks as safety net

## Rollback Plan (If Needed)

- [ ] Keep database backup from pre-migration
- [ ] Keep Lucia code in git history
- [ ] Document rollback steps
- [ ] Test rollback procedure in staging

## Files to Update

### Core Files
- [ ] `src/lib/lucia.ts` → `src/lib/auth.ts` (replace)
- [ ] `src/lib/get-user.ts` (update)
- [ ] `src/lib/getAuthUser.ts` (update)
- [ ] `src/lib/server-only-actions/authenticate.ts` (update)
- [ ] `src/middlewares/auth.ts` (update)
- [ ] `src/proxy.ts` or `middleware.ts` (update)
- [ ] `src/app/api/auth/validate/route.ts` (update)
- [ ] `src/components/customComponents/SessionProvider.tsx` (update)

### New Files to Create
- [ ] `src/lib/auth.ts` (Better-auth config)
- [ ] `src/lib/auth-client.ts` (Better-auth client)
- [ ] `src/app/api/auth/[...all]/route.ts` (Better-auth API route)

### Files to Remove
- [ ] `src/lib/lucia.ts` (after migration complete)

## Common Issues & Solutions

### Issue: Session not persisting
- **Solution**: Check cookie settings in Better-auth config
- **Solution**: Verify API route is properly set up

### Issue: Password verification failing
- **Solution**: Ensure password hashing algorithm matches
- **Solution**: May need to migrate existing password hashes

### Issue: Type errors
- **Solution**: Update all type imports from Lucia to Better-auth
- **Solution**: Update TypeScript declarations

### Issue: Middleware not working
- **Solution**: Verify headers are passed correctly
- **Solution**: Check Next.js middleware configuration

### Issue: Role-based access broken
- **Solution**: Ensure user relations are still loaded
- **Solution**: Verify role data is in session or fetched correctly

## Notes

- Better-auth v1.4.3 is already installed
- Current password hashing (argon2) should work with Better-auth
- Session structure is similar, making migration easier
- Better-auth has built-in TypeScript support
- Better-auth uses API routes instead of direct function calls

