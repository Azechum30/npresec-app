/**
 * Test utility to verify callback URL fix for manual sign-in navigation
 *
 * Usage:
 * 1. Navigate to any protected page (e.g., /admin/staff)
 * 2. Run testManualSignInRedirect() in browser console
 * 3. Verify you're redirected back to the original page
 */

import type { UserRole } from "@/auth-types";
import { getStoredCallbackUrl } from "@/components/providers/RouteTrackingProvider";
import { getAuthRedirectPath, isValidCallbackUrl } from "./auth-redirects";

interface TestResult {
  testName: string;
  passed: boolean;
  expected: string;
  actual: string;
  reason: string;
}

interface TestScenario {
  name: string;
  description: string;
  setup: () => void;
  test: () => TestResult;
}

/**
 * Simulate the callback URL behavior we implemented
 */
export function simulateCallbackUrlBehavior(
  currentPath: string,
  userRole: UserRole,
  explicitCallback?: string
): string {
  // This simulates what happens in AuthPage
  let callbackUrl = explicitCallback;

  // If no explicit callback, try to get from stored route history
  if (!callbackUrl) {
    callbackUrl = getStoredCallbackUrl() || undefined;
  }

  // Use the same redirect logic as AuthPage
  const redirectPath = getAuthRedirectPath({
    callbackUrl: callbackUrl,
    userRole: userRole,
    defaultFallback: "/profile",
  });

  return redirectPath;
}

/**
 * Test the main issue: admin on /admin/staff manually navigating to /sign-in
 */
export function testAdminManualNavigation(): TestResult {
  const currentPath = "/admin/staff";
  const userRole = "admin";

  // Simulate what should happen
  const actual = simulateCallbackUrlBehavior(currentPath, userRole);
  const expected = "/admin/staff"; // Should redirect back to original path

  const passed = actual === expected;

  return {
    testName: "Admin Manual Navigation",
    passed,
    expected,
    actual,
    reason: passed
      ? "✅ Correctly redirects back to /admin/staff"
      : `❌ Expected ${expected}, got ${actual}`,
  };
}

/**
 * Test explicit callback URL (should still work)
 */
export function testExplicitCallback(): TestResult {
  const explicitCallback = "/admin/users";
  const userRole = "admin";

  const actual = simulateCallbackUrlBehavior(
    "/sign-in",
    userRole,
    explicitCallback
  );
  const expected = explicitCallback;

  const passed = actual === expected;

  return {
    testName: "Explicit Callback URL",
    passed,
    expected,
    actual,
    reason: passed
      ? "✅ Correctly uses explicit callback URL"
      : `❌ Expected ${expected}, got ${actual}`,
  };
}

/**
 * Test direct sign-in (no callback) - should use role-based redirect
 */
export function testDirectSignIn(): TestResult {
  const userRole = "admin";

  // Simulate direct /sign-in with no callback and no stored history
  const actual = getAuthRedirectPath({
    userRole: userRole,
    defaultFallback: "/profile",
  });
  const expected = "/admin/dashboard"; // Role-based redirect

  const passed = actual === expected;

  return {
    testName: "Direct Sign-in",
    passed,
    expected,
    actual,
    reason: passed
      ? "✅ Correctly uses role-based redirect"
      : `❌ Expected ${expected}, got ${actual}`,
  };
}

/**
 * Test invalid callback URL security
 */
export function testInvalidCallback(): TestResult {
  const invalidCallback = "/sign-in"; // This should be ignored
  const userRole = "admin";

  const actual = simulateCallbackUrlBehavior(
    "/sign-in",
    userRole,
    invalidCallback
  );
  const expected = "/admin/dashboard"; // Should fall back to role-based

  const passed = actual === expected;

  return {
    testName: "Invalid Callback Security",
    passed,
    expected,
    actual,
    reason: passed
      ? "✅ Correctly ignores invalid callback and uses role-based redirect"
      : `❌ Expected ${expected}, got ${actual}`,
  };
}

/**
 * Run all callback URL tests
 */
export function runAllCallbackTests(): {
  passed: number;
  failed: number;
  results: TestResult[];
} {
  const tests = [
    testAdminManualNavigation,
    testExplicitCallback,
    testDirectSignIn,
    testInvalidCallback,
  ];

  const results = tests.map((test) => test());
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  return { passed, failed, results };
}

/**
 * Console log test results with nice formatting
 */
export function logCallbackTestResults(): void {
  console.log("🧪 Callback URL Fix Test Results");
  console.log("================================");

  const { passed, failed, results } = runAllCallbackTests();

  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.testName}`);
    console.log(`   ${result.reason}`);
    if (!result.passed) {
      console.log(`   Expected: ${result.expected}`);
      console.log(`   Actual:   ${result.actual}`);
    }
  });

  console.log(`\n📊 Summary: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log(
      "🎉 All callback URL tests passed! The fix is working correctly."
    );
  } else {
    console.warn(
      "⚠️  Some tests failed. The callback URL fix may need adjustment."
    );
  }
}

/**
 * Real-world test scenarios for browser console
 */
export const browserTests = {
  /**
   * Test current page manual navigation
   * Run this while on any protected page
   */
  testCurrentPageManualNavigation(): void {
    const currentPath = window.location.pathname;
    console.log(`🔍 Testing manual /sign-in navigation from: ${currentPath}`);

    // Get what the callback URL should be
    const storedCallback = getStoredCallbackUrl();
    console.log(`📦 Stored callback URL: ${storedCallback || "None"}`);

    // Test what redirect would happen
    const redirectPath = simulateCallbackUrlBehavior(currentPath, "admin"); // Assume admin for test
    console.log(`🎯 Would redirect to: ${redirectPath}`);

    // Check if it's correct
    const shouldRedirectTo = isValidCallbackUrl(currentPath)
      ? currentPath
      : "/admin/dashboard";
    const isCorrect = redirectPath === shouldRedirectTo;

    console.log(
      `${isCorrect ? "✅" : "❌"} Expected: ${shouldRedirectTo}, Got: ${redirectPath}`
    );

    if (isCorrect) {
      console.log("🎉 Callback URL fix is working correctly!");
    } else {
      console.warn("⚠️  Callback URL fix may not be working as expected.");
    }
  },

  /**
   * Simulate the exact issue scenario
   */
  simulateAdminStaffIssue(): void {
    console.log(
      "🎭 Simulating: Admin on /admin/staff manually navigating to /sign-in"
    );

    // Mock being on /admin/staff
    const mockCurrentPath = "/admin/staff";
    const mockUserRole = "admin";

    // Test the redirect behavior
    const result = testAdminManualNavigation();

    console.log(`Test: ${result.testName}`);
    console.log(`${result.reason}`);

    if (result.passed) {
      console.log("🎉 The original issue is FIXED!");
      console.log("   User will correctly return to /admin/staff");
    } else {
      console.warn("⚠️  The original issue is NOT fixed!");
      console.log(
        `   User would go to ${result.actual} instead of ${result.expected}`
      );
    }
  },

  /**
   * Quick validation of all scenarios
   */
  validateAllScenarios(): void {
    logCallbackTestResults();
  },
};

// Auto-expose to window in development mode
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).callbackTests = browserTests;
  console.log("🚀 Callback URL tests loaded!");
  console.log("📋 Available commands:");
  console.log("   callbackTests.testCurrentPageManualNavigation()");
  console.log("   callbackTests.simulateAdminStaffIssue()");
  console.log("   callbackTests.validateAllScenarios()");
}

export default browserTests;
