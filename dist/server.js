"use strict";
// Express Server for Bambaiyya-Binary Logistics Decoder
// Hosts the Gold Tier Terminal on localhost
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const services_1 = require("./services");
const OutputFormatter_1 = require("./services/OutputFormatter");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Global system components
let protocolKB;
let networkRouter;
let outputFormatter;
// Initialize system
async function initializeSystem() {
    console.log('🚂 Initializing Bambaiyya-Binary Logistics Decoder...');
    try {
        protocolKB = new services_1.ProtocolKnowledgeBase();
        await protocolKB.initialize();
        networkRouter = new services_1.NetworkRouter(protocolKB);
        outputFormatter = new OutputFormatter_1.OutputFormatter();
        console.log('✅ System initialized successfully');
        return true;
    }
    catch (error) {
        console.error('❌ System initialization failed:', error);
        return false;
    }
}
// API Routes
// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'operational',
        service: 'Bambaiyya-Binary Logistics Decoder',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
// System status
app.get('/api/status', (req, res) => {
    if (!protocolKB) {
        return res.status(503).json({ error: 'System not initialized' });
    }
    const stats = protocolKB.getProtocolStats();
    const validation = protocolKB.validateProtocolCompleteness();
    res.json({
        status: validation.isValid ? 'ready' : 'error',
        stats,
        validation,
        sortingHubTime: protocolKB.getSortingHubTime(),
        timestamp: new Date().toISOString()
    });
});
// Parse delivery marker
app.post('/api/parse', (req, res) => {
    if (!networkRouter) {
        return res.status(503).json({ error: 'System not initialized' });
    }
    const { marker } = req.body;
    if (!marker || typeof marker !== 'string') {
        return res.status(400).json({
            error: 'Invalid request',
            message: 'Marker string is required'
        });
    }
    try {
        const parsed = networkRouter.parseDeliveryMarker(marker);
        if (parsed.isValid) {
            const routingPath = networkRouter.generateRoutingPath(parsed);
            res.json({
                success: true,
                parsed,
                routingPath,
                formatted: outputFormatter.formatRoutingPath(routingPath, 'json'),
                timestamp: new Date().toISOString()
            });
        }
        else {
            res.json({
                success: false,
                parsed,
                formatted: outputFormatter.formatValidationErrors(parsed.errors, 'json'),
                timestamp: new Date().toISOString()
            });
        }
    }
    catch (error) {
        res.status(500).json({
            error: 'Parsing failed',
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
    }
});
// Generate routing path
app.post('/api/route', (req, res) => {
    if (!networkRouter) {
        return res.status(503).json({ error: 'System not initialized' });
    }
    const { marker } = req.body;
    if (!marker || typeof marker !== 'string') {
        return res.status(400).json({
            error: 'Invalid request',
            message: 'Marker string is required'
        });
    }
    try {
        const parsed = networkRouter.parseDeliveryMarker(marker);
        if (!parsed.isValid) {
            return res.json({
                success: false,
                errors: parsed.errors,
                formatted: outputFormatter.formatValidationErrors(parsed.errors, 'json'),
                timestamp: new Date().toISOString()
            });
        }
        const routingPath = networkRouter.generateRoutingPath(parsed);
        res.json({
            success: true,
            parsed,
            routingPath,
            formatted: outputFormatter.formatRoutingPath(routingPath, 'json'),
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Routing failed',
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
    }
});
// Process Mumbai slang
app.post('/api/slang', (req, res) => {
    if (!networkRouter) {
        return res.status(503).json({ error: 'System not initialized' });
    }
    const { input } = req.body;
    if (!input || typeof input !== 'string') {
        return res.status(400).json({
            error: 'Invalid request',
            message: 'Input string is required'
        });
    }
    try {
        const processed = networkRouter.handleMumbaiSlang(input);
        res.json({
            success: true,
            processed,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Slang processing failed',
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
    }
});
// Get protocol information
app.get('/api/protocol', (req, res) => {
    if (!protocolKB) {
        return res.status(503).json({ error: 'System not initialized' });
    }
    try {
        res.json({
            stations: protocolKB.getAllStationCodes(),
            symbols: protocolKB.getAllSymbolShapes(),
            colors: protocolKB.getAllColorNames(),
            slang: protocolKB.getMumbaiSlang(),
            stats: protocolKB.getProtocolStats(),
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Protocol data retrieval failed',
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
    }
});
// Packet Lifecycle Tracking endpoint
app.post('/api/trace', (req, res) => {
    try {
        const { marker } = req.body;
        if (!marker) {
            return res.status(400).json({
                success: false,
                error: { message: 'Marker is required' }
            });
        }
        if (!networkRouter) {
            return res.status(503).json({
                success: false,
                error: { message: 'Network router not initialized' }
            });
        }
        // Parse the marker first
        const parsed = networkRouter.parseDeliveryMarker(marker);
        if (!parsed.isValid) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid marker format', details: parsed.errors }
            });
        }
        // Generate routing path
        const routingPath = networkRouter.generateRoutingPath(parsed);
        // Create packet trace
        const packetTrace = {
            packetId: `PKT-${Date.now().toString(36).toUpperCase()}`,
            marker,
            hops: [
                {
                    hopNumber: 1,
                    location: `Customer Home (${routingPath.destination.area})`,
                    status: 'processed',
                    description: 'Packet created at source node'
                },
                {
                    hopNumber: 2,
                    location: `${routingPath.destination.fullName} Station`,
                    status: 'in_transit',
                    description: 'Packet aggregated at local station'
                },
                {
                    hopNumber: 3,
                    location: 'Dadar Sorting Hub',
                    status: 'pending',
                    description: 'Packet routed through central hub'
                },
                {
                    hopNumber: 4,
                    location: `Office Desk (${routingPath.destination.fullName})`,
                    status: 'pending',
                    description: 'Packet delivered to destination'
                }
            ],
            currentHop: 2,
            overallStatus: 'collecting',
            estimatedDelivery: routingPath.deliveryTime
        };
        res.json({
            success: true,
            packetTrace,
            routingPath,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Packet trace error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Internal server error during packet tracing' }
        });
    }
});
// Network latency simulation endpoint
app.post('/api/latency', (req, res) => {
    try {
        const { delayFactor = 0 } = req.body;
        const latencyStatus = {
            delayFactor,
            status: delayFactor === 0 ? 'normal' :
                delayFactor <= 15 ? 'delayed' :
                    delayFactor <= 30 ? 'heavy' : 'critical',
            dadarStatus: delayFactor === 0 ? 'ON TIME' : `${delayFactor} MIN DELAY`,
            recommendations: delayFactor > 15 ? ['Use alternative routing', 'Consider backup sorting hubs'] : [],
            timestamp: new Date().toISOString()
        };
        res.json({
            success: true,
            latencyStatus,
            systemIntegrity: Math.max(40, 100 - (delayFactor * 2))
        });
    }
    catch (error) {
        console.error('Latency simulation error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Internal server error during latency simulation' }
        });
    }
});
// System diagnostics endpoint
app.get('/api/diagnostics', (req, res) => {
    try {
        const diagnostics = {
            systemHealth: {
                protocolKB: protocolKB ? 'operational' : 'failed',
                networkRouter: networkRouter ? 'operational' : 'failed',
                outputFormatter: outputFormatter ? 'operational' : 'failed'
            },
            performance: {
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage(),
                cpuUsage: process.cpuUsage()
            },
            features: {
                packetLifecycleTracker: 'active',
                networkLatencyEngine: 'active',
                bambaiyyaDebugger: 'active',
                tapriNodeGeofencing: 'active'
            },
            timestamp: new Date().toISOString()
        };
        res.json({
            success: true,
            diagnostics
        });
    }
    catch (error) {
        console.error('Diagnostics error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Internal server error during diagnostics' }
        });
    }
});
// Serve main application
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message || 'Unknown error occurred',
        timestamp: new Date().toISOString()
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.path} not found`,
        timestamp: new Date().toISOString()
    });
});
// Start server
async function startServer() {
    const initialized = await initializeSystem();
    if (!initialized) {
        console.error('❌ Failed to initialize system. Server not started.');
        process.exit(1);
    }
    app.listen(PORT, () => {
        console.log('');
        console.log('🚂 Bambaiyya-Binary Logistics Decoder v1.0.0');
        console.log('   Gold Tier Terminal for the Dabbawala Network');
        console.log('   Digitizing 130 years of Mumbai delivery excellence');
        console.log('');
        console.log(`🌐 Server running on: http://localhost:${PORT}`);
        console.log(`📊 API endpoints available at: http://localhost:${PORT}/api/`);
        console.log('');
        console.log('🎯 System ready for packet routing operations');
        console.log(`   Dadar Sorting Hub synchronized at ${protocolKB.getSortingHubTime()}`);
        console.log('   Network Router operational with Mumbai terminology support');
        console.log('');
        console.log('💡 Try these endpoints:');
        console.log(`   GET  http://localhost:${PORT}/api/status`);
        console.log(`   POST http://localhost:${PORT}/api/parse`);
        console.log(`   POST http://localhost:${PORT}/api/route`);
        console.log('');
    });
}
// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🚂 Bambaiyya-Binary Terminal shutting down...');
    console.log('Thank you for using the Dabbawala Network Router!');
    process.exit(0);
});
// Start the server
startServer().catch(console.error);
//# sourceMappingURL=server.js.map