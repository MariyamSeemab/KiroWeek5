// Routing Optimizer - Advanced Path Optimization for Dabbawala Network
// Implements intelligent routing algorithms with Mumbai-specific optimizations

import { RoutingPath, StationInfo, ParsedMarker } from '../models';
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
  timeReduction: number; // minutes saved
  reliabilityImprovement: number; // percentage points
  complexityReduction: number; // complexity score reduction
  costEfficiency: number; // cost reduction percentage
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

export class RoutingOptimizer {
  private protocolKB: ProtocolKnowledgeBase;
  private reliabilityEngine: ReliabilityMetricsEngine;
  private latencyEngine: NetworkLatencyEngine;
  private optimizationStrategies: OptimizationStrategy[] = [];

  constructor(
    protocolKB: ProtocolKnowledgeBase,
    reliabilityEngine: ReliabilityMetricsEngine,
    latencyEngine: NetworkLatencyEngine
  ) {
    this.protocolKB = protocolKB;
    this.reliabilityEngine = reliabilityEngine;
    this.latencyEngine = latencyEngine;
    this.initializeOptimizationStrategies();
  }

  private initializeOptimizationStrategies(): void {
    this.optimizationStrategies = [
      {
        name: 'Dadar Bypass Optimization',
        description: 'Avoid Dadar during peak congestion by using alternative hubs',
        weight: 0.8,
        apply: (route, constraints) => this.applyDadarBypassOptimization(route, constraints)
      },
      {
        name: 'Line Transfer Minimization',
        description: 'Reduce cross-line transfers to improve reliability',
        weight: 0.7,
        apply: (route, constraints) => this.applyLineTransferMinimization(route, constraints)
      },
      {
        name: 'Peak Hour Avoidance',
        description: 'Adjust timing to avoid peak hour congestion',
        weight: 0.6,
        apply: (route, constraints) => this.applyPeakHourAvoidance(route, constraints)
      },
      {
        name: 'Monsoon Route Adaptation',
        description: 'Use monsoon-resilient routes during rainy season',
        weight: 0.9,
        apply: (route, constraints) => this.applyMonsoonRouteAdaptation(route, constraints)
      },
      {
        name: 'Express Service Utilization',
        description: 'Leverage express trains for faster delivery',
        weight: 0.5,
        apply: (route, constraints) => this.applyExpressServiceUtilization(route, constraints)
      }
    ];
  }

  optimizeRoute(
    originalRoute: RoutingPath,
    constraints: RouteConstraints = {}
  ): OptimizationResult {
    console.log('🔧 Optimizing routing path...');
    
    let optimizedRoute = { ...originalRoute };
    const alternativeRoutes: RoutingPath[] = [];
    const recommendations: string[] = [];
    
    // Apply optimization strategies
    for (const strategy of this.optimizationStrategies) {
      if (this.shouldApplyStrategy(strategy, originalRoute, constraints)) {
        const strategyResult = strategy.apply(optimizedRoute, constraints);
        
        if (this.isRouteImprovement(optimizedRoute, strategyResult)) {
          optimizedRoute = strategyResult;
          recommendations.push(`Applied ${strategy.name}: ${strategy.description}`);
        } else {
          // Keep as alternative if it's valid but not better
          if (this.isValidRoute(strategyResult)) {
            alternativeRoutes.push(strategyResult);
          }
        }
      }
    }
    
    // Generate additional alternatives using different approaches
    alternativeRoutes.push(...this.generateAlternativeRoutes(originalRoute, constraints));
    
    // Calculate optimization gains
    const optimizationGains = this.calculateOptimizationGains(originalRoute, optimizedRoute);
    
    console.log(`✅ Route optimization completed with ${optimizationGains.timeReduction}min time reduction`);
    
    return {
      originalRoute,
      optimizedRoute,
      alternativeRoutes: alternativeRoutes.slice(0, 3), // Top 3 alternatives
      optimizationGains,
      recommendations
    };
  }

  private shouldApplyStrategy(
    strategy: OptimizationStrategy,
    route: RoutingPath,
    constraints: RouteConstraints
  ): boolean {
    // Strategy-specific conditions
    switch (strategy.name) {
      case 'Dadar Bypass Optimization':
        return this.routeUsesDadar(route) && this.isDadarCongested();
      
      case 'Line Transfer Minimization':
        return this.hasLineTransfers(route);
      
      case 'Peak Hour Avoidance':
        return this.isPeakHour() && !constraints.prioritizeSpeed;
      
      case 'Monsoon Route Adaptation':
        return this.isMonsoonSeason() && this.isOutdoorRoute(route);
      
      case 'Express Service Utilization':
        return constraints.prioritizeSpeed && this.hasExpressServiceAvailable(route);
      
      default:
        return true;
    }
  }

  private applyDadarBypassOptimization(
    route: RoutingPath,
    constraints: RouteConstraints
  ): RoutingPath {
    if (!this.routeUsesDadar(route)) {
      return route;
    }
    
    const optimizedRoute = { ...route };
    
    // Find alternative sorting hubs
    const alternativeHubs = ['Kurla', 'Parel', 'Bandra'];
    const bestHub = this.findBestAlternativeHub(route.destination, alternativeHubs);
    
    if (bestHub) {
      optimizedRoute.sortingHub = bestHub;
      optimizedRoute.sortingTime = this.calculateAlternativeSortingTime(bestHub);
      
      // Recalculate route segments
      optimizedRoute.route = this.recalculateRouteSegments(
        route.origin,
        route.destination,
        bestHub
      );
      
      // Update reliability metrics
      optimizedRoute.reliabilityMetrics = this.reliabilityEngine.calculateReliabilityMetrics(
        optimizedRoute
      );
    }
    
    return optimizedRoute;
  }

  private applyLineTransferMinimization(
    route: RoutingPath,
    constraints: RouteConstraints
  ): RoutingPath {
    const optimizedRoute = { ...route };
    
    // Identify line transfers
    const transfers = this.identifyLineTransfers(route);
    
    if (transfers.length > 0) {
      // Try to find same-line alternatives
      const sameLineRoute = this.findSameLineRoute(route.origin, route.destination);
      
      if (sameLineRoute && this.isRouteImprovement(route, sameLineRoute)) {
        optimizedRoute.route = sameLineRoute.route;
        optimizedRoute.reliabilityMetrics = this.reliabilityEngine.calculateReliabilityMetrics(
          optimizedRoute
        );
      }
    }
    
    return optimizedRoute;
  }

  private applyPeakHourAvoidance(
    route: RoutingPath,
    constraints: RouteConstraints
  ): RoutingPath {
    const optimizedRoute = { ...route };
    
    if (this.isPeakHour()) {
      // Adjust collection time to avoid peak hours
      const adjustedCollectionTime = this.calculateOffPeakCollectionTime();
      const adjustedSortingTime = this.calculateAdjustedSortingTime(adjustedCollectionTime);
      const adjustedDeliveryTime = this.calculateAdjustedDeliveryTime(adjustedSortingTime);
      
      optimizedRoute.collectionTime = adjustedCollectionTime;
      optimizedRoute.sortingTime = adjustedSortingTime;
      optimizedRoute.deliveryTime = adjustedDeliveryTime;
      
      // Update route segments with adjusted timing
      optimizedRoute.route = optimizedRoute.route.map(segment => ({
        ...segment,
        duration: segment.duration * 0.8 // 20% faster outside peak hours
      }));
    }
    
    return optimizedRoute;
  }

  private applyMonsoonRouteAdaptation(
    route: RoutingPath,
    constraints: RouteConstraints
  ): RoutingPath {
    if (!this.isMonsoonSeason()) {
      return route;
    }
    
    const optimizedRoute = { ...route };
    
    // Use covered/elevated routes during monsoon
    const monsoonSafeRoute = this.findMonsoonSafeRoute(route.origin, route.destination);
    
    if (monsoonSafeRoute) {
      optimizedRoute.route = monsoonSafeRoute.route;
      optimizedRoute.reliabilityMetrics = this.reliabilityEngine.calculateReliabilityMetrics(
        optimizedRoute
      );
      
      // Add monsoon-specific reliability factors
      if (optimizedRoute.reliabilityMetrics) {
        optimizedRoute.reliabilityMetrics.systemConfidence.degradationFactors.push({
          type: 'Monsoon Adaptation',
          impact: -1.0, // Improved reliability
          isActive: true,
          description: 'Route adapted for monsoon conditions'
        });
      }
    }
    
    return optimizedRoute;
  }

  private applyExpressServiceUtilization(
    route: RoutingPath,
    constraints: RouteConstraints
  ): RoutingPath {
    const optimizedRoute = { ...route };
    
    // Check for express service availability
    const expressSegments = this.findExpressServiceSegments(route);
    
    if (expressSegments.length > 0) {
      optimizedRoute.route = optimizedRoute.route.map(segment => {
        const expressSegment = expressSegments.find(es => 
          es.from === segment.from && es.to === segment.to
        );
        
        if (expressSegment) {
          return {
            ...segment,
            mode: 'Express Railway',
            duration: Math.round(segment.duration * 0.7), // 30% faster
            distance: segment.distance
          };
        }
        
        return segment;
      });
      
      // Recalculate delivery time
      const totalDuration = optimizedRoute.route.reduce((sum, seg) => sum + seg.duration, 0);
      optimizedRoute.deliveryTime = this.calculateDeliveryTimeFromDuration(totalDuration);
    }
    
    return optimizedRoute;
  }

  private generateAlternativeRoutes(
    originalRoute: RoutingPath,
    constraints: RouteConstraints
  ): RoutingPath[] {
    const alternatives: RoutingPath[] = [];
    
    // Generate route via different lines
    const lines: ('Western' | 'Central' | 'Harbour')[] = ['Western', 'Central', 'Harbour'];
    
    for (const line of lines) {
      if (constraints.preferredLines && !constraints.preferredLines.includes(line)) {
        continue;
      }
      
      const lineRoute = this.generateRouteViaLine(originalRoute, line);
      if (lineRoute && this.isValidRoute(lineRoute)) {
        alternatives.push(lineRoute);
      }
    }
    
    // Generate time-optimized route
    if (constraints.prioritizeSpeed) {
      const speedRoute = this.generateSpeedOptimizedRoute(originalRoute);
      if (speedRoute && this.isValidRoute(speedRoute)) {
        alternatives.push(speedRoute);
      }
    }
    
    // Generate reliability-optimized route
    if (constraints.prioritizeReliability) {
      const reliabilityRoute = this.generateReliabilityOptimizedRoute(originalRoute);
      if (reliabilityRoute && this.isValidRoute(reliabilityRoute)) {
        alternatives.push(reliabilityRoute);
      }
    }
    
    return alternatives;
  }

  private calculateOptimizationGains(
    original: RoutingPath,
    optimized: RoutingPath
  ): OptimizationGains {
    const originalDuration = original.route.reduce((sum, seg) => sum + seg.duration, 0);
    const optimizedDuration = optimized.route.reduce((sum, seg) => sum + seg.duration, 0);
    
    const timeReduction = originalDuration - optimizedDuration;
    
    const originalReliability = original.reliabilityMetrics?.systemConfidence.finalConfidence || 0;
    const optimizedReliability = optimized.reliabilityMetrics?.systemConfidence.finalConfidence || 0;
    const reliabilityImprovement = optimizedReliability - originalReliability;
    
    const originalComplexity = original.complexityScore?.score || 0;
    const optimizedComplexity = optimized.complexityScore?.score || 0;
    const complexityReduction = originalComplexity - optimizedComplexity;
    
    // Estimate cost efficiency (simplified calculation)
    const costEfficiency = (timeReduction / originalDuration) * 100;
    
    return {
      timeReduction,
      reliabilityImprovement,
      complexityReduction,
      costEfficiency
    };
  }

  // Helper methods
  private routeUsesDadar(route: RoutingPath): boolean {
    return route.sortingHub === 'Dadar' || 
           route.route.some(segment => segment.from === 'DDR' || segment.to === 'DDR');
  }

  private isDadarCongested(): boolean {
    const status = this.latencyEngine.calculateHandoffRisk('DDR');
    return status.riskLevel === 'HIGH' || status.riskLevel === 'CRITICAL';
  }

  private hasLineTransfers(route: RoutingPath): boolean {
    return route.route.some(segment => segment.mode.includes('Transfer'));
  }

  private isPeakHour(): boolean {
    const hour = new Date().getHours();
    return (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);
  }

  private isMonsoonSeason(): boolean {
    const month = new Date().getMonth();
    return month >= 5 && month <= 9; // June to October
  }

  private isOutdoorRoute(route: RoutingPath): boolean {
    return route.route.some(segment => segment.mode === 'Walking' || segment.mode === 'Auto-rickshaw');
  }

  private hasExpressServiceAvailable(route: RoutingPath): boolean {
    // Simplified check - express services available on major routes
    const majorStations = ['DDR', 'BKC', 'AND', 'CST', 'KUR'];
    return route.route.some(segment => 
      majorStations.includes(segment.from) && majorStations.includes(segment.to)
    );
  }

  private isRouteImprovement(original: RoutingPath, candidate: RoutingPath): boolean {
    const originalScore = this.calculateRouteScore(original);
    const candidateScore = this.calculateRouteScore(candidate);
    return candidateScore > originalScore;
  }

  private calculateRouteScore(route: RoutingPath): number {
    const duration = route.route.reduce((sum, seg) => sum + seg.duration, 0);
    const reliability = route.reliabilityMetrics?.systemConfidence.finalConfidence || 0;
    const complexity = route.complexityScore?.score || 0;
    
    // Weighted score: reliability (40%), speed (35%), simplicity (25%)
    return (reliability * 0.4) + ((100 - duration) * 0.35) + ((1 - complexity) * 25);
  }

  private isValidRoute(route: RoutingPath): boolean {
    return route.route.length > 0 && 
           route.destination && 
           route.origin && 
           route.deliveryTime !== '';
  }

  // Placeholder implementations for complex routing logic
  private findBestAlternativeHub(destination: any, hubs: string[]): string | null {
    // Simplified implementation
    return hubs[0];
  }

  private calculateAlternativeSortingTime(hub: string): string {
    // Simplified implementation
    return hub === 'Kurla' ? '11:00 AM' : '10:45 AM';
  }

  private recalculateRouteSegments(origin: any, destination: any, hub: string): any[] {
    // Simplified implementation
    return [
      { from: origin.code, to: hub, mode: 'Railway', duration: 20, distance: 12 },
      { from: hub, to: destination.code, mode: 'Railway', duration: 15, distance: 8 }
    ];
  }

  private identifyLineTransfers(route: RoutingPath): any[] {
    return route.route.filter(segment => segment.mode.includes('Transfer'));
  }

  private findSameLineRoute(origin: any, destination: any): RoutingPath | null {
    // Simplified implementation
    return null;
  }

  private calculateOffPeakCollectionTime(): string {
    return '9:45 AM'; // Avoid 10:15-11:30 peak
  }

  private calculateAdjustedSortingTime(collectionTime: string): string {
    return '11:00 AM';
  }

  private calculateAdjustedDeliveryTime(sortingTime: string): string {
    return '12:15 PM';
  }

  private findMonsoonSafeRoute(origin: any, destination: any): RoutingPath | null {
    // Simplified implementation
    return null;
  }

  private findExpressServiceSegments(route: RoutingPath): any[] {
    return route.route.filter(segment => 
      ['DDR', 'BKC', 'AND', 'CST'].includes(segment.from) &&
      ['DDR', 'BKC', 'AND', 'CST'].includes(segment.to)
    );
  }

  private calculateDeliveryTimeFromDuration(duration: number): string {
    const baseTime = new Date();
    baseTime.setHours(10, 30, 0); // Start from sorting time
    baseTime.setMinutes(baseTime.getMinutes() + duration);
    
    return baseTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  private generateRouteViaLine(original: RoutingPath, line: string): RoutingPath | null {
    // Simplified implementation
    return null;
  }

  private generateSpeedOptimizedRoute(original: RoutingPath): RoutingPath | null {
    // Simplified implementation
    return null;
  }

  private generateReliabilityOptimizedRoute(original: RoutingPath): RoutingPath | null {
    // Simplified implementation
    return null;
  }
}