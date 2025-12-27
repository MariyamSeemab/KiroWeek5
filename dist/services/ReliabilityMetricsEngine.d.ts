import { RoutingPath, ComplexityScore, SystemConfidence, EnvironmentalFactors, ReliabilityMetrics, ThresholdStatus, AlternateRoute } from '../models';
export declare class ReliabilityMetricsEngine {
    private readonly BASELINE_ACCURACY;
    private readonly HOP_WEIGHTS;
    constructor();
    calculateComplexityScore(route: RoutingPath): ComplexityScore;
    private detectNetworkHops;
    private categorizeComplexity;
    private isWesternToCentralCrossing;
    calculateSystemConfidence(route: RoutingPath, environmental: EnvironmentalFactors): SystemConfidence;
    private isPeakHour;
    private formatConfidenceDisplay;
    determineThresholdStatus(confidence: number): ThresholdStatus;
    suggestAlternateRouting(route: RoutingPath, confidence: number): AlternateRoute[];
    generateReliabilityMetrics(route: RoutingPath, environmental: EnvironmentalFactors): ReliabilityMetrics;
    private createDadarStation;
}
//# sourceMappingURL=ReliabilityMetricsEngine.d.ts.map