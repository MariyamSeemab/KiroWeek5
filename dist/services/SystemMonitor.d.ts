import { EventEmitter } from 'events';
import { NetworkRouter } from './NetworkRouter';
import { ProtocolKnowledgeBase } from './ProtocolKnowledgeBase';
import { BambaiyyaDebugger } from './BambaiyyaDebugger';
import { ReliabilityMetricsEngine } from './ReliabilityMetricsEngine';
export interface SystemMetrics {
    timestamp: string;
    uptime: number;
    performance: PerformanceMetrics;
    health: HealthMetrics;
    operations: OperationMetrics;
    resources: ResourceMetrics;
    alerts: Alert[];
}
export interface PerformanceMetrics {
    requestsPerSecond: number;
    averageResponseTime: number;
    successRate: number;
    errorRate: number;
    throughput: number;
    latency: {
        p50: number;
        p95: number;
        p99: number;
    };
}
export interface HealthMetrics {
    overall: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
    components: {
        protocolKB: ComponentHealth;
        networkRouter: ComponentHealth;
        reliabilityEngine: ComponentHealth;
        debugger: ComponentHealth;
    };
    systemIntegrity: number;
}
export interface ComponentHealth {
    status: 'OPERATIONAL' | 'DEGRADED' | 'FAILED';
    responseTime: number;
    errorCount: number;
    lastError?: string;
    uptime: number;
}
export interface OperationMetrics {
    totalRequests: number;
    successfulParsing: number;
    failedParsing: number;
    routingOperations: number;
    slangProcessing: number;
    reliabilityCalculations: number;
}
export interface ResourceMetrics {
    memory: {
        used: number;
        total: number;
        percentage: number;
    };
    cpu: {
        usage: number;
        loadAverage: number[];
    };
    network: {
        bytesIn: number;
        bytesOut: number;
        connectionsActive: number;
    };
}
export interface Alert {
    id: string;
    type: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
    component: string;
    message: string;
    timestamp: string;
    resolved: boolean;
    severity: number;
}
export declare class SystemMonitor extends EventEmitter {
    private networkRouter;
    private protocolKB;
    private bambaiyyaDebugger;
    private reliabilityEngine;
    private metrics;
    private operationMetrics;
    private performanceHistory;
    private alerts;
    private monitoringInterval?;
    private startTime;
    private requestTimes;
    private activeConnections;
    constructor(networkRouter: NetworkRouter, protocolKB: ProtocolKnowledgeBase, bambaiyyaDebugger: BambaiyyaDebugger, reliabilityEngine: ReliabilityMetricsEngine);
    private initializeMetrics;
    startMonitoring(): void;
    stopMonitoring(): void;
    private updateMetrics;
    private calculatePerformanceMetrics;
    private calculateHealthMetrics;
    private checkComponentHealth;
    private calculateResourceMetrics;
    private getPercentile;
    private checkAlerts;
    private getActiveAlerts;
    recordRequest(responseTime: number): void;
    recordSuccessfulParsing(): void;
    recordFailedParsing(): void;
    recordRoutingOperation(): void;
    recordSlangProcessing(): void;
    recordReliabilityCalculation(): void;
    incrementActiveConnections(): void;
    decrementActiveConnections(): void;
    getCurrentMetrics(): SystemMetrics;
    getPerformanceHistory(): PerformanceMetrics[];
    getAlerts(): Alert[];
    resolveAlert(alertId: string): boolean;
    generateReport(): string;
}
//# sourceMappingURL=SystemMonitor.d.ts.map