import { RoutingPath } from '../models';
export interface PacketHop {
    hopNumber: number;
    hopType: 'source' | 'aggregator' | 'router' | 'destination';
    location: string;
    timestamp: string;
    status: 'pending' | 'in_transit' | 'arrived' | 'processed' | 'dispatched';
    description: string;
    estimatedTime: string;
    actualTime?: string;
    delay?: number;
}
export interface PacketTrace {
    packetId: string;
    marker: string;
    hops: PacketHop[];
    totalHops: number;
    currentHop: number;
    overallStatus: 'created' | 'collecting' | 'sorting' | 'delivering' | 'delivered' | 'failed';
    startTime: string;
    estimatedDelivery: string;
    actualDelivery?: string;
    totalDelay: number;
}
export declare class PacketLifecycleTracker {
    private activeTraces;
    createPacketTrace(marker: string, routingPath: RoutingPath): PacketTrace;
    simulatePacketProgress(packetId: string, delayFactor?: number): PacketTrace | null;
    getTraceRoute(packetId: string): string[];
    generateNetworkDiagram(trace: PacketTrace): string;
    compareToTCPIP(trace: PacketTrace): string;
    getAllActiveTraces(): PacketTrace[];
    private generatePacketId;
    private addMinutes;
    private getHopStatus;
}
//# sourceMappingURL=PacketLifecycleTracker.d.ts.map