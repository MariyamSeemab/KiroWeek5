import { RoutingPath } from '../models';
import { ProtocolKnowledgeBase } from './ProtocolKnowledgeBase';
import { ReliabilityMetricsEngine } from './ReliabilityMetricsEngine';
import { NetworkLatencyEngine } from './NetworkLatencyEngine';
export interface OptimizationResult {
    originalRoute: RoutingPath;
    optimizedRoute: RoutingPath;
    alternativeRoutes: RoutingPath[];
    optimizationGains: OptimizationGains;
    recommendations: string[];
}
export interface OptimizationGains {
    timeReduction: number;
    reliabilityImprovement: number;
    complexityReduction: number;
    costEfficiency: number;
}
export interface RouteConstraints {
    maxDeliveryTime?: string;
    minReliability?: number;
    avoidStations?: string[];
    preferredLines?: ('Western' | 'Central' | 'Harbour')[];
    prioritizeSpeed?: boolean;
    prioritizeReliability?: boolean;
}
export interface OptimizationStrategy {
    name: string;
    description: string;
    weight: number;
    apply: (route: RoutingPath, constraints: RouteConstraints) => RoutingPath;
}
export declare class RoutingOptimizer {
    private protocolKB;
    private reliabilityEngine;
    private latencyEngine;
    private optimizationStrategies;
    constructor(protocolKB: ProtocolKnowledgeBase, reliabilityEngine: ReliabilityMetricsEngine, latencyEngine: NetworkLatencyEngine);
    private initializeOptimizationStrategies;
    optimizeRoute(originalRoute: RoutingPath, constraints?: RouteConstraints): OptimizationResult;
    private shouldApplyStrategy;
    private applyDadarBypassOptimization;
    private applyLineTransferMinimization;
    private applyPeakHourAvoidance;
    private applyMonsoonRouteAdaptation;
    private applyExpressServiceUtilization;
    private generateAlternativeRoutes;
    private calculateOptimizationGains;
    private routeUsesDadar;
    private isDadarCongested;
    private hasLineTransfers;
    private isPeakHour;
    private isMonsoonSeason;
    private isOutdoorRoute;
    private hasExpressServiceAvailable;
    private isRouteImprovement;
    private calculateRouteScore;
    private isValidRoute;
    private findBestAlternativeHub;
    private calculateAlternativeSortingTime;
    private recalculateRouteSegments;
    private identifyLineTransfers;
    private findSameLineRoute;
    private calculateOffPeakCollectionTime;
    private calculateAdjustedSortingTime;
    private calculateAdjustedDeliveryTime;
    private findMonsoonSafeRoute;
    private findExpressServiceSegments;
    private calculateDeliveryTimeFromDuration;
    private generateRouteViaLine;
    private generateSpeedOptimizedRoute;
    private generateReliabilityOptimizedRoute;
}
//# sourceMappingURL=RoutingOptimizer.d.ts.map