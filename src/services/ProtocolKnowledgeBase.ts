// Protocol Knowledge Base Service for Bambaiyya-Binary Logistics Decoder
// Manages loading, caching, and accessing protocol configuration data

import { 
  ProtocolKnowledgeBase as IProtocolKnowledgeBase,
  StationInfo,
  SymbolInfo,
  ColorInfo,
  TimingRule
} from '../interfaces';
import { BinaryProtocolParser } from '../parsers/BinaryProtocolParser';
import { ProtocolData, DestinationType, PriorityLevel } from '../models';

export class ProtocolKnowledgeBase implements IProtocolKnowledgeBase {
  private parser: BinaryProtocolParser;
  private protocolData: ProtocolData | null = null;
  private stationCodesMap: Map<string, StationInfo> = new Map();
  private symbolLogicMap: Map<string, SymbolInfo> = new Map();
  private colorSpectrumMap: Map<string, ColorInfo> = new Map();
  private timingConstraints: TimingRule[] = [];
  private isLoaded: boolean = false;

  constructor(protocolFilePath?: string) {
    this.parser = new BinaryProtocolParser(protocolFilePath);
  }

  async initialize(): Promise<void> {
    await this.loadProtocolData();
  }

  private async loadProtocolData(): Promise<void> {
    try {
      this.protocolData = await this.parser.parseProtocolFile();
      this.buildMaps();
      this.isLoaded = true;
      console.log('✅ Binary Protocol loaded successfully');
      console.log(`   Stations: ${this.stationCodesMap.size}`);
      console.log(`   Symbols: ${this.symbolLogicMap.size}`);
      console.log(`   Colors: ${this.colorSpectrumMap.size}`);
      console.log(`   Slang terms: ${this.protocolData.mumbaiSlang.length}`);
    } catch (error) {
      console.error('❌ Failed to load Binary Protocol:', error);
      throw error;
    }
  }

  private buildMaps(): void {
    if (!this.protocolData) return;

    // Build station codes map
    this.stationCodesMap.clear();
    for (const station of this.protocolData.stationCodes) {
      const stationInfo: StationInfo = {
        code: station.code,
        fullName: station.fullName,
        area: station.area,
        zone: station.zone,
        coordinates: this.getStationCoordinates(station.code) // Mock coordinates for now
      };
      this.stationCodesMap.set(station.code, stationInfo);
      
      // Also map aliases to the same station
      for (const alias of station.aliases) {
        this.stationCodesMap.set(alias.toUpperCase(), stationInfo);
      }
    }

    // Build symbol logic map
    this.symbolLogicMap.clear();
    for (const symbol of this.protocolData.symbolLogic) {
      const symbolInfo: SymbolInfo = {
        shape: symbol.shape,
        destinationType: symbol.destinationType,
        description: symbol.description
      };
      this.symbolLogicMap.set(symbol.shape.toLowerCase(), symbolInfo);
      
      // Map common symbol representations
      const symbolMappings = this.getSymbolMappings(symbol.shape);
      for (const mapping of symbolMappings) {
        this.symbolLogicMap.set(mapping, symbolInfo);
      }
    }

    // Build color spectrum map
    this.colorSpectrumMap.clear();
    for (const color of this.protocolData.colorSpectrum) {
      const colorInfo: ColorInfo = {
        name: color.color,
        priority: color.priority,
        areaType: color.areaType,
        hexCode: color.hexCode
      };
      this.colorSpectrumMap.set(color.color.toLowerCase(), colorInfo);
    }

    // Store timing constraints
    this.timingConstraints = [...this.protocolData.timingConstraints];
  }

  loadStationCodes(): Map<string, StationInfo> {
    this.ensureLoaded();
    return new Map(this.stationCodesMap);
  }

  getSymbolLogic(): Map<string, SymbolInfo> {
    this.ensureLoaded();
    return new Map(this.symbolLogicMap);
  }

  getColorSpectrum(): Map<string, ColorInfo> {
    this.ensureLoaded();
    return new Map(this.colorSpectrumMap);
  }

  getTimingConstraints(): TimingRule[] {
    this.ensureLoaded();
    return [...this.timingConstraints];
  }

  async reloadProtocol(): Promise<void> {
    console.log('🔄 Reloading Binary Protocol...');
    const oldStationCount = this.stationCodesMap.size;
    const oldSymbolCount = this.symbolLogicMap.size;
    const oldColorCount = this.colorSpectrumMap.size;
    
    await this.loadProtocolData();
    
    // Report changes
    const newStationCount = this.stationCodesMap.size;
    const newSymbolCount = this.symbolLogicMap.size;
    const newColorCount = this.colorSpectrumMap.size;
    
    if (oldStationCount !== newStationCount || oldSymbolCount !== newSymbolCount || oldColorCount !== newColorCount) {
      console.log('📊 Protocol changes detected:');
      if (oldStationCount !== newStationCount) {
        console.log(`   Stations: ${oldStationCount} → ${newStationCount}`);
      }
      if (oldSymbolCount !== newSymbolCount) {
        console.log(`   Symbols: ${oldSymbolCount} → ${newSymbolCount}`);
      }
      if (oldColorCount !== newColorCount) {
        console.log(`   Colors: ${oldColorCount} → ${newColorCount}`);
      }
    } else {
      console.log('✅ Protocol reloaded - no structural changes detected');
    }
  }

  // Helper methods for protocol access
  getStationByCode(code: string): StationInfo | undefined {
    this.ensureLoaded();
    return this.stationCodesMap.get(code.toUpperCase());
  }

  getSymbolByShape(shape: string): SymbolInfo | undefined {
    this.ensureLoaded();
    return this.symbolLogicMap.get(shape.toLowerCase());
  }

  getColorByName(color: string): ColorInfo | undefined {
    this.ensureLoaded();
    return this.colorSpectrumMap.get(color.toLowerCase());
  }

  getSortingHubTime(): string {
    this.ensureLoaded();
    const sortingRule = this.timingConstraints.find(rule => rule.phase === 'Sorting');
    const fullTime = sortingRule?.standardTime || '10:30 AM';
    
    // Extract just the time part, removing any additional text in parentheses
    return fullTime.replace(/\s*\([^)]*\)/, '');
  }

  getMumbaiSlang(): any[] {
    this.ensureLoaded();
    return this.protocolData?.mumbaiSlang || [];
  }

  getAllStationCodes(): string[] {
    this.ensureLoaded();
    return Array.from(new Set(
      Array.from(this.stationCodesMap.keys()).filter(key => key.length === 3)
    ));
  }

  getAllSymbolShapes(): string[] {
    this.ensureLoaded();
    return Array.from(new Set(
      Array.from(this.symbolLogicMap.values()).map(symbol => symbol.shape)
    ));
  }

  getAllColorNames(): string[] {
    this.ensureLoaded();
    return Array.from(new Set(
      Array.from(this.colorSpectrumMap.values()).map(color => color.name)
    ));
  }

  // Validation methods
  validateProtocolCompleteness(): { isValid: boolean; errors: string[] } {
    this.ensureLoaded();
    const errors: string[] = [];
    
    // Check minimum requirements from spec
    if (this.getAllStationCodes().length < 15) {
      errors.push(`Insufficient station codes: ${this.getAllStationCodes().length} (minimum 15 required)`);
    }
    
    if (this.getAllSymbolShapes().length < 5) {
      errors.push(`Insufficient symbol definitions: ${this.getAllSymbolShapes().length} (minimum 5 required)`);
    }
    
    // Check for required Dadar sorting hub
    const dadarStation = this.getStationByCode('DDR');
    if (!dadarStation) {
      errors.push('Missing required Dadar (DDR) sorting hub station');
    }
    
    // Check for sorting time configuration
    const sortingTime = this.getSortingHubTime();
    if (!sortingTime || sortingTime === '10:30 AM') {
      // This is actually correct, but let's verify it's properly configured
      const sortingRule = this.timingConstraints.find(rule => rule.phase === 'Sorting');
      if (!sortingRule) {
        errors.push('Missing sorting time configuration');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  getProtocolStats(): { 
    stations: number; 
    symbols: number; 
    colors: number; 
    slangTerms: number;
    timingRules: number;
  } {
    this.ensureLoaded();
    return {
      stations: this.getAllStationCodes().length,
      symbols: this.getAllSymbolShapes().length,
      colors: this.getAllColorNames().length,
      slangTerms: this.getMumbaiSlang().length,
      timingRules: this.timingConstraints.length
    };
  }

  private ensureLoaded(): void {
    if (!this.isLoaded) {
      throw new Error('Protocol Knowledge Base not initialized. Call initialize() first.');
    }
  }

  private getStationCoordinates(stationCode: string): { lat: number; lng: number } {
    // Mock coordinates for Mumbai stations - in a real system these would be actual GPS coordinates
    const coordinates: { [key: string]: { lat: number; lng: number } } = {
      'VLP': { lat: 19.0990, lng: 72.8442 },
      'AND': { lat: 19.1197, lng: 72.8464 },
      'JOG': { lat: 19.1347, lng: 72.8478 },
      'GOR': { lat: 19.1544, lng: 72.8410 },
      'MAL': { lat: 19.1875, lng: 72.8489 },
      'BOR': { lat: 19.2307, lng: 72.8567 },
      'DDR': { lat: 19.0176, lng: 72.8562 },
      'KUR': { lat: 19.0728, lng: 72.8826 },
      'GHA': { lat: 19.0864, lng: 72.9081 },
      'VIK': { lat: 19.1076, lng: 72.9252 },
      'BHA': { lat: 19.1438, lng: 72.9394 },
      'CST': { lat: 18.9398, lng: 72.8355 },
      'BCL': { lat: 18.9690, lng: 72.8205 },
      'KIN': { lat: 19.0330, lng: 72.8569 },
      'CHU': { lat: 19.0546, lng: 72.8776 },
      'BKC': { lat: 19.0596, lng: 72.8656 },
      'NAR': { lat: 18.9067, lng: 72.8147 },
      'POW': { lat: 19.1197, lng: 72.9089 }
    };
    
    return coordinates[stationCode] || { lat: 19.0760, lng: 72.8777 }; // Default to Mumbai center
  }

  private getSymbolMappings(shape: string): string[] {
    // Map various representations of symbols to canonical shapes
    const mappings: { [key: string]: string[] } = {
      'Circle': ['circle', 'o', '○', 'round'],
      'Triangle': ['triangle', 'tri', '△', 'arrow'],
      'Square': ['square', 'box', '□', 'rect'],
      'Diamond': ['diamond', 'rhombus', '◇', 'lozenge'],
      'Star': ['star', '★', 'asterisk', '*']
    };
    
    return mappings[shape] || [shape.toLowerCase()];
  }
}