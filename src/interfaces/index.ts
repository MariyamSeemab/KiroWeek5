// Core Interfaces for Bambaiyya-Binary Logistics Decoder Components

import { 
  DeliveryMarker, 
  ParsedMarker, 
  RoutingPath, 
  ValidationError, 
  ProtocolData,
  StationInfo,
  SymbolInfo,
  ColorInfo,
  TimingRule,
  SlangMapping,
  StationMapping,
  SymbolDefinition,
  ColorRule
} from '../models';

// Terminal Interface Component
export interface TerminalInterface {
  displayDashboard(): void;
  processSymbolInput(marker: string): Promise<RoutingResult>;
  renderProgressPipeline(route: RoutingPath): void;
  handleSymbolGrid(symbols: DeliverySymbol[]): void;
  showErrorMessage(error: ValidationError): void;
}

// Network Router Engine
export interface NetworkRouter {
  parseDeliveryMarker(marker: string): ParsedMarker;
  generateRoutingPath(parsed: ParsedMarker): RoutingPath;
  validateMarkerComponents(marker: ParsedMarker): ValidationResult;
  calculateTiming(parsed: ParsedMarker): TimingConstraints;
  handleMumbaiSlang(input: string): ProcessedInput;
}

// Protocol Knowledge Base
export interface ProtocolKnowledgeBase {
  loadStationCodes(): Map<string, StationInfo>;
  getSymbolLogic(): Map<string, SymbolInfo>;
  getColorSpectrum(): Map<string, ColorInfo>;
  getTimingConstraints(): TimingRule[];
  reloadProtocol(): Promise<void>;
}

// Binary Protocol Parser
export interface BinaryProtocolParser {
  parseProtocolFile(filePath: string): Promise<ProtocolData>;
  extractStationMappings(content: string): StationMapping[];
  extractSymbolDefinitions(content: string): SymbolDefinition[];
  extractColorRules(content: string): ColorRule[];
  extractTimingRules(content: string): TimingRule[];
}

// Supporting Types
export interface RoutingResult {
  success: boolean;
  routingPath?: RoutingPath;
  error?: ValidationError;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface TimingConstraints {
  collectionWindow: TimeWindow;
  sortingTime: string;
  deliveryWindow: TimeWindow;
}

export interface TimeWindow {
  start: string;
  end: string;
}

export interface ProcessedInput {
  originalInput: string;
  processedInput: string;
  slangDetected: SlangMapping[];
  expansions: string[];
}

export interface DeliverySymbol {
  type: 'color' | 'symbol' | 'station';
  value: string;
  display: string;
}

// Import statements for external dependencies
// Re-export model types for convenience
export { 
  StationMapping, 
  SymbolDefinition, 
  ColorRule, 
  TimingRule, 
  SlangMapping,
  DeliveryMarker,
  ParsedMarker,
  RoutingPath,
  ValidationError,
  ProtocolData,
  StationInfo,
  SymbolInfo,
  ColorInfo,
  DestinationType,
  PriorityLevel
} from '../models';