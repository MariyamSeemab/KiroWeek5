"use strict";
// Terminal Interface for Bambaiyya-Binary Logistics Decoder
// Industrial-style railway dashboard with monospace fonts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalInterface = void 0;
const readline = __importStar(require("readline"));
const OutputFormatter_1 = require("../services/OutputFormatter");
class TerminalInterface {
    constructor(networkRouter) {
        this.isRunning = false;
        // Industrial color palette
        this.COLORS = {
            DEEP_CHARCOAL: '\x1b[48;2;18;18;18m', // #121212 background
            SUBWAY_YELLOW: '\x1b[38;2;255;215;0m', // #FFD700 accent
            STATION_BLUE: '\x1b[38;2;0;51;153m', // #003399 accent
            ERROR_RED: '\x1b[38;2;220;20;60m', // Error messages
            SUCCESS_GREEN: '\x1b[38;2;50;205;50m', // Success messages
            WARNING_ORANGE: '\x1b[38;2;255;140;0m', // Warning messages
            RESET: '\x1b[0m', // Reset colors
            BOLD: '\x1b[1m', // Bold text
            DIM: '\x1b[2m' // Dim text
        };
        this.networkRouter = networkRouter;
        this.outputFormatter = new OutputFormatter_1.OutputFormatter();
        // Create readline interface with industrial styling
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: this.createPrompt()
        });
        this.setupEventHandlers();
    }
    displayDashboard() {
        this.clearScreen();
        this.displayHeader();
        this.displaySystemStatus();
        this.displayUsageInstructions();
        this.displayPrompt();
    }
    async processSymbolInput(marker) {
        try {
            console.log(this.COLORS.DIM + '🔍 Processing delivery marker...' + this.COLORS.RESET);
            // Parse the delivery marker
            const parsed = this.networkRouter.parseDeliveryMarker(marker);
            if (!parsed.isValid) {
                const errorOutput = this.outputFormatter.formatValidationErrors(parsed.errors, 'terminal');
                console.log(this.COLORS.ERROR_RED + errorOutput.body + this.COLORS.RESET);
                return {
                    success: false,
                    error: parsed.errors[0]
                };
            }
            // Generate routing path
            const routingPath = this.networkRouter.generateRoutingPath(parsed);
            // Display formatted output
            this.renderProgressPipeline(routingPath);
            return {
                success: true,
                routingPath
            };
        }
        catch (error) {
            const errorMsg = `System error: ${error}`;
            console.log(this.COLORS.ERROR_RED + errorMsg + this.COLORS.RESET);
            return {
                success: false,
                error: {
                    component: 'system',
                    message: errorMsg,
                    suggestions: ['Check system status', 'Restart terminal interface']
                }
            };
        }
    }
    renderProgressPipeline(route) {
        console.log(this.COLORS.SUBWAY_YELLOW + this.COLORS.BOLD);
        console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
        console.log('║                            ROUTING PIPELINE ACTIVE                          ║');
        console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
        console.log(this.COLORS.RESET);
        // Display packet information
        this.displayPacketInfo(route);
        // Display reliability metrics if available
        if (route.reliabilityMetrics) {
            this.displayReliabilityMetrics(route.reliabilityMetrics);
        }
        // Display timeline
        this.displayTimeline(route);
        // Display route segments
        this.displayRouteSegments(route);
        console.log(this.COLORS.SUCCESS_GREEN + '✅ Routing pipeline completed successfully' + this.COLORS.RESET);
        console.log('');
    }
    handleSymbolGrid(symbols) {
        console.log(this.COLORS.STATION_BLUE + this.COLORS.BOLD);
        console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
        console.log('│                              SYMBOL INPUT GRID                             │');
        console.log('└─────────────────────────────────────────────────────────────────────────────┘');
        console.log(this.COLORS.RESET);
        // Display available symbols in grid format
        const colorSymbols = symbols.filter(s => s.type === 'color');
        const shapeSymbols = symbols.filter(s => s.type === 'symbol');
        const stationSymbols = symbols.filter(s => s.type === 'station');
        console.log(this.COLORS.SUBWAY_YELLOW + 'COLORS:' + this.COLORS.RESET);
        this.displaySymbolRow(colorSymbols);
        console.log(this.COLORS.SUBWAY_YELLOW + 'SYMBOLS:' + this.COLORS.RESET);
        this.displaySymbolRow(shapeSymbols);
        console.log(this.COLORS.SUBWAY_YELLOW + 'STATIONS:' + this.COLORS.RESET);
        this.displaySymbolRow(stationSymbols);
        console.log('');
    }
    showErrorMessage(error) {
        console.log(this.COLORS.ERROR_RED + this.COLORS.BOLD);
        console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
        console.log('║                                 ERROR                                       ║');
        console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
        console.log(this.COLORS.RESET);
        console.log(this.COLORS.ERROR_RED + `Component: ${error.component.toUpperCase()}` + this.COLORS.RESET);
        console.log(this.COLORS.ERROR_RED + `Message: ${error.message}` + this.COLORS.RESET);
        if (error.suggestions && error.suggestions.length > 0) {
            console.log(this.COLORS.WARNING_ORANGE + 'Suggestions:' + this.COLORS.RESET);
            error.suggestions.forEach(suggestion => {
                console.log(this.COLORS.DIM + `  • ${suggestion}` + this.COLORS.RESET);
            });
        }
        console.log('');
    }
    // Start the interactive terminal
    start() {
        this.isRunning = true;
        this.displayDashboard();
        this.rl.on('line', async (input) => {
            const trimmedInput = input.trim();
            if (trimmedInput === '') {
                this.rl.prompt();
                return;
            }
            if (this.handleSystemCommands(trimmedInput)) {
                return;
            }
            // Process as delivery marker
            await this.processSymbolInput(trimmedInput);
            this.rl.prompt();
        });
        this.rl.prompt();
    }
    // Stop the terminal interface
    stop() {
        this.isRunning = false;
        console.log(this.COLORS.SUBWAY_YELLOW + '\n🚂 Bambaiyya-Binary Terminal shutting down...' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + 'Thank you for using the Dabbawala Network Router!' + this.COLORS.RESET);
        this.rl.close();
    }
    setupEventHandlers() {
        this.rl.on('SIGINT', () => {
            console.log(this.COLORS.WARNING_ORANGE + '\n⚠️ Interrupt signal received' + this.COLORS.RESET);
            this.stop();
        });
        this.rl.on('close', () => {
            if (this.isRunning) {
                console.log(this.COLORS.DIM + '\nTerminal interface closed.' + this.COLORS.RESET);
                process.exit(0);
            }
        });
    }
    clearScreen() {
        console.clear();
    }
    displayHeader() {
        console.log(this.COLORS.DEEP_CHARCOAL + this.COLORS.SUBWAY_YELLOW + this.COLORS.BOLD);
        console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
        console.log('║  ██████╗  █████╗ ███╗   ███╗██████╗  █████╗ ██╗██╗   ██╗██╗   ██╗ █████╗   ║');
        console.log('║  ██╔══██╗██╔══██╗████╗ ████║██╔══██╗██╔══██╗██║╚██╗ ██╔╝╚██╗ ██╔╝██╔══██╗  ║');
        console.log('║  ██████╔╝███████║██╔████╔██║██████╔╝███████║██║ ╚████╔╝  ╚████╔╝ ███████║  ║');
        console.log('║  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══██╗██╔══██║██║  ╚██╔╝    ╚██╔╝  ██╔══██║  ║');
        console.log('║  ██████╔╝██║  ██║██║ ╚═╝ ██║██████╔╝██║  ██║██║   ██║      ██║   ██║  ██║  ║');
        console.log('║  ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝  ║');
        console.log('║                                                                              ║');
        console.log('║                    BINARY LOGISTICS DECODER v1.0.0                         ║');
        console.log('║                   Terminal for the Dabbawala Network                        ║');
        console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
        console.log(this.COLORS.RESET);
    }
    displaySystemStatus() {
        console.log(this.COLORS.STATION_BLUE + this.COLORS.BOLD + 'SYSTEM STATUS:' + this.COLORS.RESET);
        console.log(this.COLORS.SUCCESS_GREEN + '  ✅ Network Router: OPERATIONAL' + this.COLORS.RESET);
        console.log(this.COLORS.SUCCESS_GREEN + '  ✅ Protocol Database: LOADED' + this.COLORS.RESET);
        console.log(this.COLORS.SUCCESS_GREEN + '  ✅ Dadar Sorting Hub: SYNCHRONIZED' + this.COLORS.RESET);
        console.log(this.COLORS.SUCCESS_GREEN + '  ✅ Mumbai Terminology: ACTIVE' + this.COLORS.RESET);
        console.log(this.COLORS.SUCCESS_GREEN + '  ✅ Six-Sigma Reliability Engine: ACTIVE' + this.COLORS.RESET);
        console.log(this.COLORS.SUCCESS_GREEN + '  ✅ Baseline Accuracy: 99.99999% (1 error in 16 million)' + this.COLORS.RESET);
        console.log('');
    }
    displayUsageInstructions() {
        console.log(this.COLORS.SUBWAY_YELLOW + this.COLORS.BOLD + 'USAGE INSTRUCTIONS:' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + '  Format: "Color Symbol - Station - Sequence"' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + '  Example: "Red Triangle - VLP - 4"' + this.COLORS.RESET);
        console.log('');
        console.log(this.COLORS.STATION_BLUE + 'SYSTEM COMMANDS:' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + '  help       - Show this help message' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + '  status     - Display system status' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + '  grid       - Show symbol input grid' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + '  metrics    - Show reliability metrics info' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + '  clear      - Clear screen' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + '  exit       - Exit terminal' + this.COLORS.RESET);
        console.log('');
    }
    displayPrompt() {
        console.log(this.COLORS.SUBWAY_YELLOW + 'Ready for packet routing operations...' + this.COLORS.RESET);
    }
    createPrompt() {
        return this.COLORS.STATION_BLUE + 'dabbawala> ' + this.COLORS.RESET;
    }
    displayPacketInfo(route) {
        console.log(this.COLORS.STATION_BLUE + '📦 PACKET INFORMATION:' + this.COLORS.RESET);
        console.log(`   Origin: ${route.origin.fullName} (${route.origin.code})`);
        console.log(`   Destination: ${route.destination.fullName} (${route.destination.code})`);
        console.log(`   Type: ${route.destinationType}`);
        console.log(`   Priority: ${route.priority}`);
        console.log('');
    }
    displayTimeline(route) {
        console.log(this.COLORS.STATION_BLUE + '⏰ DELIVERY TIMELINE:' + this.COLORS.RESET);
        console.log(`   Collection: ${route.collectionTime}`);
        console.log(`   Sorting: ${route.sortingTime} at ${route.sortingHub}`);
        console.log(`   Delivery: ${route.deliveryTime}`);
        console.log('');
    }
    displayRouteSegments(route) {
        console.log(this.COLORS.STATION_BLUE + '🗺️ ROUTE SEGMENTS:' + this.COLORS.RESET);
        route.route.forEach((segment, index) => {
            console.log(`   ${index + 1}. ${segment.from} → ${segment.to}`);
            console.log(this.COLORS.DIM + `      Mode: ${segment.mode} | Duration: ${segment.duration}min | Distance: ${segment.distance}km` + this.COLORS.RESET);
        });
        console.log('');
    }
    displaySymbolRow(symbols) {
        const row = symbols.map(symbol => `[${symbol.value}]`).join(' ');
        console.log(this.COLORS.DIM + '  ' + row + this.COLORS.RESET);
    }
    // Six-Sigma Reliability Metrics Display Components
    displayReliabilityMetrics(metrics) {
        console.log(this.COLORS.SUBWAY_YELLOW + this.COLORS.BOLD + '📊 SIX-SIGMA RELIABILITY METRICS:' + this.COLORS.RESET);
        // System confidence with precision formatting
        this.displaySystemConfidence(metrics.systemConfidence);
        // Complexity rating visualization
        this.showComplexityRating(metrics.complexityScore);
        // Threshold status with color coding
        this.displayThresholdStatus(metrics.thresholdStatus);
        // Hop count display
        console.log(`   Hop Count: ${this.COLORS.STATION_BLUE}${metrics.hopCount}${this.COLORS.RESET} handoffs detected`);
        // Active degradation factors
        this.displayDegradationFactors(metrics.systemConfidence.degradationFactors);
        // Alternate routes if available
        if (metrics.alternateRoutes.length > 0) {
            this.renderAlternateRoutes(metrics.alternateRoutes);
        }
        console.log('');
    }
    displaySystemConfidence(confidence) {
        const confidenceColor = confidence.finalConfidence > 99.9 ? this.COLORS.SUCCESS_GREEN :
            confidence.finalConfidence >= 95.0 ? this.COLORS.WARNING_ORANGE :
                this.COLORS.ERROR_RED;
        console.log(`   System Confidence: ${confidenceColor}${confidence.displayFormat}${this.COLORS.RESET}`);
        console.log(this.COLORS.DIM + `   Baseline Accuracy: ${confidence.baselineAccuracy}% (1 error in 16 million)` + this.COLORS.RESET);
    }
    showComplexityRating(score) {
        const ratingColor = score.rating === 'LOW' ? this.COLORS.SUCCESS_GREEN :
            score.rating === 'MEDIUM' ? this.COLORS.WARNING_ORANGE :
                this.COLORS.ERROR_RED;
        console.log(`   Complexity Rating: ${ratingColor}${score.rating}${this.COLORS.RESET} (Score: ${score.score})`);
        console.log(this.COLORS.DIM + `   Calculation: ${score.calculation}` + this.COLORS.RESET);
    }
    displayThresholdStatus(status) {
        let statusColor;
        let statusIcon;
        switch (status.status) {
            case 'OPTIMAL ROUTE':
                statusColor = this.COLORS.SUCCESS_GREEN;
                statusIcon = '✅';
                break;
            case 'MONITORING ACTIVE (Delay Possible)':
                statusColor = this.COLORS.WARNING_ORANGE;
                statusIcon = '⚠️';
                break;
            case 'JUGAAD PROTOCOL INITIATED (Critical Delay)':
                statusColor = this.COLORS.ERROR_RED;
                statusIcon = '🚨';
                break;
            default:
                statusColor = this.COLORS.DIM;
                statusIcon = 'ℹ️';
        }
        console.log(`   Status: ${statusIcon} ${statusColor}${status.message}${this.COLORS.RESET}`);
    }
    displayDegradationFactors(factors) {
        const activeFactors = factors.filter(factor => factor.isActive);
        if (activeFactors.length > 0) {
            console.log(`   ${this.COLORS.WARNING_ORANGE}Active Degradation Factors:${this.COLORS.RESET}`);
            activeFactors.forEach(factor => {
                console.log(`     ${this.COLORS.ERROR_RED}⚠️  ${factor.type}: -${factor.impact.toFixed(4)}%${this.COLORS.RESET}`);
                console.log(this.COLORS.DIM + `        ${factor.description}` + this.COLORS.RESET);
            });
        }
        else {
            console.log(`   ${this.COLORS.SUCCESS_GREEN}✅ No active degradation factors${this.COLORS.RESET}`);
        }
    }
    renderAlternateRoutes(alternatives) {
        console.log(`   ${this.COLORS.STATION_BLUE}Suggested Alternate Routes:${this.COLORS.RESET}`);
        alternatives.forEach((alt, index) => {
            console.log(`     ${index + 1}. ${alt.description}`);
            console.log(this.COLORS.DIM + `        Node: ${alt.alternateNode}` + this.COLORS.RESET);
            console.log(this.COLORS.SUCCESS_GREEN + `        Improvement: +${alt.expectedImprovement}%` + this.COLORS.RESET);
            console.log(this.COLORS.DIM + `        Reason: ${alt.reasoning}` + this.COLORS.RESET);
        });
    }
    // Environmental factors display
    displayEnvironmentalFactors(factors) {
        console.log(this.COLORS.STATION_BLUE + '🌦️ ENVIRONMENTAL FACTORS:' + this.COLORS.RESET);
        if (factors.monsoonMode) {
            console.log(`   ${this.COLORS.WARNING_ORANGE}🌧️  Monsoon Mode: ACTIVE${this.COLORS.RESET}`);
            if (factors.rainfallKurla > 0) {
                console.log(`   ${this.COLORS.DIM}   Kurla Rainfall: ${factors.rainfallKurla}mm${this.COLORS.RESET}`);
            }
            if (factors.rainfallParel > 0) {
                console.log(`   ${this.COLORS.DIM}   Parel Rainfall: ${factors.rainfallParel}mm${this.COLORS.RESET}`);
            }
        }
        else {
            console.log(`   ${this.COLORS.SUCCESS_GREEN}☀️  Weather: CLEAR${this.COLORS.RESET}`);
        }
        if (factors.isWesternToCentralCrossing) {
            console.log(`   ${this.COLORS.WARNING_ORANGE}🚇 Dadar Penalty: ACTIVE (Western-Central crossing)${this.COLORS.RESET}`);
        }
        const currentHour = factors.currentTime.getHours();
        const currentMinute = factors.currentTime.getMinutes();
        const isPeakHour = (currentHour === 10 && currentMinute >= 15) || (currentHour === 11 && currentMinute <= 30);
        if (isPeakHour) {
            console.log(`   ${this.COLORS.ERROR_RED}⏰ Peak Hour Jitter: ACTIVE (10:15-11:30 AM)${this.COLORS.RESET}`);
        }
        console.log('');
    }
    handleSystemCommands(input) {
        const command = input.toLowerCase();
        switch (command) {
            case 'help':
                this.displayUsageInstructions();
                this.rl.prompt();
                return true;
            case 'status':
                this.displaySystemStatus();
                this.rl.prompt();
                return true;
            case 'grid':
                const sampleSymbols = [
                    { type: 'color', value: 'Red', display: 'Red' },
                    { type: 'color', value: 'Blue', display: 'Blue' },
                    { type: 'color', value: 'Green', display: 'Green' },
                    { type: 'symbol', value: 'Circle', display: '○' },
                    { type: 'symbol', value: 'Triangle', display: '△' },
                    { type: 'symbol', value: 'Square', display: '□' },
                    { type: 'station', value: 'VLP', display: 'VLP' },
                    { type: 'station', value: 'DDR', display: 'DDR' },
                    { type: 'station', value: 'BKC', display: 'BKC' }
                ];
                this.handleSymbolGrid(sampleSymbols);
                this.rl.prompt();
                return true;
            case 'metrics':
                this.displayReliabilityInfo();
                this.rl.prompt();
                return true;
            case 'clear':
                this.clearScreen();
                this.displayDashboard();
                return true;
            case 'exit':
            case 'quit':
                this.stop();
                return true;
            default:
                return false;
        }
    }
    displayReliabilityInfo() {
        console.log(this.COLORS.SUBWAY_YELLOW + this.COLORS.BOLD);
        console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
        console.log('║                        SIX-SIGMA RELIABILITY METRICS                        ║');
        console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
        console.log(this.COLORS.RESET);
        console.log(this.COLORS.STATION_BLUE + 'COMPLEXITY SCORING:' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + '  Base Hop (Collection → Local Station): Weight 0.1' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + '  Transit Hop (Local Train → Sorting Hub): Weight 0.2' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + '  Transfer Hop (Dadar Interface Cross-line): Weight 0.5' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + '  Final Hop (Sorting Hub → Destination): Weight 0.1' + this.COLORS.RESET);
        console.log('');
        console.log(this.COLORS.STATION_BLUE + 'COMPLEXITY RATINGS:' + this.COLORS.RESET);
        console.log(this.COLORS.SUCCESS_GREEN + '  LOW (0.1-0.4): Direct Route' + this.COLORS.RESET);
        console.log(this.COLORS.WARNING_ORANGE + '  MEDIUM (0.5-0.8): Inter-station Sorting' + this.COLORS.RESET);
        console.log(this.COLORS.ERROR_RED + '  HIGH (0.9+): Cross-line Transfer / Multi-hub' + this.COLORS.RESET);
        console.log('');
        console.log(this.COLORS.STATION_BLUE + 'RELIABILITY THRESHOLDS:' + this.COLORS.RESET);
        console.log(this.COLORS.SUCCESS_GREEN + '  > 99.9%: OPTIMAL ROUTE' + this.COLORS.RESET);
        console.log(this.COLORS.WARNING_ORANGE + '  95%-99.8%: MONITORING ACTIVE (Delay Possible)' + this.COLORS.RESET);
        console.log(this.COLORS.ERROR_RED + '  < 95%: JUGAAD PROTOCOL INITIATED (Critical Delay)' + this.COLORS.RESET);
        console.log('');
        console.log(this.COLORS.STATION_BLUE + 'DEGRADATION FACTORS:' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + '  Dadar Penalty: -0.0001% (Western-Central crossing)' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + '  Peak Hour Jitter: Variable (10:15-11:30 AM)' + this.COLORS.RESET);
        console.log(this.COLORS.DIM + '  Rain Variable: -2% per 10mm at Kurla/Parel nodes' + this.COLORS.RESET);
        console.log('');
    }
}
exports.TerminalInterface = TerminalInterface;
//# sourceMappingURL=TerminalInterface.js.map