"use strict";
// Bambaiyya-Binary Logistics Decoder
// Gold Tier Terminal for the Dabbawala Network
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("./services");
const components_1 = require("./components");
console.log('🚂 Bambaiyya-Binary Logistics Decoder v1.0.0');
console.log('   Terminal for the Dabbawala Network');
console.log('   Digitizing 130 years of Mumbai delivery excellence');
console.log('');
// Main application entry point
async function main() {
    try {
        console.log('Initializing Network Router...');
        // Initialize Protocol Knowledge Base
        console.log('Loading Binary Protocol...');
        const protocolKB = new services_1.ProtocolKnowledgeBase();
        await protocolKB.initialize();
        // Validate protocol completeness
        const validation = protocolKB.validateProtocolCompleteness();
        if (!validation.isValid) {
            console.error('❌ Protocol validation failed:');
            validation.errors.forEach(error => console.error(`   ${error}`));
            process.exit(1);
        }
        // Initialize Network Router
        const networkRouter = new services_1.NetworkRouter(protocolKB);
        // Display protocol statistics
        const stats = protocolKB.getProtocolStats();
        console.log('📊 Protocol Statistics:');
        console.log(`   Stations: ${stats.stations}`);
        console.log(`   Symbols: ${stats.symbols}`);
        console.log(`   Colors: ${stats.colors}`);
        console.log(`   Slang Terms: ${stats.slangTerms}`);
        console.log(`   Timing Rules: ${stats.timingRules}`);
        console.log('');
        console.log('Starting Terminal Interface...');
        // Initialize and start Terminal Interface
        const terminal = new components_1.TerminalInterface(networkRouter);
        console.log('🎯 System ready for packet routing operations.');
        console.log('   Dadar Sorting Hub synchronized at', protocolKB.getSortingHubTime());
        console.log('   Network Router operational with Mumbai terminology support');
        console.log('');
        // Start the interactive terminal
        terminal.start();
    }
    catch (error) {
        console.error('❌ System initialization failed:', error);
        process.exit(1);
    }
}
// Start the application
if (require.main === module) {
    main().catch(console.error);
}
__exportStar(require("./models"), exports);
__exportStar(require("./services"), exports);
__exportStar(require("./parsers"), exports);
__exportStar(require("./components"), exports);
//# sourceMappingURL=index.js.map