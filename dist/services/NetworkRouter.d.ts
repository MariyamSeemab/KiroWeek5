import { NetworkRouter as INetworkRouter, ParsedMarker, RoutingPath, ValidationResult, TimingConstraints, ProcessedInput } from '../interfaces';
import { ProtocolKnowledgeBase } from './ProtocolKnowledgeBase';
export declare class NetworkRouter implements INetworkRouter {
    private protocolKB;
    private reliabilityEngine;
    constructor(protocolKnowledgeBase: ProtocolKnowledgeBase);
    parseDeliveryMarker(marker: string): ParsedMarker;
    private extractMarkerComponents;
    validateMarkerComponents(marker: ParsedMarker): ValidationResult;
    generateRoutingPath(parsed: ParsedMarker): RoutingPath;
    calculateTiming(parsed: ParsedMarker): TimingConstraints;
    handleMumbaiSlang(input: string): ProcessedInput;
    private createInvalidMarker;
    private createDefaultColorInfo;
    private createDefaultSymbolInfo;
    private createDefaultStationInfo;
    private getClosestStationCodes;
    private calculateStringSimilarity;
    private levenshteinDistance;
    private getDadarStation;
    private generateRouteSegments;
    private determineTransportMode;
    private calculateTravelTime;
    private calculateDistance;
    private formatTime;
    private isMonsoonSeason;
    private getCurrentRainfall;
    private isWesternToCentralRoute;
}
//# sourceMappingURL=NetworkRouter.d.ts.map