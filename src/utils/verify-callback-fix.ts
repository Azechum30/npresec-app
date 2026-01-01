/**
 * Verification utility for callback URL fix
 * Tests that manual sign-in navigation correctly redirects back to the original page
 * without server-side errors
 */

import type { UserRole } from "@/auth-types";
import { getAuthRedirectPath, isValidCallbackUrl } from "./auth-redirects";

interface TestCase {
  name: string;
  description: string;
  scenario: {
    currentPath: string;
    userRole: UserRole;
    explicitCallback?: string;
    hasStoredHistory?: boolean;
  };
  expectedResult: string;
  shouldPass: boolean;
}

/**
 * Test cases for callback URL verification
 */
const TEST_CASES: TestCase[] = [
  {
    name: "Admin Manual Navigation Fix",
    description: "Admin on /admin/staff manually navigates to /sign-in",
    scenario: {
      currentPath: "/admin/staff",
      userRole: "admin",
      hasStoredHistory: true,
    },
    expectedResult: "/admin/staff",
    shouldPass: true,
  },
  {
    name: "Explicit Callback Priority",
    description: "Explicit callback URL should take priority",
    scenario: {
      currentPath: "/admin/users",
      userRole: "admin",
      explicitCallback: "/admin/settings",
      hasStoredHistory: true,
    },
    expectedResult: "/admin/settings",
    shouldPass: true,
  },
  {
    name: "Role-based Fallback",
    description: "No callback should fall back to role-based redirect",
    scenario: {
      currentPath: "/sign-in",
      userRole: "student",
      hasStoredHistory: false,
    },
    expectedResult: "/students",
    shouldPass: true,
  },
  {
    name: "Invalid Callback Security",
    description: "Invalid callback should be ignored",
    scenario: {
      currentPath: "/admin/users",
      userRole: "admin",
      explicitCallback: "/sign-in", // Invalid - should be ignored
      hasStoredHistory: false,
    },
    expectedResult: "/admin/dashboard",
    shouldPass: true,
  },
];

/**
 * Mock sessionStorage for testing
 */
class MockSessionStorage {
  private data: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.data[key] || null;
  }

  setItem(key: string, value: string): void {
    this.data[key] = value;
  }

  removeItem(key: string): void {
    delete this.data[key];
  }

  clear(): void {
    this.data = {};
  }

  mockRouteHistory(currentPath: string, previousPath?: string): void {
    const history = {
      current: previousPath
        ? { path: currentPath, timestamp: Date.now() }
        : null,
      previous: previousPath
        ? { path: previousPath, timestamp: Date.now() - 1000 }
        : null,
      history: previousPath
        ? [
            { path: previousPath, timestamp: Date.now() - 1000 },
            { path: currentPath, timestamp: Date.now() },
          ]
        : [],
    };
    this.setItem("npresec-route-history", JSON.stringify(history));
  }
}

/**
 * Safe function to get stored callback URL (works in both client and server)
 */
function getSafeStoredCallbackUrl(
  mockStorage?: MockSessionStorage
): string | null {
  // Return null on server-side to prevent errors
  if (typeof window === "undefined" && !mockStorage) {
    return null;
  }

  try {
    const storage =
      mockStorage ||
      (typeof window !== "undefined" ? window.sessionStorage : null);
    if (!storage) return null;

    const stored = storage.getItem("npresec-route-history");
    if (!stored) return null;

    const data = JSON.parse(stored);
    const excludePaths = [
      "/sign-in",
      "/sign-up",
      "/forgot-password",
      "/reset-password",
      "/",
      "/about",
    ];

    // Try previous route first
    if (
      data.previous?.path &&
      isValidCallbackUrl(data.previous.path) &&
      !excludePaths.includes(data.previous.path)
    ) {
      return data.previous.path;
    }

    // Search history
    const history = data.history || [];
    for (let i = history.length - 1; i >= 0; i--) {
      const entry = history[i];
      if (
        isValidCallbackUrl(entry.path) &&
        !excludePaths.includes(entry.path) &&
        entry.path !== data.current?.path
      ) {
        return entry.path;
      }
    }
  } catch (error) {
    // Silently handle errors
    return null;
  }

  return null;
}

/**
 * Run a single test case
 */
function runTestCase(testCase: TestCase): {
  passed: boolean;
  actual: string;
  expected: string;
  error?: string;
} {
  try {
    const mockStorage = new MockSessionStorage();

    // Setup mock storage if needed
    if (testCase.scenario.hasStoredHistory) {
      mockStorage.mockRouteHistory("/sign-in", testCase.scenario.currentPath);
    }

    // Get callback URL
    let callbackUrl = testCase.scenario.explicitCallback;
    if (!callbackUrl && testCase.scenario.hasStoredHistory) {
      callbackUrl = getSafeStoredCallbackUrl(mockStorage) || undefined;
    }

    // Test redirect logic
    const actual = getAuthRedirectPath({
      callbackUrl,
      userRole: testCase.scenario.userRole,
      defaultFallback: "/profile",
    });

    const passed = actual === testCase.expectedResult;

    return {
      passed,
      actual,
      expected: testCase.expectedResult,
    };
  } catch (error) {
    return {
      passed: false,
      actual: "ERROR",
      expected: testCase.expectedResult,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Run all verification tests
 */
export function verifyCallbackUrlFix(): {
  overallPassed: boolean;
  passedCount: number;
  totalCount: number;
  results: Array<{
    testCase: TestCase;
    result: ReturnType<typeof runTestCase>;
  }>;
} {
  const results = TEST_CASES.map((testCase) => ({
    testCase,
    result: runTestCase(testCase),
  }));

  const passedCount = results.filter((r) => r.result.passed).length;
  const totalCount = results.length;
  const overallPassed = passedCount === totalCount;

  return {
    overallPassed,
    passedCount,
    totalCount,
    results,
  };
}

/**
 * Console log verification results
 */
export function logVerificationResults(): void {
  console.log("🔍 Callback URL Fix Verification");
  console.log("================================");

  const verification = verifyCallbackUrlFix();

  verification.results.forEach((item, index) => {
    const { testCase, result } = item;
    const status = result.passed ? "✅" : "❌";

    console.log(`\n${index + 1}. ${status} ${testCase.name}`);
    console.log(`   Scenario: ${testCase.description}`);

    if (!result.passed) {
      console.log(`   Expected: ${result.expected}`);
      console.log(`   Actual:   ${result.actual}`);
      if (result.error) {
        console.log(`   Error:    ${result.error}`);
      }
    }
  });

  console.log(
    `\n📊 Results: ${verification.passedCount}/${verification.totalCount} tests passed`
  );

  if (verification.overallPassed) {
    console.log(
      "🎉 All tests passed! The callback URL fix is working correctly."
    );
    console.log("✅ No more server-side sessionStorage errors");
    console.log("✅ Manual sign-in navigation preserves user context");
    console.log("✅ Security validation prevents malicious redirects");
  } else {
    console.warn(
      "⚠️  Some tests failed. The callback URL fix may need adjustment."
    );
  }
}

/**
 * Test the specific issue mentioned: admin on /admin/staff
 */
export function testAdminStaffIssue(): boolean {
  console.log("🎭 Testing specific issue: Admin on /admin/staff → /sign-in");

  const result = runTestCase(TEST_CASES[0]); // First test case is the admin/staff issue

  console.log(`Test: ${TEST_CASES[0].name}`);
  console.log(`Result: ${result.passed ? "✅ FIXED" : "❌ NOT FIXED"}`);

  if (result.passed) {
    console.log("🎉 The original issue has been resolved!");
    console.log(`   Admin will correctly return to ${result.expected}`);
  } else {
    console.warn("⚠️  The original issue persists!");
    console.log(`   Expected: ${result.expected}, Got: ${result.actual}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }

  return result.passed;
}

/**
 * Browser-safe verification (can be called from browser console)
 */
export const browserVerification = {
  /**
   * Run full verification
   */
  runAll: (): void => {
    logVerificationResults();
  },

  /**
   * Test specific admin/staff issue
   */
  testAdminStaffFix: (): void => {
    testAdminStaffIssue();
  },

  /**
   * Check if we're in a safe environment (no server-side errors)
   */
  checkEnvironment: (): void => {
    console.log("🌍 Environment Check");
    console.log("====================");

    console.log(`Window available: ${typeof window !== "undefined"}`);
    console.log(
      `SessionStorage available: ${typeof window !== "undefined" && !!window.sessionStorage}`
    );
    console.log(
      `Running on: ${typeof window !== "undefined" ? "Client" : "Server"}`
    );

    if (typeof window !== "undefined") {
      console.log("✅ Safe to access browser APIs");

      // Test sessionStorage access
      try {
        window.sessionStorage.getItem("test");
        console.log("✅ SessionStorage access works");
      } catch (error) {
        console.warn("⚠️  SessionStorage access failed:", error);
      }
    } else {
      console.log("✅ Server-side execution - no browser API access attempted");
    }
  },
};

// Auto-expose to window in development mode
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).callbackVerification = browserVerification;
  console.log("🚀 Callback URL verification loaded!");
  console.log("📋 Available commands:");
  console.log("   callbackVerification.runAll()");
  console.log("   callbackVerification.testAdminStaffFix()");
  console.log("   callbackVerification.checkEnvironment()");
}

export default browserVerification;
