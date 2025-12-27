import { SlangMapping } from '../models';
import { ProtocolKnowledgeBase } from './ProtocolKnowledgeBase';
export declare class MumbaiSlangProcessor {
    private protocolKB;
    private slangCache;
    private abbreviationCache;
    constructor(protocolKnowledgeBase: ProtocolKnowledgeBase);
    private buildSlangCache;
    private buildAbbreviationCache;
    recognizeSlang(input: string): {
        detected: SlangMapping[];
        processedText: string;
        expansions: string[];
    };
    expandAbbreviations(input: string): {
        originalText: string;
        expandedText: string;
        expansions: {
            [key: string]: string;
        };
    };
    processInput(input: string): {
        originalInput: string;
        processedInput: string;
        slangDetected: SlangMapping[];
        expansions: string[];
        abbreviationExpansions: {
            [key: string]: string;
        };
    };
    private generateExpansion;
    private escapeRegexChars;
    isRouteComplication(input: string): boolean;
    isDadarHandoffFailed(input: string): boolean;
    isDeliveryConfirmed(input: string): boolean;
    getSupportedSlangTerms(): string[];
    getSupportedAbbreviations(): string[];
}
//# sourceMappingURL=MumbaiSlangProcessor.d.ts.map