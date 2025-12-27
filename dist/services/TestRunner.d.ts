import { NetworkRouter } from './NetworkRouter';
import { ProtocolKnowledgeBase } from './ProtocolKnowledgeBase';
import { BambaiyyaDebugger } from './BambaiyyaDebugger';
import { ReliabilityMetricsEngine } from './ReliabilityMetricsEngine';
export interface TestSuite {
    name: string;
    tests: TestCase[];
    setup?: () => Promise<void>;
    teardown?: () => Promise<void>;
}
export interface TestCase {
    name: string;
    description: string;
    input: any;
    expectedOutput?: any;
    test: (input: any) => Promise<TestResult>;
}
export interface TestResult {
    passed: boolean;
    message: string;
    duration: number;
    details?: any;
    error?: Error;
}
export interface TestReport {
    suiteName: string;
    totalTests: number;
    passedTests: number;
    failedTests: number;
    duration: number;
    results: TestResult[];
    summary: string;
}
export declare class TestRunner {
    private networkRouter;
    private protocolKB;
    private bambaiyyaDebugger;
    private reliabilityEngine;
    private testDataGenerator;
    constructor(networkRouter: NetworkRouter, protocolKB: ProtocolKnowledgeBase, bambaiyyaDebugger: BambaiyyaDebugger, reliabilityEngine: ReliabilityMetricsEngine);
    runTestSuite(suite: TestSuite): Promise<TestReport>;
    private runTestCase;
    createBasicParsingTestSuite(): TestSuite;
    createReliabilityTestSuite(): TestSuite;
    createIntegrationTestSuite(): TestSuite;
    createPerformanceTestSuite(): TestSuite;
    runAllTests(): Promise<TestReport[]>;
    generateTestReport(reports: TestReport[]): string;
}
//# sourceMappingURL=TestRunner.d.ts.map