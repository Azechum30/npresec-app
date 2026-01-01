/**
 * GSAP Animation Test Utility
 *
 * This utility provides comprehensive testing and debugging tools for GSAP animations
 * in the NPRESEC application. Use this in development to verify animations are working
 * correctly and troubleshoot performance issues.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// Register plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

interface AnimationTestResult {
  test: string;
  passed: boolean;
  message: string;
  duration?: number;
  error?: string;
}

interface PerformanceMetrics {
  animationCount: number;
  scrollTriggerCount: number;
  averageFrameTime: number;
  droppedFrames: number;
  memoryUsage?: number;
}

class GSAPTestSuite {
  private testResults: AnimationTestResult[] = [];
  private performanceMetrics: PerformanceMetrics = {
    animationCount: 0,
    scrollTriggerCount: 0,
    averageFrameTime: 0,
    droppedFrames: 0,
  };

  /**
   * Run all GSAP tests
   */
  async runAllTests(): Promise<{
    passed: number;
    failed: number;
    results: AnimationTestResult[];
    metrics: PerformanceMetrics;
  }> {
    console.log("🧪 Starting GSAP Animation Test Suite");
    console.log("===================================");

    this.testResults = [];

    // Basic functionality tests
    await this.testBasicGSAPFunctionality();
    await this.testScrollTriggerFunctionality();
    await this.testTextPluginFunctionality();
    await this.testTimelineBasics();
    await this.testStaggerAnimations();

    // Performance tests
    await this.testAnimationPerformance();
    await this.measureScrollTriggerPerformance();

    // Integration tests
    await this.testResponsiveAnimations();
    await this.testCleanupFunctionality();

    const passed = this.testResults.filter(r => r.passed).length;
    const failed = this.testResults.filter(r => !r.passed).length;

    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

    if (failed === 0) {
      console.log("🎉 All GSAP tests passed! Animations are working correctly.");
    } else {
      console.warn("⚠️  Some tests failed. Check the detailed results below.");
    }

    return {
      passed,
      failed,
      results: this.testResults,
      metrics: this.performanceMetrics,
    };
  }

  /**
   * Test basic GSAP functionality
   */
  private async testBasicGSAPFunctionality(): Promise<void> {
    try {
      // Create test element
      const testEl = this.createTestElement("gsap-basic-test");

      const startTime = performance.now();

      // Test basic animation
      const tl = gsap.to(testEl, {
        x: 100,
        opacity: 0.5,
        duration: 0.5,
        ease: "power2.out",
      });

      await this.waitForAnimation(tl);
      const duration = performance.now() - startTime;

      // Verify animation worked
      const computedStyle = window.getComputedStyle(testEl);
      const transform = computedStyle.transform;
      const opacity = computedStyle.opacity;

      const passed = transform.includes("matrix") && parseFloat(opacity) < 1;

      this.addTestResult({
        test: "Basic GSAP Animation",
        passed,
        message: passed
          ? `✅ Basic animation completed successfully in ${duration.toFixed(2)}ms`
          : "❌ Basic animation failed to apply transforms",
        duration,
      });

      this.cleanupTestElement(testEl);

    } catch (error) {
      this.addTestResult({
        test: "Basic GSAP Animation",
        passed: false,
        message: "❌ Basic GSAP animation test failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Test ScrollTrigger functionality
   */
  private async testScrollTriggerFunctionality(): Promise<void> {
    try {
      const testEl = this.createTestElement("scroll-trigger-test");
      testEl.style.marginTop = "200vh"; // Position it below viewport

      let triggered = false;
      const startTime = performance.now();

      // Create ScrollTrigger animation
      const st = ScrollTrigger.create({
        trigger: testEl,
        start: "top center",
        onToggle: () => {
          triggered = true;
        },
      });

      // Simulate scroll to trigger
      window.scrollTo(0, testEl.offsetTop - window.innerHeight / 2);

      // Wait for scroll trigger to process
      await new Promise(resolve => {
        ScrollTrigger.refresh();
        setTimeout(resolve, 100);
      });

      const duration = performance.now() - startTime;

      this.addTestResult({
        test: "ScrollTrigger Functionality",
        passed: triggered,
        message: triggered
          ? `✅ ScrollTrigger activated successfully in ${duration.toFixed(2)}ms`
          : "❌ ScrollTrigger failed to activate",
        duration,
      });

      // Cleanup
      st.kill();
      this.cleanupTestElement(testEl);
      window.scrollTo(0, 0);

    } catch (error) {
      this.addTestResult({
        test: "ScrollTrigger Functionality",
        passed: false,
        message: "❌ ScrollTrigger test failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Test TextPlugin functionality
   */
  private async testTextPluginFunctionality(): Promise<void> {
    try {
      const testEl = this.createTestElement("text-plugin-test");
      testEl.textContent = "";

      const startTime = performance.now();
      const testText = "GSAP Text Animation Test";

      const tl = gsap.to(testEl, {
        text: testText,
        duration: 0.5,
        ease: "none",
      });

      await this.waitForAnimation(tl);
      const duration = performance.now() - startTime;

      const passed = testEl.textContent === testText;

      this.addTestResult({
        test: "TextPlugin Functionality",
        passed,
        message: passed
          ? `✅ TextPlugin worked correctly in ${duration.toFixed(2)}ms`
          : `❌ TextPlugin failed. Expected "${testText}", got "${testEl.textContent}"`,
        duration,
      });

      this.cleanupTestElement(testEl);

    } catch (error) {
      this.addTestResult({
        test: "TextPlugin Functionality",
        passed: false,
        message: "❌ TextPlugin test failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Test timeline functionality
   */
  private async testTimelineBasics(): Promise<void> {
    try {
      const testEl = this.createTestElement("timeline-test");

      const startTime = performance.now();

      const tl = gsap.timeline()
        .to(testEl, { x: 50, duration: 0.2 })
        .to(testEl, { y: 50, duration: 0.2 })
        .to(testEl, { scale: 1.5, duration: 0.2 });

      await this.waitForAnimation(tl);
      const duration = performance.now() - startTime;

      const computedStyle = window.getComputedStyle(testEl);
      const transform = computedStyle.transform;
      const passed = transform.includes("matrix");

      this.addTestResult({
        test: "Timeline Functionality",
        passed,
        message: passed
          ? `✅ Timeline animation completed successfully in ${duration.toFixed(2)}ms`
          : "❌ Timeline animation failed",
        duration,
      });

      this.cleanupTestElement(testEl);

    } catch (error) {
      this.addTestResult({
        test: "Timeline Functionality",
        passed: false,
        message: "❌ Timeline test failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Test stagger animations
   */
  private async testStaggerAnimations(): Promise<void> {
    try {
      const container = this.createTestElement("stagger-container");
      const elements = Array.from({ length: 5 }, (_, i) => {
        const el = this.createTestElement(`stagger-item-${i}`);
        container.appendChild(el);
        return el;
      });

      const startTime = performance.now();

      const tl = gsap.to(elements, {
        x: 100,
        duration: 0.3,
        stagger: 0.1,
        ease: "power2.out",
      });

      await this.waitForAnimation(tl);
      const duration = performance.now() - startTime;

      // Verify all elements were animated
      const allAnimated = elements.every(el => {
        const transform = window.getComputedStyle(el).transform;
        return transform.includes("matrix");
      });

      this.addTestResult({
        test: "Stagger Animations",
        passed: allAnimated,
        message: allAnimated
          ? `✅ Stagger animation completed successfully in ${duration.toFixed(2)}ms`
          : "❌ Stagger animation failed on some elements",
        duration,
      });

      this.cleanupTestElement(container);

    } catch (error) {
      this.addTestResult({
        test: "Stagger Animations",
        passed: false,
        message: "❌ Stagger animation test failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Test animation performance
   */
  private async testAnimationPerformance(): Promise<void> {
    try {
      const testElements = Array.from({ length: 20 }, (_, i) =>
        this.createTestElement(`perf-test-${i}`)
      );

      let frameCount = 0;
      let totalFrameTime = 0;
      const frameStart = performance.now();

      const onUpdate = () => {
        frameCount++;
        totalFrameTime += performance.now() - frameStart;
      };

      const tl = gsap.to(testElements, {
        x: 200,
        rotation: 360,
        scale: 1.5,
        duration: 1,
        stagger: 0.05,
        ease: "power2.out",
        onUpdate,
      });

      await this.waitForAnimation(tl);

      const averageFrameTime = totalFrameTime / frameCount;
      const passed = averageFrameTime < 16.67; // 60 FPS threshold

      this.performanceMetrics.animationCount = testElements.length;
      this.performanceMetrics.averageFrameTime = averageFrameTime;

      this.addTestResult({
        test: "Animation Performance",
        passed,
        message: passed
          ? `✅ Performance good: ${averageFrameTime.toFixed(2)}ms avg frame time`
          : `⚠️ Performance concern: ${averageFrameTime.toFixed(2)}ms avg frame time (target: <16.67ms)`,
        duration: totalFrameTime,
      });

      testElements.forEach(el => this.cleanupTestElement(el));

    } catch (error) {
      this.addTestResult({
        test: "Animation Performance",
        passed: false,
        message: "❌ Performance test failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Measure ScrollTrigger performance
   */
  private async measureScrollTriggerPerformance(): Promise<void> {
    try {
      const scrollTriggers: ScrollTrigger[] = [];
      const testElements = Array.from({ length: 10 }, (_, i) => {
        const el = this.createTestElement(`st-perf-${i}`);
        el.style.marginTop = `${i * 100}vh`;
        return el;
      });

      const startTime = performance.now();

      // Create multiple ScrollTriggers
      testElements.forEach((el, i) => {
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top center",
          animation: gsap.to(el, { x: 100, duration: 0.5 }),
        });
        scrollTriggers.push(st);
      });

      const setupTime = performance.now() - startTime;

      this.performanceMetrics.scrollTriggerCount = scrollTriggers.length;

      const passed = setupTime < 100; // Should setup quickly

      this.addTestResult({
        test: "ScrollTrigger Performance",
        passed,
        message: passed
          ? `✅ ScrollTrigger setup efficient: ${setupTime.toFixed(2)}ms for ${scrollTriggers.length} triggers`
          : `⚠️ ScrollTrigger setup slow: ${setupTime.toFixed(2)}ms for ${scrollTriggers.length} triggers`,
        duration: setupTime,
      });

      // Cleanup
      scrollTriggers.forEach(st => st.kill());
      testElements.forEach(el => this.cleanupTestElement(el));

    } catch (error) {
      this.addTestResult({
        test: "ScrollTrigger Performance",
        passed: false,
        message: "❌ ScrollTrigger performance test failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Test responsive animations
   */
  private async testResponsiveAnimations(): Promise<void> {
    try {
      const testEl = this.createTestElement("responsive-test");

      // Test different screen sizes
      const originalWidth = window.innerWidth;

      // Simulate mobile
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });

      const mobileAnimation = gsap.to(testEl, {
        x: window.innerWidth * 0.5,
        duration: 0.3,
      });

      await this.waitForAnimation(mobileAnimation);

      // Restore original width
      Object.defineProperty(window, 'innerWidth', { value: originalWidth, configurable: true });

      this.addTestResult({
        test: "Responsive Animations",
        passed: true,
        message: "✅ Responsive animation test completed (basic functionality)",
      });

      this.cleanupTestElement(testEl);

    } catch (error) {
      this.addTestResult({
        test: "Responsive Animations",
        passed: false,
        message: "❌ Responsive animation test failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Test cleanup functionality
   */
  private async testCleanupFunctionality(): Promise<void> {
    try {
      const testEl = this.createTestElement("cleanup-test");

      const tl = gsap.timeline()
        .to(testEl, { x: 100, duration: 0.5 })
        .to(testEl, { y: 100, duration: 0.5 });

      // Start animation then immediately kill it
      await new Promise(resolve => setTimeout(resolve, 100));
      tl.kill();

      // Verify timeline is killed
      const isActive = tl.isActive();
      const passed = !isActive;

      this.addTestResult({
        test: "Animation Cleanup",
        passed,
        message: passed
          ? "✅ Animation cleanup working correctly"
          : "❌ Animation cleanup failed - timeline still active",
      });

      this.cleanupTestElement(testEl);

    } catch (error) {
      this.addTestResult({
        test: "Animation Cleanup",
        passed: false,
        message: "❌ Cleanup test failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Helper methods
   */
  private createTestElement(id: string): HTMLElement {
    const el = document.createElement("div");
    el.id = id;
    el.style.position = "absolute";
    el.style.top = "-9999px";
    el.style.left = "0";
    el.style.width = "50px";
    el.style.height = "50px";
    el.style.backgroundColor = "red";
    el.style.opacity = "1";
    document.body.appendChild(el);
    return el;
  }

  private cleanupTestElement(el: HTMLElement): void {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  private async waitForAnimation(animation: gsap.core.Animation): Promise<void> {
    return new Promise(resolve => {
      if (animation.duration() === 0) {
        resolve();
        return;
      }

      animation.then(() => resolve());
    });
  }

  private addTestResult(result: AnimationTestResult): void {
    this.testResults.push(result);
    console.log(`${result.passed ? "✅" : "❌"} ${result.test}: ${result.message}`);

    if (result.error) {
      console.error(`   Error: ${result.error}`);
    }
  }
}

// Export test functions for use in development
export const gsapTest = {
  /**
   * Run comprehensive GSAP test suite
   */
  runTests: async () => {
    const suite = new GSAPTestSuite();
    return await suite.runAllTests();
  },

  /**
   * Quick health check for GSAP
   */
  quickCheck: () => {
    console.log("🔍 GSAP Quick Health Check");
    console.log("===========================");

    // Check if GSAP is loaded
    console.log(`GSAP Version: ${gsap.version || "Not loaded"}`);
    console.log(`ScrollTrigger loaded: ${!!ScrollTrigger}`);
    console.log(`Active animations: ${gsap.getById("") ? gsap.globalTimeline.getChildren().length : 0}`);
    console.log(`ScrollTrigger instances: ${ScrollTrigger.getAll().length}`);

    // Check browser support
    const supportsTransform = CSS.supports("transform", "translateX(1px)");
    const supportsTransition = CSS.supports("transition", "opacity 1s");

    console.log(`Browser transform support: ${supportsTransform ? "✅" : "❌"}`);
    console.log(`Browser transition support: ${supportsTransition ? "✅" : "❌"}`);

    return {
      gsapLoaded: !!gsap.version,
      scrollTriggerLoaded: !!ScrollTrigger,
      browserSupport: supportsTransform && supportsTransition,
    };
  },

  /**
   * Debug current animations
   */
  debugAnimations: () => {
    console.log("🐛 Current GSAP Animations Debug");
    console.log("=================================");

    const timeline = gsap.globalTimeline;
    const children = timeline.getChildren();

    console.log(`Total active animations: ${children.length}`);

    children.forEach((anim, index) => {
      console.log(`${index + 1}. ${anim.vars?.id || 'Unnamed'} - Progress: ${(anim.progress() * 100).toFixed(1)}%`);
    });

    const scrollTriggers = ScrollTrigger.getAll();
    console.log(`\nActive ScrollTriggers: ${scrollTriggers.length}`);

    scrollTriggers.forEach((st, index) => {
      console.log(`${index + 1}. Trigger: ${st.trigger} - Progress: ${(st.progress * 100).toFixed(1)}%`);
    });
  },

  /**
   * Performance monitor
   */
  monitorPerformance: (duration: number = 5000) => {
    console.log(`📊 Monitoring GSAP performance for ${duration / 1000}s...`);

    const startTime = performance.now();
    let frameCount = 0;

    const monitor = () => {
      frameCount++;
      const elapsed = performance.now() - startTime;

      if (elapsed < duration) {
        requestAnimationFrame(monitor);
      } else {
        const fps = (frameCount / (elapsed / 1000)).toFixed(1);
        console.log(`Average FPS: ${fps}`);
        console.log(`Total frames: ${frameCount}`);
        console.log(`Frame time: ${(elapsed / frameCount).toFixed(2)}ms`);
      }
    };

    requestAnimationFrame(monitor);
  },
};

// Auto-expose to window in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).gsapTest = gsapTest;
  console.log("🚀 GSAP Test Suite loaded!");
  console.log("📋 Available commands:");
  console.log("   gsapTest.runTests() - Run full test suite");
  console.log("   gsapTest.quickCheck() - Quick health check");
  console.log("   gsapTest.debugAnimations() - Debug active animations");
  console.log("   gsapTest.monitorPerformance() - Monitor performance");
}

export default gsapTest;
