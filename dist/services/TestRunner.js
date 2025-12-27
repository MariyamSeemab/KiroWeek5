"use strict";
// Test Runner Service - Comprehensive System Testing
// Provides automated testing capabilities for the Bambaiyya Binary system
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRunner = void 0;
const TestDataGenerator_1 = require("../test-data/TestDataGenerator");
class TestRunner {
    constructor(networkRouter, protocolKB, bambaiyyaDebugger, reliabilityEngine) {
        this.networkRouter = networkRouter;
        this.protocolKB = protocolKB;
        this.bambaiyyaDebugger = bambaiyyaDebugger;
        this.reliabilityEngine = reliabilityEngine;
        this.testDataGenerator = new TestDataGenerator_1.TestDataGenerator();
    }
    async runTestSuite(suite) {
        console.log(`🧪 Running test suite: ${suite.name}`);
        const startTime = Date.now();
        const results = [];
        // Setup
        if (suite.setup) {
            await suite.setup();
        }
        // Run tests
        for (const testCase of suite.tests) {
            try {
                const result = await this.runTestCase(testCase);
                results.push(result);
                if (result.passed) {
                    console.log(`  ✅ ${testCase.name} (${result.duration}ms)`);
                }
                else {
                    console.log(`  ❌ ${testCase.name}: ${result.message} (${result.duration}ms)`);
                }
            }
            catch (error) {
                results.push({
                    passed: false,
                    message: `Test execution failed: ${error}`,
                    duration: 0,
                    error: error
                });
                console.log(`  💥 ${testCase.name}: Test execution failed`);
            }
        }
        // Teardown
        if (suite.teardown) {
            await suite.teardown();
        }
        const duration = Date.now() - startTime;
        const passedTests = results.filter(r => r.passed).length;
        const failedTests = results.length - passedTests;
        const report = {
            suiteName: suite.name,
            totalTests: results.length,
            passedTests,
            failedTests,
            duration,
            results,
            summary: `${passedTests}/${results.length} tests passed in ${duration}ms`
        };
        console.log(`📊 Test suite completed: ${report.summary}`);
        return report;
    }
    async runTestCase(testCase) {
        const startTime = Date.now();
        try {
            const result = await testCase.test(testCase.input);
            const duration = Date.now() - startTime;
            return {
                ...result,
                duration
            };
        }
        catch (error) {
            const duration = Date.now() - startTime;
            return {
                passed: false,
                message: `Test threw exception: ${error}`,
                duration,
                error: error
            };
        }
    }
    // Predefined test suites
    createBasicParsingTestSuite() {
        return {
            name: 'Basic Parsing Tests',
            tests: [
                {
                    name: 'Valid marker parsing',
                    description: 'Test parsing of valid delivery markers',
                    input: 'Red Triangle - VLP - 4',
                    test: async (input) => {
                        const parsed = this.networkRouter.parseDeliveryMarker(input);
                        return {
                            passed: parsed.isValid,
                            message: parsed.isValid ? 'Marker parsed successfully' : 'Failed to parse valid marker',
                            details: parsed
                        };
                    }
                },
                {
                    name: 'Invalid marker handling',
                    description: 'Test handling of invalid delivery markers',
                    input: 'Invalid Marker Format',
                    test: async (input) => {
                        const parsed = this.networkRouter.parseDeliveryMarker(input);
                        return {
                            passed: !parsed.isValid,
                            message: !parsed.isValid ? 'Invalid marker correctly rejected' : 'Invalid marker incorrectly accepted',
                            details: parsed
                        };
                    }
                },
                {
                    name: 'Mumbai slang recognition',
                    description: 'Test Mumbai slang term recognition',
                    input: 'Jhol in the route',
                    test: async (input) => {
                        const result = this.networkRouter.handleMumbaiSlang(input);
                        return {
                            passed: result.slangDetected.length > 0,
                            message: result.slangDetected.length > 0 ? 'Slang detected successfully' : 'Failed to detect slang',
                            details: result
                        };
                    }
                }
            ]
        };
    }
    createReliabilityTestSuite() {
        return {
            name: 'Reliability Metrics Tests',
            tests: [
                {
                    name: 'Complexity score calculation',
                    description: 'Test complexity score calculation accuracy',
                    input: { route: [{ from: 'DDR', to: 'VLP', mode: 'Railway', duration: 25, distance: 15 }] },
                    test: async (input) => {
                        const complexity = this.reliabilityEngine.calculateComplexityScore(input);
                        return {
                            passed: complexity && complexity.score !== undefined,
                            message: complexity ? 'Complexity calculated successfully' : 'Failed to calculate complexity',
                            details: complexity
                        };
                    }
                },
                {
                    name: 'System confidence formatting',
                    description: 'Test system confidence display formatting',
                    input: 99.99987,
                    test: async (input) => {
                        const confidence = this.reliabilityEngine.calculateSystemConfidence(input, []);
                        const hasCorrectFormat = confidence.displayFormat.includes('[') && confidence.displayFormat.includes(']');
                        return {
                            passed: hasCorrectFormat,
                            message: hasCorrectFormat ? 'Confidence formatted correctly' : 'Confidence format incorrect',
                            details: confidence
                        };
                    }
                },
                {
                    name: 'Threshold status determination',
                    description: 'Test reliability threshold status logic',
                    input: 99.95,
                    test: async (input) => {
                        const threshold = this.reliabilityEngine.determineThresholdStatus(input);
                        return {
                            passed: threshold && threshold.status === 'OPTIMAL ROUTE',
                            message: threshold ? `Status: ${threshold.status}` : 'Failed to determine threshold status',
                            details: threshold
                        };
                    }
                }
            ]
        };
    }
    createIntegrationTestSuite() {
        return {
            name: 'Integration Tests',
            tests: [
                {
                    name: 'End-to-end marker processing',
                    description: 'Test complete marker processing pipeline',
                    input: 'Red Triangle - VLP - 4',
                    test: async (input) => {
                        const parsed = this.networkRouter.parseDeliveryMarker(input);
                        if (!parsed.isValid) {
                            return { passed: false, message: 'Parsing failed' };
                        }
                        const route = this.networkRouter.generateRoutingPath(parsed);
                        if (!route.destination || !route.reliabilityMetrics) {
                            return { passed: false, message: 'Route generation incomplete' };
                        }
                        return {
                            passed: true,
                            message: 'End-to-end processing successful',
                            details: { parsed, route }
                        };
                    }
                },
                {
                    name: 'System diagnostics',
                    description: 'Test system health diagnostics',
                    input: null,
                    test: async () => {
                        const report = this.bambaiyyaDebugger.runSystemDiagnostics();
                        return {
                            passed: report.overall !== 'CRITICAL',
                            message: `System health: ${report.overall} (${report.percentage}%)`,
                            details: report
                        };
                    }
                }
            ]
        };
    }
    createPerformanceTestSuite() {
        return {
            name: 'Performance Tests',
            tests: [
                {
                    name: 'Bulk marker processing',
                    description: 'Test processing of multiple markers',
                    input: 100,
                    test: async (count) => {
                        const markers = this.testDataGenerator.generateValidMarkers().slice(0, count);
                        const startTime = Date.now();
                        let successCount = 0;
                        for (const marker of markers) {
                            const markerString = `${marker.color} ${marker.symbol} - ${marker.stationCode} - ${marker.sequence}`;
                            const parsed = this.networkRouter.parseDeliveryMarker(markerString);
                            if (parsed.isValid) {
                                successCount++;
                            }
                        }
                        const duration = Date.now() - startTime;
                        const throughput = (count / duration) * 1000; // markers per second
                        return {
                            passed: successCount >= count * 0.95, // 95% success rate
                            message: `Processed ${successCount}/${count} markers in ${duration}ms (${throughput.toFixed(1)} markers/sec)`,
                            details: { successCount, totalCount: count, duration, throughput }
                        };
                    }
                },
                {
                    name: 'Memory usage stability',
                    description: 'Test memory usage during processing',
                    input: 50,
                    test: async (iterations) => {
                        const initialMemory = process.memoryUsage().heapUsed;
                        for (let i = 0; i < iterations; i++) {
                            const marker = 'Red Triangle - VLP - 4';
                            const parsed = this.networkRouter.parseDeliveryMarker(marker);
                            this.networkRouter.generateRoutingPath(parsed);
                        }
                        // Force garbage collection if available
                        if (global.gc) {
                            global.gc();
                        }
                        const finalMemory = process.memoryUsage().heapUsed;
                        const memoryIncrease = finalMemory - initialMemory;
                        const memoryIncreaseKB = memoryIncrease / 1024;
                        return {
                            passed: memoryIncreaseKB < 1000, // Less than 1MB increase
                            message: `Memory increase: ${memoryIncreaseKB.toFixed(1)}KB after ${iterations} iterations`,
                            details: { initialMemory, finalMemory, memoryIncrease }
                        };
                    }
                }
            ]
        };
    }
    // Run all predefined test suites
    async runAllTests() {
        console.log('🚀 Running comprehensive test suite...');
        const suites = [
            this.createBasicParsingTestSuite(),
            this.createReliabilityTestSuite(),
            this.createIntegrationTestSuite(),
            this.createPerformanceTestSuite()
        ];
        const reports = [];
        for (const suite of suites) {
            const report = await this.runTestSuite(suite);
            reports.push(report);
        }
        // Generate overall summary
        const totalTests = reports.reduce((sum, r) => sum + r.totalTests, 0);
        const totalPassed = reports.reduce((sum, r) => sum + r.passedTests, 0);
        const totalDuration = reports.reduce((sum, r) => sum + r.duration, 0);
        console.log('\n📈 OVERALL TEST SUMMARY');
        console.log(`   Total Tests: ${totalTests}`);
        console.log(`   Passed: ${totalPassed}`);
        console.log(`   Failed: ${totalTests - totalPassed}`);
        console.log(`   Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
        console.log(`   Total Duration: ${totalDuration}ms`);
        return reports;
    }
    // Generate test report
    generateTestReport(reports) {
        let report = '# Bambaiyya Binary System Test Report\n\n';
        report += `Generated: ${new Date().toISOString()}\n\n`;
        for (const testReport of reports) {
            report += `## ${testReport.suiteName}\n\n`;
            report += `- **Total Tests**: ${testReport.totalTests}\n`;
            report += `- **Passed**: ${testReport.passedTests}\n`;
            report += `- **Failed**: ${testReport.failedTests}\n`;
            report += `- **Duration**: ${testReport.duration}ms\n`;
            report += `- **Success Rate**: ${((testReport.passedTests / testReport.totalTests) * 100).toFixed(1)}%\n\n`;
            if (testReport.failedTests > 0) {
                report += '### Failed Tests\n\n';
                for (let i = 0; i < testReport.results.length; i++) {
                    const result = testReport.results[i];
                    if (!result.passed) {
                        report += `- **Test ${i + 1}**: ${result.message}\n`;
                    }
                }
                report += '\n';
            }
        }
        return report;
    }
}
exports.TestRunner = TestRunner;
//# sourceMappingURL=TestRunner.js.map