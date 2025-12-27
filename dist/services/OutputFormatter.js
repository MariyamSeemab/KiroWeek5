"use strict";
// Standardized Output Formatting for Bambaiyya-Binary Logistics Decoder
// Ensures consistent presentation across all routing outputs
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputFormatter = void 0;
class OutputFormatter {
    constructor() {
        this.VERSION = '1.0.0';
        console.log('📝 Output Formatter initialized');
    }
    formatRoutingPath(route, format = 'terminal') {
        const timestamp = new Date().toISOString();
        if (format === 'json') {
            return {
                header: 'Routing Path (JSON)',
                body: JSON.stringify(route, null, 2),
                footer: `Generated at ${timestamp}`,
                timestamp
            };
        }
        // Terminal format
        const header = '=== ROUTING PATH ===';
        const body = this.formatTerminalRoutingPath(route);
        const footer = `Generated at ${new Date().toLocaleString()}`;
        return {
            header,
            body,
            footer,
            timestamp
        };
    }
    formatValidationErrors(errors, format = 'terminal') {
        const timestamp = new Date().toISOString();
        if (format === 'json') {
            return {
                header: 'Validation Errors (JSON)',
                body: JSON.stringify(errors, null, 2),
                footer: `Generated at ${timestamp}`,
                timestamp
            };
        }
        // Terminal format
        const header = '=== VALIDATION ERRORS ===';
        const body = errors.map(error => `❌ ${error.component.toUpperCase()}: ${error.message}`).join('\n');
        const footer = `${errors.length} error(s) found`;
        return {
            header,
            body,
            footer,
            timestamp
        };
    }
    formatReliabilityMetrics(route, format = 'terminal') {
        const timestamp = new Date().toISOString();
        if (!route.reliabilityMetrics) {
            return {
                header: 'Reliability Metrics',
                body: 'No reliability metrics available',
                footer: `Generated at ${timestamp}`,
                timestamp
            };
        }
        if (format === 'json') {
            return {
                header: 'Reliability Metrics (JSON)',
                body: JSON.stringify(route.reliabilityMetrics, null, 2),
                footer: `Generated at ${timestamp}`,
                timestamp
            };
        }
        // Terminal format
        const header = '=== SIX-SIGMA RELIABILITY METRICS ===';
        const body = this.formatTerminalReliabilityMetrics(route.reliabilityMetrics);
        const footer = `Baseline Accuracy: ${route.reliabilityMetrics.systemConfidence.baselineAccuracy}% (1 error in 16 million)`;
        return {
            header,
            body,
            footer,
            timestamp
        };
    }
    formatTerminalReliabilityMetrics(metrics) {
        const lines = [
            `System Confidence: ${metrics.systemConfidence.displayFormat}`,
            `Hop Count: ${metrics.hopCount}`,
            `Complexity Score: ${metrics.complexityScore.score} (${metrics.complexityScore.rating})`,
            `Status: ${metrics.thresholdStatus.message}`,
            ''
        ];
        // Complexity calculation breakdown
        lines.push('Complexity Calculation:');
        lines.push(`  ${metrics.complexityScore.calculation}`);
        lines.push('');
        // Active degradation factors
        const activeFactors = metrics.systemConfidence.degradationFactors
            .filter((factor) => factor.isActive);
        if (activeFactors.length > 0) {
            lines.push('Active Degradation Factors:');
            activeFactors.forEach((factor) => {
                lines.push(`  ⚠️  ${factor.type}: -${factor.impact.toFixed(4)}%`);
                lines.push(`      ${factor.description}`);
            });
            lines.push('');
        }
        else {
            lines.push('✅ No active degradation factors');
            lines.push('');
        }
        // Network hops
        lines.push('Network Hops:');
        metrics.complexityScore.hops.forEach((hop, index) => {
            lines.push(`  ${index + 1}. ${hop.type} (Weight: ${hop.weight})`);
            lines.push(`     ${hop.description}`);
        });
        lines.push('');
        // Alternate routes
        if (metrics.alternateRoutes.length > 0) {
            lines.push('Suggested Alternate Routes:');
            metrics.alternateRoutes.forEach((alt, index) => {
                lines.push(`  ${index + 1}. ${alt.description}`);
                lines.push(`     Node: ${alt.alternateNode}`);
                lines.push(`     Improvement: +${alt.expectedImprovement}%`);
                lines.push(`     Reason: ${alt.reasoning}`);
            });
        }
        else {
            lines.push('✅ No alternate routes needed');
        }
        return lines.join('\n');
    }
    formatTerminalRoutingPath(route) {
        const lines = [
            `Origin: ${route.origin.fullName} (${route.origin.code})`,
            `Destination: ${route.destination.fullName} (${route.destination.code})`,
            `Type: ${route.destinationType}`,
            `Priority: ${route.priority}`,
            `Sorting Hub: ${route.sortingHub}`,
            `Collection: ${route.collectionTime}`,
            `Sorting: ${route.sortingTime}`,
            `Delivery: ${route.deliveryTime}`,
            ''
        ];
        // Add reliability metrics if available
        if (route.reliabilityMetrics) {
            lines.push('=== SIX-SIGMA RELIABILITY METRICS ===');
            lines.push(`System Confidence: ${route.reliabilityMetrics.systemConfidence.displayFormat}`);
            lines.push(`Hop Count: ${route.reliabilityMetrics.hopCount}`);
            lines.push(`Complexity Rating: ${route.reliabilityMetrics.complexityScore.rating} (Score: ${route.reliabilityMetrics.complexityScore.score})`);
            lines.push(`Status: ${route.reliabilityMetrics.thresholdStatus.message}`);
            // Display active degradation factors
            const activeFactors = route.reliabilityMetrics.systemConfidence.degradationFactors
                .filter(factor => factor.isActive);
            if (activeFactors.length > 0) {
                lines.push('');
                lines.push('Active Degradation Factors:');
                activeFactors.forEach(factor => {
                    lines.push(`  ⚠️  ${factor.type}: -${factor.impact.toFixed(4)}%`);
                    lines.push(`      ${factor.description}`);
                });
            }
            // Display alternate routes if available
            if (route.reliabilityMetrics.alternateRoutes.length > 0) {
                lines.push('');
                lines.push('Suggested Alternate Routes:');
                route.reliabilityMetrics.alternateRoutes.forEach((alt, index) => {
                    lines.push(`  ${index + 1}. ${alt.description}`);
                    lines.push(`     Node: ${alt.alternateNode}`);
                    lines.push(`     Improvement: +${alt.expectedImprovement}%`);
                    lines.push(`     Reason: ${alt.reasoning}`);
                });
            }
            lines.push('');
        }
        // Network hops breakdown
        if (route.networkHops && route.networkHops.length > 0) {
            lines.push('Network Hops Breakdown:');
            route.networkHops.forEach((hop, index) => {
                lines.push(`  ${index + 1}. ${hop.type} (Weight: ${hop.weight})`);
                lines.push(`     ${hop.description}`);
                lines.push(`     Station: ${hop.station.fullName} (${hop.station.code})`);
            });
            lines.push('');
        }
        lines.push('Route Segments:');
        route.route.forEach((segment, index) => {
            lines.push(`  ${index + 1}. ${segment.from} → ${segment.to}`);
            lines.push(`     Mode: ${segment.mode} | Duration: ${segment.duration}min | Distance: ${segment.distance}km`);
        });
        return lines.join('\n');
    }
}
exports.OutputFormatter = OutputFormatter;
//# sourceMappingURL=OutputFormatter.js.map