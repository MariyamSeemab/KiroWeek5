"use strict";
// Packet Lifecycle Tracker for Bambaiyya-Binary Logistics Decoder
// Treats lunchboxes exactly like TCP/IP network packets with hop-by-hop tracking
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketLifecycleTracker = void 0;
class PacketLifecycleTracker {
    constructor() {
        this.activeTraces = new Map();
    }
    createPacketTrace(marker, routingPath) {
        const packetId = this.generatePacketId(marker);
        const startTime = new Date().toISOString();
        // Define the 4 standard hops for every packet
        const hops = [
            {
                hopNumber: 1,
                hopType: 'source',
                location: `Customer Home (${routingPath.destination.area})`,
                timestamp: startTime,
                status: 'processed',
                description: 'Packet created at source node - customer home',
                estimatedTime: routingPath.collectionTime,
                actualTime: routingPath.collectionTime
            },
            {
                hopNumber: 2,
                hopType: 'aggregator',
                location: `${routingPath.destination.fullName} Station (${routingPath.destination.code})`,
                timestamp: this.addMinutes(startTime, 15),
                status: 'in_transit',
                description: 'Packet aggregated at local station collection point',
                estimatedTime: this.addMinutes(routingPath.collectionTime, 15)
            },
            {
                hopNumber: 3,
                hopType: 'router',
                location: `${routingPath.sortingHub} Sorting Hub (DDR)`,
                timestamp: this.addMinutes(startTime, 45),
                status: 'pending',
                description: 'Packet routed through central sorting hub',
                estimatedTime: routingPath.sortingTime
            },
            {
                hopNumber: 4,
                hopType: 'destination',
                location: `Office Desk (${routingPath.destination.fullName})`,
                timestamp: this.addMinutes(startTime, 90),
                status: 'pending',
                description: 'Packet delivered to final destination node',
                estimatedTime: routingPath.deliveryTime
            }
        ];
        const trace = {
            packetId,
            marker,
            hops,
            totalHops: 4,
            currentHop: 2, // Currently at aggregator
            overallStatus: 'collecting',
            startTime,
            estimatedDelivery: routingPath.deliveryTime,
            totalDelay: 0
        };
        this.activeTraces.set(packetId, trace);
        return trace;
    }
    simulatePacketProgress(packetId, delayFactor = 0) {
        const trace = this.activeTraces.get(packetId);
        if (!trace)
            return null;
        // Simulate packet moving through hops
        const currentTime = new Date();
        for (let i = 0; i < trace.hops.length; i++) {
            const hop = trace.hops[i];
            const hopTime = new Date(hop.timestamp);
            const delayedTime = new Date(hopTime.getTime() + (delayFactor * 60 * 1000));
            if (currentTime >= delayedTime) {
                if (hop.status === 'pending' || hop.status === 'in_transit') {
                    hop.status = i === trace.hops.length - 1 ? 'arrived' : 'processed';
                    hop.actualTime = currentTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });
                    if (delayFactor > 0) {
                        hop.delay = delayFactor;
                        trace.totalDelay += delayFactor;
                    }
                    trace.currentHop = Math.min(i + 1, trace.totalHops);
                }
            }
        }
        // Update overall status
        if (trace.currentHop === 1)
            trace.overallStatus = 'created';
        else if (trace.currentHop === 2)
            trace.overallStatus = 'collecting';
        else if (trace.currentHop === 3)
            trace.overallStatus = 'sorting';
        else if (trace.currentHop === 4)
            trace.overallStatus = 'delivering';
        else if (trace.currentHop > 4)
            trace.overallStatus = 'delivered';
        return trace;
    }
    getTraceRoute(packetId) {
        const trace = this.activeTraces.get(packetId);
        if (!trace)
            return [];
        return trace.hops.map((hop, index) => {
            const status = hop.status === 'processed' ? '✅' :
                hop.status === 'in_transit' ? '🚛' :
                    hop.status === 'arrived' ? '📦' : '⏳';
            const delay = hop.delay ? ` (+${hop.delay}min delay)` : '';
            return `Hop ${hop.hopNumber}: ${status} ${hop.location}${delay}`;
        });
    }
    generateNetworkDiagram(trace) {
        const diagram = `
╭─────────────────────────────────────────────────────────────────╮
│                    PACKET LIFECYCLE TRACE                      │
│                                                                 │
│  Packet ID: ${trace.packetId}                                   │
│  Marker: ${trace.marker}                                        │
│  Status: ${trace.overallStatus.toUpperCase()}                   │
│  Current Hop: ${trace.currentHop}/${trace.totalHops}            │
│  Total Delay: ${trace.totalDelay} minutes                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [1] SOURCE NODE     →  [2] AGGREGATOR     →  [3] ROUTER       │
│      Customer Home       Local Station        Dadar Hub        │
│      ${this.getHopStatus(trace, 1)}                ${this.getHopStatus(trace, 2)}               ${this.getHopStatus(trace, 3)}        │
│                                                                 │
│                           ↓                                     │
│                                                                 │
│                    [4] DESTINATION                              │
│                       Office Desk                              │
│                       ${this.getHopStatus(trace, 4)}                              │
│                                                                 │
╰─────────────────────────────────────────────────────────────────╯`;
        return diagram;
    }
    compareToTCPIP(trace) {
        return `
╭─────────────────────────────────────────────────────────────────╮
│              DABBA-HOPS vs INTERNET PACKET-HOPS                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DABBAWALA NETWORK          │  TCP/IP NETWORK                   │
│                             │                                   │
│  1. Customer Home           │  1. Source Host                   │
│     (Application Layer)     │     (Application Layer)           │
│                             │                                   │
│  2. Local Station           │  2. Local Router                  │
│     (Aggregation Point)     │     (Network Layer)               │
│                             │                                   │
│  3. Dadar Sorting Hub       │  3. Core Router                   │
│     (Central Router)        │     (Internet Backbone)           │
│                             │                                   │
│  4. Office Desk             │  4. Destination Host              │
│     (Final Delivery)        │     (Application Layer)           │
│                             │                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  BOTH SYSTEMS USE:                                              │
│  • Hop-by-hop routing                                           │
│  • Central aggregation points                                   │
│  • Error detection & recovery                                   │
│  • Deterministic addressing                                     │
│  • Quality of Service (Priority levels)                        │
│                                                                 │
╰─────────────────────────────────────────────────────────────────╯`;
    }
    getAllActiveTraces() {
        return Array.from(this.activeTraces.values());
    }
    generatePacketId(marker) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        const markerHash = marker.replace(/\s+/g, '').toUpperCase().substr(0, 3);
        return `PKT-${markerHash}-${timestamp}-${random}`.toUpperCase();
    }
    addMinutes(timeString, minutes) {
        const date = new Date(timeString);
        date.setMinutes(date.getMinutes() + minutes);
        return date.toISOString();
    }
    getHopStatus(trace, hopNumber) {
        const hop = trace.hops[hopNumber - 1];
        if (!hop)
            return '❓';
        switch (hop.status) {
            case 'processed': return '✅';
            case 'in_transit': return '🚛';
            case 'arrived': return '📦';
            case 'pending': return '⏳';
            default: return '❓';
        }
    }
}
exports.PacketLifecycleTracker = PacketLifecycleTracker;
//# sourceMappingURL=PacketLifecycleTracker.js.map