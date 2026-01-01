/**
 * Test utility for auth redirect behavior
 * Use this in development to verify callback URL and referrer handling works correctly
 */

import type { UserRole } from "@/auth-types";
import { extractReferrerPath, getAuthRedirectPath } from "./auth-redirects";

interface RedirectTestCase {
  name: string;
  scenario: string;
  callbackUrl?: string;
  referrer?: string;
  userRole?: UserRole;
  expectedResult: string;
  description: string;
}

/**
 * Test cases for redirect behavior
 */
export const REDIRECT_TEST_CASES: RedirectTestCase[] = [
  {
    name: "Manual Sign-In Navigation",
    scenario: "User on /admin/staff manually navigates to /sign-in",
    referrer: "http://localhost:3000/admin/staff",
    userRole: "admin",
    expectedResult: "/admin/staff",
    description: "Should redirect back to /admin/staff using referrer",
  },
  {
    name: "Direct Sign-In",
    scenario: "User directly visits /sign-in with no referrer",
    userRole: "admin",
    expectedResult: "/admin/dashboard",
    description: "Should redirect to role-based dashboard",
  },
  {
    name: "Explicit Callback URL",
    scenario: "User visits /sign-in?callbackUrl=/admin/users",
    callbackUrl: "/admin/users",
    userRole: "admin",
    expectedResult: "/admin/users",
    description: "Should redirect to explicit callback URL",
  },
  {
    name: "Invalid Callback URL",
    scenario: "User visits /sign-in?callbackUrl=/sign-in",
    callbackUrl: "/sign-in",
    userRole: "admin",
    expectedResult: "/admin/dashboard",
    description: "Should ignore invalid callback and use role-based redirect",
  },
  {
    name: "External Referrer",
    scenario: "User comes from external site",
    referrer: "https://google.com",
    userRole: "student",
    expectedResult: "/students",
    description: "Should ignore external referrer and use role-based redirect",
  },
  {
    name: "Public Route Referrer",
    scenario: "User comes from homepage",
    referrer: "http://localhost:3000/",
    userRole: "teaching_staff",
    expectedResult: "/teachers",
    description:
      "Should ignore public route referrer and use role-based redirect",
  },
];

/**
 * Run a single test case
 */
export function runRedirectTest(testCase: RedirectTestCase): {
  passed: boolean;
  actual: string;
  expected: string;
  reason: string;
} {
  let callbackUrl = testCase.callbackUrl;

  // Simulate referrer processing like in AuthPage
  if (!callbackUrl && testCase.referrer) {
    const referrerPath = extractReferrerPath(testCase.referrer);
    if (referrerPath) {
      callbackUrl = referrerPath;
    }
  }

  const actual = getAuthRedirectPath({
    callbackUrl,
    userRole: testCase.userRole,
    defaultFallback: "/profile",
  });

  const passed = actual === testCase.expectedResult;
  const reason = passed
    ? "✅ Test passed"
    : `❌ Expected ${testCase.expectedResult}, got ${actual}`;

  return {
    passed,
    actual,
    expected: testCase.expectedResult,
    reason,
  };
}

/**
 * Run all test cases and return results
 */
export function runAllRedirectTests(): {
  passed: number;
  failed: number;
  results: Array<{
    testCase: RedirectTestCase;
    result: ReturnType<typeof runRedirectTest>;
  }>;
} {
  const results = REDIRECT_TEST_CASES.map((testCase) => ({
    testCase,
    result: runRedirectTest(testCase),
  }));

  const passed = results.filter((r) => r.result.passed).length;
  const failed = results.filter((r) => !r.result.passed).length;

  return { passed, failed, results };
}

/**
 * Console log all test results (for development)
 */
export function logTestResults(): void {
  console.log("🧪 Auth Redirect Test Results");
  console.log("============================");

  const { passed, failed, results } = runAllRedirectTests();

  results.forEach(({ testCase, result }, index) => {
    console.log(`\n${index + 1}. ${testCase.name}`);
    console.log(`   Scenario: ${testCase.scenario}`);
    console.log(`   ${result.reason}`);
    if (!result.passed) {
      console.log(`   Expected: ${result.expected}`);
      console.log(`   Actual:   ${result.actual}`);
    }
  });

  console.log(`\n📊 Summary: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log("🎉 All tests passed! Redirect behavior is working correctly.");
  } else {
    console.warn("⚠️  Some tests failed. Check the redirect logic.");
  }
}

/**
 * Simulate manual navigation test
 */
export function simulateManualNavigation(
  currentPath: string,
  userRole: UserRole
): string {
  console.log(`🔍 Simulating manual /sign-in navigation from ${currentPath}`);

  // This simulates what happens when user manually navigates to /sign-in
  const referrer = `http://localhost:3000${currentPath}`;
  const referrerPath = extractReferrerPath(referrer);

  const redirectPath = getAuthRedirectPath({
    callbackUrl: referrerPath,
    userRole,
    defaultFallback: "/profile",
  });

  console.log(`📍 Current path: ${currentPath}`);
  console.log(`🔗 Referrer: ${referrer}`);
  console.log(`✅ Should redirect to: ${redirectPath}`);

  return redirectPath;
}

/**
 * Test specific scenarios
 */
export const testScenarios = {
  /**
   * Test the main issue: admin on /admin/staff manually navigating to /sign-in
   */
  adminManualNavigation: () =>
    simulateManualNavigation("/admin/staff", "admin"),

  /**
   * Test student manual navigation
   */
  studentManualNavigation: () =>
    simulateManualNavigation("/students/grades", "student"),

  /**
   * Test teacher manual navigation
   */
  teacherManualNavigation: () =>
    simulateManualNavigation("/teachers/classes", "teaching_staff"),
};

// Run tests automatically in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Only run in browser and development mode
  console.log("🚀 Auth redirect tests loaded. Use these functions:");
  console.log("- testScenarios.adminManualNavigation()");
  console.log("- testScenarios.studentManualNavigation()");
  console.log("- testScenarios.teacherManualNavigation()");
  console.log("- logTestResults()");
}
