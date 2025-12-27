import { ProtocolKnowledgeBase } from './ProtocolKnowledgeBase';
import { SystemMonitor } from './SystemMonitor';
export interface AnalyticsReport {
    period: {
        start: string;
        end: string;
        duration: string;
    };
    summary: AnalyticsSummary;
    performance: PerformanceAnalytics;
    routing: RoutingAnalytics;
    reliability: ReliabilityAnalytics;
    predictions: PredictiveAnalytics;
    insights: Insight[];
    recommendations: Recommendation[];
}
export interface AnalyticsSummary {
    totalRequests: number;
    successfulDeliveries: number;
    averageDeliveryTime: number;
    systemUptime: number;
    topDestinations: DestinationStats[];
    busyHours: HourlyStats[];
}
export interface PerformanceAnalytics {
    throughput: {
        requestsPerHour: number;
        peakThroughput: number;
        averageResponseTime: number;
    };
    efficiency: {
        successRate: number;
        errorRate: number;
        optimizationRate: number;
    };
    trends: {
        throughputTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
        reliabilityTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
        performanceTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    };
}
export interface RoutingAnalytics {
    popularRoutes: RouteStats[];
    complexityDistribution: ComplexityStats;
    lineUtilization: LineUtilizationStats;
    hubEfficiency: HubEfficiencyStats[];
    optimizationImpact: OptimizationImpactStats;
}
export interface ReliabilityAnalytics {
    overallReliability: number;
    reliabilityByLine: {
        [line: string]: number;
    };
    reliabilityByTime: HourlyReliabilityStats[];
    degradationFactors: DegradationFactorStats[];
    thresholdBreaches: ThresholdBreachStats[];
}
export interface PredictiveAnalytics {
    demandForecast: DemandForecast[];
    reliabilityPrediction: ReliabilityPrediction;
    capacityPlanning: CapacityPlanningStats;
    maintenanceAlerts: MaintenanceAlert[];
}
export interface Insight {
    type: 'PERFORMANCE' | 'RELIABILITY' | 'EFFICIENCY' | 'TREND';
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    title: string;
    description: string;
    impact: string;
    confidence: number;
}
export interface Recommendation {
    category: 'OPTIMIZATION' | 'INFRASTRUCTURE' | 'PROCESS' | 'MONITORING';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    title: string;
    description: string;
    expectedBenefit: string;
    implementationEffort: 'LOW' | 'MEDIUM' | 'HIGH';
    estimatedImpact: number;
}
export interface DestinationStats {
    stationCode: string;
    stationName: string;
    requestCount: number;
    averageDeliveryTime: number;
    successRate: number;
}
export interface HourlyStats {
    hour: number;
    requestCount: number;
    averageResponseTime: number;
    successRate: number;
}
export interface RouteStats {
    routeSignature: string;
    frequency: number;
    averageReliability: number;
    averageDuration: number;
    optimizationPotential: number;
}
export interface ComplexityStats {
    low: number;
    medium: number;
    high: number;
    averageScore: number;
}
export interface LineUtilizationStats {
    western: number;
    central: number;
    harbour: number;
}
export interface HubEfficiencyStats {
    hubName: string;
    throughput: number;
    averageProcessingTime: number;
    reliabilityScore: number;
    utilizationRate: number;
}
export interface OptimizationImpactStats {
    routesOptimized: number;
    averageTimeReduction: number;
    averageReliabilityImprovement: number;
    totalCostSavings: number;
}
export interface HourlyReliabilityStats {
    hour: number;
    reliability: number;
    degradationFactors: string[];
}
export interface DegradationFactorStats {
    factor: string;
    frequency: number;
    averageImpact: number;
    trend: 'INCREASING' | 'STABLE' | 'DECREASING';
}
export interface ThresholdBreachStats {
    threshold: string;
    breachCount: number;
    averageDuration: number;
    impact: string;
}
export interface DemandForecast {
    timeSlot: string;
    predictedDemand: number;
    confidence: number;
    factors: string[];
}
export interface ReliabilityPrediction {
    nextHour: number;
    next4Hours: number;
    next24Hours: number;
    factors: string[];
}
export interface CapacityPlanningStats {
    currentCapacity: number;
    predictedDemand: number;
    capacityUtilization: number;
    recommendedCapacity: number;
}
export interface MaintenanceAlert {
    component: string;
    predictedFailureTime: string;
    confidence: number;
    recommendedAction: string;
}
export declare class AnalyticsEngine {
    private protocolKB;
    private systemMonitor;
    private dataHistory;
    private insights;
    private recommendations;
    constructor(protocolKB: ProtocolKnowledgeBase, systemMonitor: SystemMonitor);
    private startDataCollection;
    private collectDataPoint;
    generateReport(periodHours?: number): AnalyticsReport;
    private generateSummary;
    private generatePerformanceAnalytics;
    private generateRoutingAnalytics;
    private generateReliabilityAnalytics;
    private generatePredictiveAnalytics;
    private generateInsights;
    private updateRecommendations;
    private generateHourlyStats;
    private generateTopDestinations;
    private generatePopularRoutes;
    private generateHourlyReliabilityStats;
    private generateDemandForecast;
    private calculateTrend;
    getInsights(): Insight[];
    getRecommendations(): Recommendation[];
    exportAnalyticsData(): string;
}
//# sourceMappingURL=AnalyticsEngine.d.ts.map