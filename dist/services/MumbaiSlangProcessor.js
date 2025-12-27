"use strict";
// Mumbai Slang Recognition and Processing System
// Handles authentic Mumbai terminology and local abbreviations
Object.defineProperty(exports, "__esModule", { value: true });
exports.MumbaiSlangProcessor = void 0;
class MumbaiSlangProcessor {
    constructor(protocolKnowledgeBase) {
        this.slangCache = new Map();
        this.abbreviationCache = new Map();
        this.protocolKB = protocolKnowledgeBase;
        this.buildSlangCache();
    }
    buildSlangCache() {
        const slangTerms = this.protocolKB.getMumbaiSlang();
        // Build slang cache for fast lookup
        for (const slang of slangTerms) {
            this.slangCache.set(slang.slang.toLowerCase(), slang);
            // Also cache alternatives
            if (slang.alternatives) {
                for (const alt of slang.alternatives) {
                    this.slangCache.set(alt.toLowerCase(), slang);
                }
            }
        }
        // Build common Mumbai abbreviations cache
        this.buildAbbreviationCache();
    }
    buildAbbreviationCache() {
        // Common Mumbai area abbreviations
        const abbreviations = {
            'bombie': 'Mumbai local',
            'bombay': 'Mumbai',
            'vt': 'CST',
            'victoria terminus': 'CST',
            'churchgate': 'CHU',
            'bandra': 'BAN',
            'andheri': 'AND',
            'dadar tt': 'DDR',
            'central hub': 'DDR',
            'main junction': 'DDR',
            'bk complex': 'BKC',
            'bandra complex': 'BKC',
            'nariman': 'NAR',
            'vile parle': 'VLP',
            'ville': 'VLP',
            'vp': 'VLP',
            'goregaon': 'GOR',
            'malad': 'MAL',
            'borivali': 'BOR',
            'kurla': 'KUR',
            'ghatkopar': 'GHA',
            'vikhroli': 'VIK',
            'bhandup': 'BHA',
            'powai': 'POW'
        };
        for (const [abbrev, expansion] of Object.entries(abbreviations)) {
            this.abbreviationCache.set(abbrev.toLowerCase(), expansion);
        }
    }
    recognizeSlang(input) {
        let processedText = input;
        const detected = [];
        const expansions = [];
        // Check for slang terms
        for (const [slangKey, slangData] of this.slangCache) {
            const escapedKey = this.escapeRegexChars(slangKey);
            const regex = new RegExp(`\\b${escapedKey}\\b`, 'gi');
            if (regex.test(input)) {
                detected.push(slangData);
                // Generate contextual expansions
                const expansion = this.generateExpansion(slangData);
                if (expansion) {
                    expansions.push(expansion);
                }
                // Replace slang with standard terminology
                processedText = processedText.replace(regex, slangData.meaning);
            }
        }
        return {
            detected,
            processedText,
            expansions
        };
    }
    expandAbbreviations(input) {
        let expandedText = input;
        const expansions = {};
        // Check for abbreviations
        for (const [abbrev, expansion] of this.abbreviationCache) {
            const escapedAbbrev = this.escapeRegexChars(abbrev);
            const regex = new RegExp(`\\b${escapedAbbrev}\\b`, 'gi');
            const matches = input.match(regex);
            if (matches) {
                for (const match of matches) {
                    expansions[match] = expansion;
                    const escapedMatch = this.escapeRegexChars(match);
                    expandedText = expandedText.replace(new RegExp(`\\b${escapedMatch}\\b`, 'gi'), expansion);
                }
            }
        }
        return {
            originalText: input,
            expandedText,
            expansions
        };
    }
    processInput(input) {
        // First expand abbreviations
        const abbreviationResult = this.expandAbbreviations(input);
        // Then process slang on the expanded text
        const slangResult = this.recognizeSlang(abbreviationResult.expandedText);
        return {
            originalInput: input,
            processedInput: slangResult.processedText,
            slangDetected: slangResult.detected,
            expansions: slangResult.expansions,
            abbreviationExpansions: abbreviationResult.expansions
        };
    }
    generateExpansion(slang) {
        switch (slang.slang.toLowerCase()) {
            case 'jhol in the route':
                return 'Route complication detected - alternative paths will be calculated';
            case 'dadar handoff failed':
                return 'Primary sorting missed - routing to secondary sort at 1:00 PM';
            case 'packet chalega':
                return 'Delivery confirmed - route proceeding as planned';
            case 'local pakad':
                return 'Use suburban railway for fastest routing';
            default:
                return `Mumbai terminology: ${slang.meaning}`;
        }
    }
    escapeRegexChars(str) {
        // Escape special regex characters properly
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    // Helper methods for specific slang scenarios
    isRouteComplication(input) {
        const complications = ['jhol in the route', 'route mein problem', 'delivery stuck'];
        return complications.some(comp => input.toLowerCase().includes(comp));
    }
    isDadarHandoffFailed(input) {
        const failures = ['dadar handoff failed', 'dadar miss ho gaya', 'sorting time nikla'];
        return failures.some(fail => input.toLowerCase().includes(fail));
    }
    isDeliveryConfirmed(input) {
        const confirmations = ['packet chalega', 'delivery confirmed', 'route ok'];
        return confirmations.some(conf => input.toLowerCase().includes(conf));
    }
    getSupportedSlangTerms() {
        return Array.from(this.slangCache.keys());
    }
    getSupportedAbbreviations() {
        return Array.from(this.abbreviationCache.keys());
    }
}
exports.MumbaiSlangProcessor = MumbaiSlangProcessor;
//# sourceMappingURL=MumbaiSlangProcessor.js.map