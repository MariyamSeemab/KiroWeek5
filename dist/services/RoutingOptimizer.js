"use strict";
// Routing Optimizer - Advanced Path Optimization for Dabbawala Network
// Implements intelligent routing algorithms with Mumbai-specific optimizations
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingOptimizer = void 0;
class RoutingOptimizer {
    constructor(protocolKB, reliabilityEngine, latencyEngine) {
        this.optimizationStrategies = [];
        this.protocolKB = protocolKB;
        this.reliabilityEngine = reliabilityEngine;
        this.latencyEngine = latencyEngine;
        this.initializeOptimizationStrategies();
    }
    initializeOptimizationStrategies() {
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
    optimizeRoute(originalRoute, constraints = {}) {
        console.log('🔧 Optimizing routing path...');
        let optimizedRoute = { ...originalRoute };
        const alternativeRoutes = [];
        const recommendations = [];
        // Apply optimization strategies
        for (const strategy of this.optimizationStrategies) {
            if (this.shouldApplyStrategy(strategy, originalRoute, constraints)) {
                const strategyResult = strategy.apply(optimizedRoute, constraints);
                if (this.isRouteImprovement(optimizedRoute, strategyResult)) {
                    optimizedRoute = strategyResult;
                    recommendations.push(`Applied ${strategy.name}: ${strategy.description}`);
                }
                else {
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
    shouldApplyStrategy(strategy, route, constraints) {
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
    applyDadarBypassOptimization(route, constraints) {
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
            optimizedRoute.route = this.recalculateRouteSegments(route.origin, route.destination, bestHub);
            // Update reliability metrics
            optimizedRoute.reliabilityMetrics = this.reliabilityEngine.calculateReliabilityMetrics(optimizedRoute);
        }
        return optimizedRoute;
    }
    applyLineTransferMinimization(route, constraints) {
        const optimizedRoute = { ...route };
        // Identify line transfers
        const transfers = this.identifyLineTransfers(route);
        if (transfers.length > 0) {
            // Try to find same-line alternatives
            const sameLineRoute = this.findSameLineRoute(route.origin, route.destination);
            if (sameLineRoute && this.isRouteImprovement(route, sameLineRoute)) {
                optimizedRoute.route = sameLineRoute.route;
                optimizedRoute.reliabilityMetrics = this.reliabilityEngine.calculateReliabilityMetrics(optimizedRoute);
            }
        }
        return optimizedRoute;
    }
    applyPeakHourAvoidance(route, constraints) {
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
    applyMonsoonRouteAdaptation(route, constraints) {
        if (!this.isMonsoonSeason()) {
            return route;
        }
        const optimizedRoute = { ...route };
        // Use covered/elevated routes during monsoon
        const monsoonSafeRoute = this.findMonsoonSafeRoute(route.origin, route.destination);
        if (monsoonSafeRoute) {
            optimizedRoute.route = monsoonSafeRoute.route;
            optimizedRoute.reliabilityMetrics = this.reliabilityEngine.calculateReliabilityMetrics(optimizedRoute);
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
    applyExpressServiceUtilization(route, constraints) {
        const optimizedRoute = { ...route };
        // Check for express service availability
        const expressSegments = this.findExpressServiceSegments(route);
        if (expressSegments.length > 0) {
            optimizedRoute.route = optimizedRoute.route.map(segment => {
                const expressSegment = expressSegments.find(es => es.from === segment.from && es.to === segment.to);
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
    generateAlternativeRoutes(originalRoute, constraints) {
        const alternatives = [];
        // Generate route via different lines
        const lines = ['Western', 'Central', 'Harbour'];
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
    calculateOptimizationGains(original, optimized) {
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
    routeUsesDadar(route) {
        return route.sortingHub === 'Dadar' ||
            route.route.some(segment => segment.from === 'DDR' || segment.to === 'DDR');
    }
    isDadarCongested() {
        const status = this.latencyEngine.calculateHandoffRisk('DDR');
        return status.riskLevel === 'HIGH' || status.riskLevel === 'CRITICAL';
    }
    hasLineTransfers(route) {
        return route.route.some(segment => segment.mode.includes('Transfer'));
    }
    isPeakHour() {
        const hour = new Date().getHours();
        return (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);
    }
    isMonsoonSeason() {
        const month = new Date().getMonth();
        return month >= 5 && month <= 9; // June to October
    }
    isOutdoorRoute(route) {
        return route.route.some(segment => segment.mode === 'Walking' || segment.mode === 'Auto-rickshaw');
    }
    hasExpressServiceAvailable(route) {
        // Simplified check - express services available on major routes
        const majorStations = ['DDR', 'BKC', 'AND', 'CST', 'KUR'];
        return route.route.some(segment => majorStations.includes(segment.from) && majorStations.includes(segment.to));
    }
    isRouteImprovement(original, candidate) {
        const originalScore = this.calculateRouteScore(original);
        const candidateScore = this.calculateRouteScore(candidate);
        return candidateScore > originalScore;
    }
    calculateRouteScore(route) {
        const duration = route.route.reduce((sum, seg) => sum + seg.duration, 0);
        const reliability = route.reliabilityMetrics?.systemConfidence.finalConfidence || 0;
        const complexity = route.complexityScore?.score || 0;
        // Weighted score: reliability (40%), speed (35%), simplicity (25%)
        return (reliability * 0.4) + ((100 - duration) * 0.35) + ((1 - complexity) * 25);
    }
    isValidRoute(route) {
        return route.route.length > 0 &&
            route.destination &&
            route.origin &&
            route.deliveryTime !== '';
    }
    // Placeholder implementations for complex routing logic
    findBestAlternativeHub(destination, hubs) {
        // Simplified implementation
        return hubs[0];
    }
    calculateAlternativeSortingTime(hub) {
        // Simplified implementation
        return hub === 'Kurla' ? '11:00 AM' : '10:45 AM';
    }
    recalculateRouteSegments(origin, destination, hub) {
        // Simplified implementation
        return [
            { from: origin.code, to: hub, mode: 'Railway', duration: 20, distance: 12 },
            { from: hub, to: destination.code, mode: 'Railway', duration: 15, distance: 8 }
        ];
    }
    identifyLineTransfers(route) {
        return route.route.filter(segment => segment.mode.includes('Transfer'));
    }
    findSameLineRoute(origin, destination) {
        // Simplified implementation
        return null;
    }
    calculateOffPeakCollectionTime() {
        return '9:45 AM'; // Avoid 10:15-11:30 peak
    }
    calculateAdjustedSortingTime(collectionTime) {
        return '11:00 AM';
    }
    calculateAdjustedDeliveryTime(sortingTime) {
        return '12:15 PM';
    }
    findMonsoonSafeRoute(origin, destination) {
        // Simplified implementation
        return null;
    }
    findExpressServiceSegments(route) {
        return route.route.filter(segment => ['DDR', 'BKC', 'AND', 'CST'].includes(segment.from) &&
            ['DDR', 'BKC', 'AND', 'CST'].includes(segment.to));
    }
    calculateDeliveryTimeFromDuration(duration) {
        const baseTime = new Date();
        baseTime.setHours(10, 30, 0); // Start from sorting time
        baseTime.setMinutes(baseTime.getMinutes() + duration);
        return baseTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
    generateRouteViaLine(original, line) {
        // Simplified implementation
        return null;
    }
    generateSpeedOptimizedRoute(original) {
        // Simplified implementation
        return null;
    }
    generateReliabilityOptimizedRoute(original) {
        // Simplified implementation
        return null;
    }
}
exports.RoutingOptimizer = RoutingOptimizer;
//# sourceMappingURL=RoutingOptimizer.js.map