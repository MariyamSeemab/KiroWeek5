# Design Document: Bambaiyya-Binary Logistics Decoder

## Overview

The Bambaiyya-Binary Logistics Decoder is a sophisticated terminal application that digitizes the Mumbai Dabbawala delivery network's 130-year-old routing system. The system operates as a deterministic Network Router, parsing visual delivery markers into complete routing paths using locally stored protocol definitions. The application emphasizes industrial aesthetics, offline operation, and authentic Mumbai terminology integration.

## Architecture

The system follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│           Terminal Interface            │
│    (Industrial UI/Railway Dashboard)    │
├─────────────────────────────────────────┤
│          Network Router Engine          │
│     (Parsing & Routing Logic)          │
├─────────────────────────────────────────┤
│         Protocol Knowledge Base         │
│      (Binary Protocol Parser)          │
├─────────────────────────────────────────┤
│           Local File System            │
│      (.kiro/binary_protocol.md)        │
└─────────────────────────────────────────┘
```

### Core Components

1. **Terminal Interface Layer**: Industrial-styled React/HTML interface with monospace fonts and railway aesthetics
2. **Network Router Engine**: Core parsing and routing logic that processes delivery markers
3. **Protocol Knowledge Base**: Configuration manager that loads and maintains routing rules
4. **Binary Protocol Parser**: File parser that interprets the markdown-based protocol definitions

## Components and Interfaces

### Terminal Interface Component - NOC Dashboard Architecture
```typescript
interface TerminalInterface {
  // Main Screen: Packet Decoder & Router
  displayMainDashboard(): void;
  renderSymbolInputGrid(symbols: DeliverySymbol[]): void;
  displayPipelineTrace(route: RoutingPath): void;
  showConsoleLog(parseResults: ParseResult[]): void;
  
  // Advanced Sidebar: System Modules
  toggleSidebar(module: SidebarModule): void;
  displayReliabilityAnalytics(metrics: ReliabilityMetrics): void;
  showJugaadConsole(errors: ErrorCorrection[]): void;
  renderNodeFinder(landmarks: LandmarkData[]): void;
  displayNetworkTopology(railwayLines: RailwayTopology): void;
  
  // Environment Footer: Global Constraints
  updateSystemClock(nextSyncWindow: Date): void;
  toggleMonsoonMode(active: boolean): void;
  displayNetworkHealth(healthPercentage: number): void;
  
  // Legacy methods for backward compatibility
  processSymbolInput(marker: string): RoutingResult;
  renderProgressPipeline(route: RoutingPath): void;
  handleSymbolGrid(symbols: DeliverySymbol[]): void;
  showErrorMessage(error: ValidationError): void;
  displayReliabilityMetrics(metrics: ReliabilityMetrics): void;
  showComplexityRating(score: ComplexityScore): void;
  displayThresholdStatus(status: ThresholdStatus): void;
  renderAlternateRoutes(alternatives: AlternateRoute[]): void;
}
```

### Network Router Engine
```typescript
interface NetworkRouter {
  parseDeliveryMarker(marker: string): ParsedMarker;
  generateRoutingPath(parsed: ParsedMarker): RoutingPath;
  validateMarkerComponents(marker: ParsedMarker): ValidationResult;
  calculateTiming(route: RoutingPath): TimingConstraints;
  handleMumbaiSlang(input: string): ProcessedInput;
  calculateComplexityScore(route: RoutingPath): ComplexityScore;
  calculateSystemConfidence(route: RoutingPath, environmental: EnvironmentalFactors): SystemConfidence;
  applyReliabilityDegradation(confidence: number, factors: ReliabilityFactors): number;
  determineReliabilityThreshold(confidence: number): ThresholdStatus;
  suggestAlternateRouting(route: RoutingPath): AlternateRoute[];
}
```

### Protocol Knowledge Base
```typescript
interface ProtocolKnowledgeBase {
  loadStationCodes(): Map<string, StationInfo>;
  getSymbolLogic(): Map<string, DestinationType>;
  getColorSpectrum(): Map<string, PriorityLevel>;
  getTimingConstraints(): TimingRules;
  reloadProtocol(): void;
}
```

### Binary Protocol Parser
```typescript
interface BinaryProtocolParser {
  parseProtocolFile(filePath: string): ProtocolData;
  extractStationMappings(content: string): StationMapping[];
  extractSymbolDefinitions(content: string): SymbolDefinition[];
  extractColorRules(content: string): ColorRule[];
  extractTimingRules(content: string): TimingRule[];
}
```

## Data Models

### Core Data Structures

```typescript
interface DeliveryMarker {
  color: string;           // Red, Green, Blue, Yellow, Orange
  symbol: string;          // Circle, Triangle, Square, Diamond, Star
  stationCode: string;     // VLP, BCL, DDR, etc.
  sequence: number;        // Delivery sequence number
}

interface ParsedMarker {
  color: ColorInfo;
  symbol: SymbolInfo;
  station: StationInfo;
  sequence: number;
  isValid: boolean;
  errors: ValidationError[];
}

interface RoutingPath {
  origin: StationInfo;
  destination: StationInfo;
  destinationType: DestinationType;
  priority: PriorityLevel;
  sortingHub: string;      // Always "Dadar"
  collectionTime: string;
  sortingTime: string;     // 10:30 AM
  deliveryTime: string;
  route: RouteSegment[];
  networkHops: NetworkHop[];
  complexityScore: ComplexityScore;
  systemConfidence: SystemConfidence;
  reliabilityMetrics: ReliabilityMetrics;
}

interface StationInfo {
  code: string;            // VLP
  fullName: string;        // Vile Parle
  area: string;            // Western Suburbs
  zone: string;            // Zone 2
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface SymbolInfo {
  shape: string;           // Circle, Triangle, etc.
  destinationType: DestinationType;
  description: string;
}

interface ColorInfo {
  name: string;            // Red
  priority: PriorityLevel;
  areaType: string;        // High-density, Suburban, etc.
  hexCode: string;         // #FF0000
}

enum DestinationType {
  INDUSTRIAL_ESTATE = "Industrial Estate",
  RESIDENTIAL_CHAWL = "Residential Chawl", 
  COMMERCIAL_COMPLEX = "Commercial Complex",
  GOVERNMENT_OFFICE = "Government Office",
  EDUCATIONAL_INSTITUTE = "Educational Institute"
}

enum PriorityLevel {
  HIGH = "High",
  MEDIUM = "Medium", 
  LOW = "Low",
  URGENT = "Urgent",
  STANDARD = "Standard"
}

interface NetworkHop {
  type: HopType;
  weight: number;
  description: string;
  station: StationInfo;
}

enum HopType {
  BASE_HOP = "Base Hop",           // Collection to Local Station (Weight: 0.1)
  TRANSIT_HOP = "Transit Hop",     // Local Train to Sorting Hub (Weight: 0.2)
  TRANSFER_HOP = "Transfer Hop",   // Dadar Interface Cross-line (Weight: 0.5)
  FINAL_HOP = "Final Hop"          // Sorting Hub to Destination (Weight: 0.1)
}

interface ComplexityScore {
  score: number;                   // Sum of (Weight * Hop_Type)
  rating: ComplexityRating;
  hops: NetworkHop[];
  calculation: string;             // Human-readable calculation breakdown
}

enum ComplexityRating {
  LOW = "LOW",                     // 0.1 - 0.4: Direct Route
  MEDIUM = "MEDIUM",               // 0.5 - 0.8: Inter-station Sorting
  HIGH = "HIGH"                    // 0.9+: Cross-line Transfer / Multi-hub
}

interface SystemConfidence {
  percentage: number;              // 99.999[X]% precision
  baselineAccuracy: number;        // 99.99999% (1 error in 16 million)
  degradationFactors: ReliabilityDegradationFactor[];
  finalConfidence: number;
  displayFormat: string;           // "99.999[X]%"
}

interface ReliabilityDegradationFactor {
  type: DegradationFactorType;
  impact: number;                  // Percentage reduction
  description: string;
  isActive: boolean;
}

enum DegradationFactorType {
  DADAR_PENALTY = "Dadar Penalty",           // 0.0001% for W-C crossing
  PEAK_HOUR_JITTER = "Peak Hour Jitter",    // 10:15-11:30 AM collision risk
  RAIN_VARIABLE = "Rain Variable"            // 2% per 10mm at Kurla/Parel
}

interface EnvironmentalFactors {
  currentTime: Date;
  monsoonMode: boolean;
  rainfallKurla: number;           // mm
  rainfallParel: number;           // mm
  isWesternToCentralCrossing: boolean;
}

interface ReliabilityMetrics {
  systemConfidence: SystemConfidence;
  hopCount: number;
  complexityScore: ComplexityScore;
  thresholdStatus: ThresholdStatus;
  alternateRoutes: AlternateRoute[];
}

interface ThresholdStatus {
  status: ReliabilityThreshold;
  message: string;
  color: string;                   // UI color coding
  actionRequired: boolean;
}

enum ReliabilityThreshold {
  OPTIMAL = "OPTIMAL ROUTE",                           // > 99.9%
  MONITORING = "MONITORING ACTIVE (Delay Possible)",  // 95% - 99.8%
  CRITICAL = "JUGAAD PROTOCOL INITIATED (Critical Delay)" // < 95%
}

interface AlternateRoute {
  description: string;
  alternateNode: string;           // e.g., "Parel-Node instead of Dadar"
  expectedImprovement: number;     // Confidence percentage improvement
  reasoning: string;
}
```

### Protocol Configuration Structure

```typescript
interface ProtocolData {
  stationCodes: StationMapping[];
  symbolLogic: SymbolDefinition[];
  colorSpectrum: ColorRule[];
  timingConstraints: TimingRule[];
  mumbaiSlang: SlangMapping[];
}

interface StationMapping {
  code: string;
  fullName: string;
  area: string;
  zone: string;
  aliases: string[];
}

interface SymbolDefinition {
  shape: string;
  destinationType: DestinationType;
  description: string;
  examples: string[];
}

interface ColorRule {
  color: string;
  priority: PriorityLevel;
  areaType: string;
  hexCode: string;
  description: string;
}

interface TimingRule {
  phase: string;           // Collection, Sorting, Delivery
  standardTime: string;
  constraints: string[];
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After reviewing all testable properties from the prework analysis, several redundancies were identified:

**Redundant Properties Identified:**
- Properties 2.2, 2.3, 5.3, and 5.4 all test consistent mapping behavior and can be combined into one comprehensive mapping consistency property
- Properties 6.1, 6.3, and 6.4 all test local-only operation and can be consolidated into one offline operation property
- Properties 1.5 and 5.2 both test Dadar timing integration and can be combined
- Properties 4.4 and 4.5 both test Mumbai terminology handling and can be merged
- Properties 7.5 and 9.1 both test confidence display formatting and can be combined
- Properties 8.5 and 9.3 both test complexity rating categorization and can be merged

**Consolidated Properties:**

Property 1: Delivery marker parsing completeness
*For any* valid delivery marker string, parsing should extract all component parts (color, symbol, station code, sequence) correctly
**Validates: Requirements 1.1**

Property 2: Component validation accuracy  
*For any* delivery marker components, validation should correctly identify valid components and reject invalid ones with specific error messages
**Validates: Requirements 1.2, 1.4**

Property 3: Routing path completeness
*For any* valid parsed marker, the generated routing path should contain all required fields (origin, destination type, priority, timing constraints)
**Validates: Requirements 1.3**

Property 4: Consistent mapping behavior
*For any* valid symbol or color input, the system should consistently map symbols to destination types and colors to priority levels across all operations
**Validates: Requirements 2.2, 2.3, 5.3, 5.4**

Property 5: Dadar timing integration
*For any* routing calculation, the system should incorporate the 10:30 AM Dadar Sorting Hub schedule as the reference point for all timing constraints
**Validates: Requirements 1.5, 5.2**

Property 6: UI input method availability
*For any* user interaction, the terminal interface should provide both text input and visual symbol grid input methods
**Validates: Requirements 3.2**

Property 7: Progress pipeline generation
*For any* routing path, the terminal interface should generate an appropriate progress pipeline display showing the packet journey timeline
**Validates: Requirements 3.3**

Property 8: Mumbai terminology handling
*For any* input containing Mumbai slang or local abbreviations, the system should recognize, interpret, and expand terminology appropriately in outputs
**Validates: Requirements 4.1, 4.4, 4.5**

Property 9: Deterministic routing behavior
*For any* delivery marker, processing the same marker multiple times should always generate identical routing paths
**Validates: Requirements 5.1**

Property 10: Output format consistency
*For any* routing description, the system should follow standardized format templates for consistent presentation
**Validates: Requirements 5.5**

Property 11: Offline operation capability
*For any* system operation, the Network Router should function entirely using local binary_protocol.md file data without requiring external network connections
**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

Property 12: Complexity score calculation accuracy
*For any* delivery marker with identifiable network hops, the calculated complexity score should equal the sum of (Weight × Hop_Type) using the defined weights (Base: 0.1, Transit: 0.2, Transfer: 0.5, Final: 0.1)
**Validates: Requirements 7.1**

Property 13: Dadar penalty application
*For any* route crossing from Western to Central lines through Dadar, the system should apply exactly 0.0001% reliability reduction
**Validates: Requirements 7.2**

Property 14: Peak hour degradation
*For any* route processed between 10:15 AM and 11:30 AM, the system should account for increased packet collision probability in reliability calculations
**Validates: Requirements 7.3**

Property 15: Monsoon reliability reduction
*For any* route when Monsoon_Mode is active, the system should reduce confidence by exactly 2% per 10mm of rainfall at Kurla/Parel nodes
**Validates: Requirements 7.4**

Property 16: Confidence display precision
*For any* system confidence value, the display format should show 99.999[X]% precision consistently
**Validates: Requirements 7.5, 9.1**

Property 17: Optimal threshold status
*For any* system confidence exceeding 99.9%, the system should display "OPTIMAL ROUTE" status
**Validates: Requirements 8.1**

Property 18: Monitoring threshold status
*For any* system confidence between 95% and 99.8%, the system should display "MONITORING ACTIVE (Delay Possible)" status
**Validates: Requirements 8.2**

Property 19: Critical threshold status
*For any* system confidence below 95%, the system should display "JUGAAD PROTOCOL INITIATED (Critical Delay)" status
**Validates: Requirements 8.3**

Property 20: Alternate routing suggestions
*For any* route with reliability drops, the system should suggest appropriate alternate routing options
**Validates: Requirements 8.4**

Property 21: Complexity rating categorization
*For any* complexity score, the system should categorize as LOW (0.1-0.4), MEDIUM (0.5-0.8), or HIGH (0.9+) consistently
**Validates: Requirements 8.5, 9.3**

Property 22: Hop count display
*For any* calculated route, the system should display the total hop count for all detected handoffs
**Validates: Requirements 9.2**

Property 23: Degradation factor visibility
*For any* route affected by environmental factors, the system should display specific degradation factors in the output
**Validates: Requirements 9.5**

## Error Handling

The system implements comprehensive error handling across all layers:

### Parsing Errors
- **Invalid Color Codes**: Return specific error indicating unrecognized color with suggestions
- **Unknown Symbols**: Provide error message with list of valid symbols
- **Invalid Station Codes**: Return error with closest matching station codes
- **Malformed Markers**: Detailed parsing error with position information

### Validation Errors
- **Missing Components**: Identify which required components are missing
- **Format Violations**: Specify expected format vs. received format
- **Range Violations**: Indicate valid ranges for numeric components

### System Errors
- **Protocol File Missing**: Graceful degradation with cached data
- **Configuration Corruption**: Validation and recovery procedures
- **Memory Constraints**: Efficient resource management and cleanup

### Mumbai Slang Error Handling
- **Unknown Slang**: Suggest closest known terminology
- **Ambiguous Terms**: Request clarification with options
- **Context Errors**: Provide contextual help for proper usage

## Testing Strategy

The system employs a dual testing approach combining unit tests and property-based tests for comprehensive coverage.

### Property-Based Testing Framework
- **Library**: fast-check for JavaScript/TypeScript
- **Iterations**: Minimum 100 iterations per property test
- **Generators**: Smart generators that constrain to valid input spaces
- **Tagging**: Each property test tagged with format: `**Feature: dabbawala-logistics-decoder, Property {number}: {property_text}**`

### Unit Testing Framework
- **Library**: Jest for JavaScript/TypeScript testing
- **Coverage**: Specific examples, edge cases, and integration points
- **Focus**: Concrete scenarios that demonstrate correct behavior

### Test Categories

**Property-Based Tests:**
- Delivery marker parsing across all valid input combinations
- Validation logic consistency across component types
- Routing path generation completeness
- Deterministic behavior verification
- Offline operation validation
- Mumbai terminology processing
- Complexity score calculation accuracy across all hop combinations
- Reliability degradation factor application (Dadar penalty, peak hours, monsoon)
- Confidence display formatting consistency
- Threshold status determination across all confidence ranges
- Alternate routing suggestion generation
- Environmental factor impact calculations

**Unit Tests:**
- System initialization with protocol file loading
- Configuration reloading scenarios
- Specific Mumbai slang phrase handling ("Jhol in the route", "Dadar handoff failed")
- Error message formatting and display
- UI component integration
- File system interaction edge cases

**Integration Tests:**
- End-to-end marker processing workflows
- Terminal interface interaction flows
- Protocol file update and reload cycles
- Error recovery scenarios

### Test Data Management
- **Protocol Test Data**: Comprehensive test protocol files with various configurations
- **Marker Generators**: Smart generators for valid and invalid delivery markers
- **Mumbai Terminology Database**: Curated list of authentic slang and abbreviations
- **Timing Scenarios**: Various time-based test cases around Dadar sorting schedule

The testing strategy ensures both concrete correctness (unit tests) and universal properties (property-based tests) are validated, providing confidence in the system's reliability and authenticity to the Mumbai Dabbawala network operations.