import { TerminalInterface as ITerminalInterface, RoutingResult, DeliverySymbol } from '../interfaces';
import { RoutingPath, ValidationError } from '../models';
import { NetworkRouter } from '../services/NetworkRouter';
export declare class TerminalInterface implements ITerminalInterface {
    private networkRouter;
    private outputFormatter;
    private rl;
    private isRunning;
    private readonly COLORS;
    constructor(networkRouter: NetworkRouter);
    displayDashboard(): void;
    processSymbolInput(marker: string): Promise<RoutingResult>;
    renderProgressPipeline(route: RoutingPath): void;
    handleSymbolGrid(symbols: DeliverySymbol[]): void;
    showErrorMessage(error: ValidationError): void;
    start(): void;
    stop(): void;
    private setupEventHandlers;
    private clearScreen;
    private displayHeader;
    private displaySystemStatus;
    private displayUsageInstructions;
    private displayPrompt;
    private createPrompt;
    private displayPacketInfo;
    private displayTimeline;
    private displayRouteSegments;
    private displaySymbolRow;
    displayReliabilityMetrics(metrics: any): void;
    private displaySystemConfidence;
    showComplexityRating(score: any): void;
    displayThresholdStatus(status: any): void;
    private displayDegradationFactors;
    renderAlternateRoutes(alternatives: any[]): void;
    displayEnvironmentalFactors(factors: any): void;
    private handleSystemCommands;
    private displayReliabilityInfo;
}
//# sourceMappingURL=TerminalInterface.d.ts.map