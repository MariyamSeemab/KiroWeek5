import { RoutingPath } from '../models';
import { ProtocolKnowledgeBase } from './ProtocolKnowledgeBase';
export interface RouteComplication {
    type: 'jhol' | 'dadar_failed' | 'general';
    severity: 'low' | 'medium' | 'high';
    alternatives: string[];
    estimatedDelay: number;
    recommendation: string;
}
export declare class SlangPhraseHandlers {
    private protocolKB;
    constructor(protocolKnowledgeBase: ProtocolKnowledgeBase);
    handleJholInRoute(originalRoute: RoutingPath): RouteComplication;
    handleDadarHandoffFailed(originalRoute: RoutingPath): RouteComplication;
    calculateBackupRouting(originalRoute: RoutingPath, complication: RouteComplication): RoutingPath;
    private generateJholRecommendation;
    private generateDadarFailureRecommendation;
    private generateAlternativeRoute;
    private generateSecondaryRoute;
    private addMinutesToTime;
    isJholScenario(input: string): boolean;
    isDadarFailureScenario(input: string): boolean;
    getComplicationSeverity(input: string): 'low' | 'medium' | 'high';
}
//# sourceMappingURL=SlangPhraseHandlers.d.ts.map