// Network Router Engine for Bambaiyya-Binary Logistics Decoder
// Core parsing and routing logic for delivery markers

import { 
  NetworkRouter as INetworkRouter,
  ParsedMarker,
  RoutingPath,
  ValidationResult,
  TimingConstraints,
  ProcessedInput
} from '../interfaces';
import { 
  ValidationError, 
  StationInfo, 
  SymbolInfo, 
  ColorInfo,
  DestinationType,
  PriorityLevel,
  RouteSegment,
  EnvironmentalFactors
} from '../models';
import { ProtocolKnowledgeBase } from './ProtocolKnowledgeBase';
import { ReliabilityMetricsEngine } from './ReliabilityMetricsEngine';
import { MumbaiSlangProcessor } from './MumbaiSlangProcessor';

export class NetworkRouter implements INetworkRouter {
  private protocolKB: ProtocolKnowledgeBase;
  private reliabilityEngine: ReliabilityMetricsEngine;

  constructor(protocolKnowledgeBase: ProtocolKnowledgeBase) {
    this.protocolKB = protocolKnowledgeBase;
    this.reliabilityEngine = new ReliabilityMetricsEngine();
  }

  parseDeliveryMarker(marker: string): ParsedMarker {
    console.log(`🔍 Parsing delivery marker: "${marker}"`);
    
    try {
      // Handle Mumbai slang preprocessing
      const processedInput = this.handleMumbaiSlang(marker);
      const cleanMarker = processedInput.processedInput;
      
      // Parse the marker string into components
      const components = this.extractMarkerComponents(cleanMarker);
      
      if (!components) {
        return this.createInvalidMarker('Invalid marker format. Expected: "Color Symbol - Station - Sequence"');
      }
      
      const { color, symbol, stationCode, sequence } = components;
      
      // Look up each component in the protocol
      const colorInfo = this.protocolKB.getColorByName(color);
      const symbolInfo = this.protocolKB.getSymbolByShape(symbol);
      const stationInfo = this.protocolKB.getStationByCode(stationCode);
      
      // Collect validation errors
      const errors: ValidationError[] = [];
      
      if (!colorInfo) {
        errors.push({
          component: 'color',
          message: `Unknown color: ${color}`,
          suggestions: this.protocolKB.getAllColorNames()
        });
      }
      
      if (!symbolInfo) {
        errors.push({
          component: 'symbol',
          message: `Unknown symbol: ${symbol}`,
          suggestions: this.protocolKB.getAllSymbolShapes()
        });
      }
      
      if (!stationInfo) {
        errors.push({
          component: 'station',
          message: `Unknown station code: ${stationCode}`,
          suggestions: this.getClosestStationCodes(stationCode)
        });
      }
      
      if (sequence < 1 || sequence > 999) {
        errors.push({
          component: 'sequence',
          message: `Invalid sequence number: ${sequence}. Must be between 1-999`,
          suggestions: ['Use a number between 1 and 999']
        });
      }
      
      const isValid = errors.length === 0;
      
      const parsedMarker: ParsedMarker = {
        color: colorInfo || this.createDefaultColorInfo(color),
        symbol: symbolInfo || this.createDefaultSymbolInfo(symbol),
        station: stationInfo || this.createDefaultStationInfo(stationCode),
        sequence,
        isValid,
        errors
      };
      
      if (isValid) {
        console.log(`✅ Marker parsed successfully: ${color} ${symbol} at ${stationInfo?.fullName}`);
      } else {
        console.log(`❌ Marker parsing failed with ${errors.length} errors`);
      }
      
      return parsedMarker;
      
    } catch (error) {
      console.error('❌ Marker parsing error:', error);
      return this.createInvalidMarker(`Parsing error: ${error}`);
    }
  }

  private extractMarkerComponents(marker: string): {
    color: string;
    symbol: string;
    stationCode: string;
    sequence: number;
  } | null {
    // Support multiple formats:
    // "Red Triangle - VLP - 4"
    // "Red Triangle VLP 4"
    // "Red-Triangle-VLP-4"
    
    // Normalize the marker string
    const normalized = marker.trim()
      .replace(/\s*-\s*/g, ' ')  // Replace " - " with " "
      .replace(/[-_]/g, ' ')     // Replace - and _ with spaces
      .replace(/\s+/g, ' ');     // Collapse multiple spaces
    
    // Try different parsing patterns
    const patterns = [
      // Pattern 1: "Color Symbol Station Sequence"
      /^(\w+)\s+(\w+)\s+([A-Z]{3})\s+(\d+)$/i,
      // Pattern 2: "Color Symbol Station" (sequence defaults to 1)
      /^(\w+)\s+(\w+)\s+([A-Z]{3})$/i,
      // Pattern 3: More flexible with optional punctuation
      /^(\w+)[\s\-]*(\w+)[\s\-]*([A-Z]{2,4})[\s\-]*(\d+)?$/i
    ];
    
    for (const pattern of patterns) {
      const match = normalized.match(pattern);
      if (match) {
        const [, color, symbol, stationCode, sequenceStr] = match;
        const sequence = sequenceStr ? parseInt(sequenceStr, 10) : 1;
        
        return {
          color: color.trim(),
          symbol: symbol.trim(),
          stationCode: stationCode.toUpperCase().trim(),
          sequence
        };
      }
    }
    
    return null;
  }

  validateMarkerComponents(marker: ParsedMarker): ValidationResult {
    const errors: ValidationError[] = [...marker.errors];
    
    // Additional validation logic can be added here
    // For example, checking business rules, timing constraints, etc.
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  generateRoutingPath(parsed: ParsedMarker): RoutingPath {
    if (!parsed.isValid) {
      throw new Error('Cannot generate routing path for invalid marker');
    }
    
    console.log(`🗺️ Generating routing path for ${parsed.color.name} ${parsed.symbol.shape} to ${parsed.station.fullName}`);
    
    // Calculate timing based on Dadar sorting hub
    const timing = this.calculateTiming(parsed);
    
    // Generate route segments
    const routeSegments = this.generateRouteSegments(parsed.station);
    
    // Create base routing path
    const baseRoutingPath: RoutingPath = {
      origin: this.getDadarStation(), // All routes originate from collection points but go through Dadar
      destination: parsed.station,
      destinationType: parsed.symbol.destinationType,
      priority: parsed.color.priority,
      sortingHub: 'Dadar',
      collectionTime: timing.collectionWindow.start,
      sortingTime: this.protocolKB.getSortingHubTime(),
      deliveryTime: timing.deliveryWindow.start,
      route: routeSegments,
      networkHops: [], // Will be populated by reliability engine
      complexityScore: {} as any, // Will be populated by reliability engine
      systemConfidence: {} as any, // Will be populated by reliability engine
      reliabilityMetrics: {} as any // Will be populated by reliability engine
    };
    
    // Create environmental factors for reliability calculation
    const environmentalFactors: EnvironmentalFactors = {
      currentTime: new Date(),
      monsoonMode: this.isMonsoonSeason(),
      rainfallKurla: this.getCurrentRainfall('Kurla'),
      rainfallParel: this.getCurrentRainfall('Parel'),
      isWesternToCentralCrossing: this.isWesternToCentralRoute(baseRoutingPath)
    };
    
    // Generate comprehensive reliability metrics
    const reliabilityMetrics = this.reliabilityEngine.generateReliabilityMetrics(
      baseRoutingPath, 
      environmentalFactors
    );
    
    // Update routing path with reliability data
    const routingPath: RoutingPath = {
      ...baseRoutingPath,
      networkHops: reliabilityMetrics.complexityScore.hops,
      complexityScore: reliabilityMetrics.complexityScore,
      systemConfidence: reliabilityMetrics.systemConfidence,
      reliabilityMetrics: reliabilityMetrics
    };
    
    console.log(`✅ Routing path generated with reliability metrics:`);
    console.log(`   Route: ${routingPath.origin.fullName} → ${routingPath.sortingHub} → ${routingPath.destination.fullName}`);
    console.log(`   Complexity: ${reliabilityMetrics.complexityScore.rating} (${reliabilityMetrics.complexityScore.score})`);
    console.log(`   Confidence: ${reliabilityMetrics.systemConfidence.displayFormat}`);
    console.log(`   Status: ${reliabilityMetrics.thresholdStatus.message}`);
    console.log(`   Hop Count: ${reliabilityMetrics.hopCount}`);
    
    return routingPath;
  }

  calculateTiming(parsed: ParsedMarker): TimingConstraints {
    // Base timing on Dadar sorting hub at 10:30 AM
    const sortingTime = new Date();
    sortingTime.setHours(10, 30, 0, 0);
    
    // Collection window ends 15 minutes before sorting
    const collectionEnd = new Date(sortingTime.getTime() - 15 * 60 * 1000);
    const collectionStart = new Date(collectionEnd.getTime() - 90 * 60 * 1000); // 90 minute collection window
    
    // Delivery window starts 45 minutes after sorting (includes dispatch time)
    const deliveryStart = new Date(sortingTime.getTime() + 45 * 60 * 1000);
    
    // Delivery window duration based on priority and zone
    let deliveryDurationMinutes = 90; // Standard delivery window
    
    if (parsed.color.priority === PriorityLevel.URGENT) {
      deliveryDurationMinutes = 60; // Urgent deliveries have shorter window
    } else if (parsed.station.zone === 'Zone 3') {
      deliveryDurationMinutes = 120; // Outer zones get longer window
    }
    
    const deliveryEnd = new Date(deliveryStart.getTime() + deliveryDurationMinutes * 60 * 1000);
    
    return {
      collectionWindow: {
        start: this.formatTime(collectionStart),
        end: this.formatTime(collectionEnd)
      },
      sortingTime: this.protocolKB.getSortingHubTime(),
      deliveryWindow: {
        start: this.formatTime(deliveryStart),
        end: this.formatTime(deliveryEnd)
      }
    };
  }

  handleMumbaiSlang(input: string): ProcessedInput {
    // Use the MumbaiSlangProcessor for comprehensive processing
    const slangProcessor = new MumbaiSlangProcessor(this.protocolKB);
    const result = slangProcessor.processInput(input);
    
    return {
      originalInput: result.originalInput,
      processedInput: result.processedInput,
      slangDetected: result.slangDetected,
      expansions: result.expansions
    };
  }

  private createInvalidMarker(errorMessage: string): ParsedMarker {
    return {
      color: this.createDefaultColorInfo('Unknown'),
      symbol: this.createDefaultSymbolInfo('Unknown'),
      station: this.createDefaultStationInfo('UNK'),
      sequence: 0,
      isValid: false,
      errors: [{
        component: 'format',
        message: errorMessage,
        suggestions: ['Use format: "Color Symbol - Station - Sequence"', 'Example: "Red Triangle - VLP - 4"']
      }]
    };
  }

  private createDefaultColorInfo(color: string): ColorInfo {
    return {
      name: color,
      priority: PriorityLevel.STANDARD,
      areaType: 'Unknown',
      hexCode: '#808080'
    };
  }

  private createDefaultSymbolInfo(symbol: string): SymbolInfo {
    return {
      shape: symbol,
      destinationType: DestinationType.INDUSTRIAL_ESTATE,
      description: 'Unknown symbol type'
    };
  }

  private createDefaultStationInfo(code: string): StationInfo {
    return {
      code,
      fullName: 'Unknown Station',
      area: 'Unknown Area',
      zone: 'Zone 1',
      coordinates: { lat: 19.0760, lng: 72.8777 }
    };
  }

  private getClosestStationCodes(input: string): string[] {
    const allCodes = this.protocolKB.getAllStationCodes();
    
    // Simple string similarity matching
    const suggestions = allCodes
      .map(code => ({
        code,
        similarity: this.calculateStringSimilarity(input.toUpperCase(), code)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map(item => item.code);
    
    return suggestions;
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    // Simple Levenshtein distance-based similarity
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private getDadarStation(): StationInfo {
    const dadar = this.protocolKB.getStationByCode('DDR');
    if (!dadar) {
      throw new Error('Dadar sorting hub not found in protocol');
    }
    return dadar;
  }

  private generateRouteSegments(destination: StationInfo): RouteSegment[] {
    // Generate route segments from Dadar to destination
    // This is a simplified implementation - in reality this would use actual railway network data
    
    const segments: RouteSegment[] = [];
    
    // Add segment from Dadar to destination
    segments.push({
      from: 'Dadar (DDR)',
      to: `${destination.fullName} (${destination.code})`,
      mode: this.determineTransportMode(destination),
      duration: this.calculateTravelTime(destination),
      distance: this.calculateDistance(destination)
    });
    
    return segments;
  }

  private determineTransportMode(destination: StationInfo): string {
    // Determine transport mode based on destination area
    if (destination.area.includes('Western')) return 'Western Railway';
    if (destination.area.includes('Central')) return 'Central Railway';
    if (destination.area.includes('Harbour')) return 'Harbour Line';
    return 'Local Transport';
  }

  private calculateTravelTime(destination: StationInfo): number {
    // Calculate travel time based on zone (simplified)
    switch (destination.zone) {
      case 'Zone 1': return 15; // 15 minutes
      case 'Zone 2': return 30; // 30 minutes
      case 'Zone 3': return 45; // 45 minutes
      default: return 30;
    }
  }

  private calculateDistance(destination: StationInfo): number {
    // Calculate approximate distance based on zone (simplified)
    switch (destination.zone) {
      case 'Zone 1': return 5;  // 5 km
      case 'Zone 2': return 15; // 15 km
      case 'Zone 3': return 25; // 25 km
      default: return 15;
    }
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  // Helper methods for environmental factors
  private isMonsoonSeason(): boolean {
    const currentMonth = new Date().getMonth(); // 0-11
    // Monsoon season in Mumbai: June (5) to September (8)
    return currentMonth >= 5 && currentMonth <= 8;
  }

  private getCurrentRainfall(location: 'Kurla' | 'Parel'): number {
    // In a real implementation, this would fetch actual weather data
    // For now, return simulated rainfall based on monsoon season
    if (!this.isMonsoonSeason()) return 0;
    
    // Simulate rainfall data (0-50mm)
    const baseRainfall = Math.random() * 50;
    
    // Kurla typically gets slightly more rainfall than Parel
    if (location === 'Kurla') {
      return Math.round(baseRainfall * 1.1);
    } else {
      return Math.round(baseRainfall);
    }
  }

  private isWesternToCentralRoute(route: RoutingPath): boolean {
    const originArea = route.origin.area.toLowerCase();
    const destinationArea = route.destination.area.toLowerCase();
    
    const isOriginWestern = originArea.includes('western');
    const isDestinationCentral = destinationArea.includes('central');
    
    const isOriginCentral = originArea.includes('central');
    const isDestinationWestern = destinationArea.includes('western');
    
    return (isOriginWestern && isDestinationCentral) || (isOriginCentral && isDestinationWestern);
  }
}