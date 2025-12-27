// Bambaiyya-Binary Logistics Decoder
// Gold Tier Terminal for the Dabbawala Network

import { ProtocolKnowledgeBase, NetworkRouter } from './services';
import { TerminalInterface } from './components';

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
    const protocolKB = new ProtocolKnowledgeBase();
    await protocolKB.initialize();
    
    // Validate protocol completeness
    const validation = protocolKB.validateProtocolCompleteness();
    if (!validation.isValid) {
      console.error('❌ Protocol validation failed:');
      validation.errors.forEach(error => console.error(`   ${error}`));
      process.exit(1);
    }
    
    // Initialize Network Router
    const networkRouter = new NetworkRouter(protocolKB);
    
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
    const terminal = new TerminalInterface(networkRouter);
    
    console.log('🎯 System ready for packet routing operations.');
    console.log('   Dadar Sorting Hub synchronized at', protocolKB.getSortingHubTime());
    console.log('   Network Router operational with Mumbai terminology support');
    console.log('');
    
    // Start the interactive terminal
    terminal.start();
    
  } catch (error) {
    console.error('❌ System initialization failed:', error);
    process.exit(1);
  }
}

// Start the application
if (require.main === module) {
  main().catch(console.error);
}

export * from './models';
export * from './services';
export * from './parsers';
export * from './components';