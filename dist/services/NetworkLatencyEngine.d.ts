export interface TrainStatus {
    line: 'Western' | 'Central' | 'Harbour';
    delayFactor: number;
    status: 'On-Time' | 'Minor Delay' | 'Major Delay' | 'Service Disruption' | 'Line Closure';
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';
    bypassRequired: boolean;
}
export interface LatencyAlert {
    type: 'INFO' | 'WARNING' | 'CRITICAL' | 'EMERGENCY';
    message: string;
    action: string;
    timestamp: string;
}
export declare class NetworkLatencyEngine {
    private currentStatus;
    private alerts;
    constructor();
    private initializeTrainStatus;
    calculateHandoffRisk(stationCode: string, targetTime?: string): TrainStatus;
    private getLineForStation;
    private getPeakHourMultiplier;
    private assessRisk;
    private checkForAlerts;
    getBypassRoutes(stationCode: string): string[];
    getCurrentAlerts(): LatencyAlert[];
    getNetworkStatus(): {
        overall: string;
        lines: Map<string, TrainStatus>;
    };
    private getRiskScore;
    private getDefaultStatus;
    private updateRiskLevels;
    simulateRealTimeUpdates(): void;
}
//# sourceMappingURL=NetworkLatencyEngine.d.ts.map