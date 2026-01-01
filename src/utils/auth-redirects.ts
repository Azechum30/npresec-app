import { UserRole } from "@/auth-types";

interface RedirectOptions {
  callbackUrl?: string | null;
  userRole?: UserRole | string | null;
  defaultFallback?: string;
}

/**
 * Public routes that should not be used as callback URLs to avoid redirect loops
 */
const PUBLIC_ROUTES = [
  "/",
  "/sign-in",
  "/forgot-password",
  "/reset-password",
  "/reset-password-notice",
  "/unauthorized",
  "/about",
  "/about/vision-mission",
  "/about/board-of-governors",
];

/**
 * Get role-based dashboard path
 */
export function getRoleDashboardPath(role: UserRole): string {
  const dashboardMap: Record<UserRole, string> = {
    admin: "/admin/dashboard",
    teaching_staff: "/teachers",
    staff: "/teachers",
    student: "/students",
    parent: "/parents",
  };

  return dashboardMap[role] || "/profile";
}

/**
 * Validate if a callback URL is safe to redirect to
 */
export function isValidCallbackUrl(callbackUrl: string): boolean {
  // Must be a relative URL
  if (!callbackUrl.startsWith("/")) {
    return false;
  }

  // Prevent protocol-relative URLs (//example.com)
  if (callbackUrl.startsWith("//")) {
    return false;
  }

  // Don't redirect to public routes to avoid loops
  if (PUBLIC_ROUTES.includes(callbackUrl)) {
    return false;
  }

  // Don't redirect to auth-related routes
  if (callbackUrl.startsWith("/sign-in") || callbackUrl.startsWith("/auth")) {
    return false;
  }

  return true;
}

/**
 * Determine the best redirect path for an authenticated user
 */
export function getAuthRedirectPath(options: RedirectOptions): string {
  const { callbackUrl, userRole, defaultFallback = "/profile" } = options;

  // First priority: Valid callback URL
  if (callbackUrl && isValidCallbackUrl(callbackUrl)) {
    return callbackUrl;
  }

  // Second priority: Role-based dashboard
  if (userRole) {
    const validRoles: UserRole[] = [
      "admin",
      "teaching_staff",
      "staff",
      "student",
      "parent",
    ];

    if (validRoles.includes(userRole as UserRole)) {
      return getRoleDashboardPath(userRole as UserRole);
    }
  }

  // Final fallback
  return defaultFallback;
}

/**
 * Create a sign-in URL with callback URL parameter
 */
export function createSignInUrl(callbackUrl?: string): string {
  const signInUrl = new URL(
    "/sign-in",
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000",
  );

  if (callbackUrl && isValidCallbackUrl(callbackUrl)) {
    signInUrl.searchParams.set("callbackUrl", callbackUrl);
  }

  return signInUrl.pathname + signInUrl.search;
}

/**
 * Enhanced create redirect that handles both explicit callbacks and current path
 */
export function createAuthRedirectWithContext(
  currentPath: string,
  explicitCallback?: string,
): string {
  const callbackUrl =
    explicitCallback ||
    (isValidCallbackUrl(currentPath) ? currentPath : undefined);
  return createSignInUrl(callbackUrl);
}

/**
 * Utility for middleware to create redirect URLs
 */
export function createAuthRedirect(pathname: string): string {
  return createSignInUrl(pathname);
}

/**
 * Check if current path requires authentication
 */
export function requiresAuth(pathname: string): boolean {
  return (
    !PUBLIC_ROUTES.includes(pathname) &&
    !PUBLIC_ROUTES.some((route) => route !== "/" && pathname.startsWith(route))
  );
}

/**
 * Get user-friendly route names for display
 */
export function getRouteDisplayName(path: string): string {
  const routeNames: Record<string, string> = {
    "/admin/dashboard": "Admin Dashboard",
    "/admin/users": "User Management",
    "/admin/roles": "Role Management",
    "/teachers": "Teachers Dashboard",
    "/students": "Students Dashboard",
    "/parents": "Parents Dashboard",
    "/profile": "Profile",
    "/settings": "Settings",
  };

  return (
    routeNames[path] || path.split("/").pop()?.replace("-", " ") || "Dashboard"
  );
}

/**
 * Type guard to check if a role is valid
 */
export function isValidUserRole(role: any): role is UserRole {
  const validRoles: UserRole[] = [
    "admin",
    "teaching_staff",
    "staff",
    "student",
    "parent",
  ];
  return typeof role === "string" && validRoles.includes(role as UserRole);
}

/**
 * Extract pathname from referrer URL safely
 */
export function extractReferrerPath(referrer: string): string | null {
  try {
    const referrerUrl = new URL(referrer);
    const referrerPath = referrerUrl.pathname;

    // Only return if it's a valid callback URL
    if (isValidCallbackUrl(referrerPath)) {
      return referrerPath;
    }
  } catch {
    // Invalid referrer URL
  }
  return null;
}

/**
 * Debug utility to log redirect decisions (development only)
 */
export function logRedirectDecision(
  options: RedirectOptions & { referrer?: string },
  finalPath: string,
  reason: string,
): void {
  if (process.env.NODE_ENV === "development") {
    console.log("🔀 Auth Redirect Decision:", {
      callbackUrl: options.callbackUrl,
      userRole: options.userRole,
      referrer: options.referrer,
      finalPath,
      reason,
      timestamp: new Date().toISOString(),
      isManualNavigation: !options.callbackUrl && options.referrer,
    });
  }
}

/**
 * Main redirect utility with logging and referrer support
 */
export function getAuthRedirectPathWithLogging(
  options: RedirectOptions & { referrer?: string },
): string {
  const { callbackUrl, userRole, referrer } = options;
  let reason = "";
  let effectiveCallbackUrl = callbackUrl;

  // If no explicit callback URL, try to use referrer
  if (!callbackUrl && referrer) {
    const referrerPath = extractReferrerPath(referrer);
    if (referrerPath) {
      effectiveCallbackUrl = referrerPath;
      reason = `Using referrer as callback: ${referrerPath}`;
    }
  }

  // Determine redirect with reasoning
  if (effectiveCallbackUrl && isValidCallbackUrl(effectiveCallbackUrl)) {
    if (!reason) {
      reason = "Using valid callback URL";
    }
  } else if (callbackUrl) {
    reason = `Invalid callback URL: ${callbackUrl}`;
  } else if (userRole && isValidUserRole(userRole)) {
    reason = `Using role-based redirect for: ${userRole}`;
  } else {
    reason = "Using default fallback";
  }

  const finalPath = getAuthRedirectPath({
    ...options,
    callbackUrl: effectiveCallbackUrl,
  });

  logRedirectDecision({ ...options, referrer }, finalPath, reason);

  return finalPath;
}
