// Core Data Models for Bambaiyya-Binary Logistics Decoder

export enum DestinationType {
  INDUSTRIAL_ESTATE = "Industrial Estate",
  RESIDENTIAL_CHAWL = "Residential Chawl", 
  COMMERCIAL_COMPLEX = "Commercial Complex",
  GOVERNMENT_OFFICE = "Government Office",
  EDUCATIONAL_INSTITUTE = "Educational Institute"
}

export enum PriorityLevel {
  HIGH = "High",
  MEDIUM = "Medium", 
  LOW = "Low",
  URGENT = "Urgent",
  STANDARD = "Standard"
}

export interface DeliveryMarker {
  color: string;           // Red, Green, Blue, Yellow, Orange
  symbol: string;          // Circle, Triangle, Square, Diamond, Star
  stationCode: string;     // VLP, BCL, DDR, etc.
  sequence: number;        // Delivery sequence number
}

export interface ParsedMarker {
  color: ColorInfo;
  symbol: SymbolInfo;
  station: StationInfo;
  sequence: number;
  isValid: boolean;
  errors: ValidationError[];
}

export interface RoutingPath {
  origin: StationInfo;
  destination: StationInfo;
  destinationType: DestinationType;
  priority: PriorityLevel;
  sortingHub: string;      // Always "Dadar"
  collectionTime: string;
  sortingTime: string;     // 10:30 AM
  deliveryTime: string;
  route: RouteSegment[];
  networkHops?: NetworkHop[];
  complexityScore?: ComplexityScore;
  systemConfidence?: SystemConfidence;
  reliabilityMetrics?: ReliabilityMetrics;
}

export interface StationInfo {
  code: string;            // VLP
  fullName: string;        // Vile Parle
  area: string;            // Western Suburbs
  zone: string;            // Zone 2
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface SymbolInfo {
  shape: string;           // Circle, Triangle, etc.
  destinationType: DestinationType;
  description: string;
}

export interface ColorInfo {
  name: string;            // Red
  priority: PriorityLevel;
  areaType: string;        // High-density, Suburban, etc.
  hexCode: string;         // #FF0000
}

export interface RouteSegment {
  from: string;
  to: string;
  mode: string;           // Train, Walk, Cycle
  duration: number;       // Minutes
  distance: number;       // Kilometers
}

export interface ValidationError {
  component: string;      // color, symbol, station, sequence
  message: string;
  suggestions?: string[];
}

// Protocol Configuration Structures
export interface ProtocolData {
  stationCodes: StationMapping[];
  symbolLogic: SymbolDefinition[];
  colorSpectrum: ColorRule[];
  timingConstraints: TimingRule[];
  mumbaiSlang: SlangMapping[];
}

export interface StationMapping {
  code: string;
  fullName: string;
  area: string;
  zone: string;
  aliases: string[];
}

export interface SymbolDefinition {
  shape: string;
  destinationType: DestinationType;
  description: string;
  examples: string[];
}

export interface ColorRule {
  color: string;
  priority: PriorityLevel;
  areaType: string;
  hexCode: string;
  description: string;
}

export interface TimingRule {
  phase: string;           // Collection, Sorting, Delivery
  standardTime: string;
  constraints: string[];
}

export interface SlangMapping {
  slang: string;
  meaning: string;
  context: string;
  alternatives?: string[];
}

// Six-Sigma Reliability Metrics Models
export interface NetworkHop {
  type: HopType;
  weight: number;
  description: string;
  station: StationInfo;
}

export enum HopType {
  BASE_HOP = "Base Hop",           // Collection to Local Station (Weight: 0.1)
  TRANSIT_HOP = "Transit Hop",     // Local Train to Sorting Hub (Weight: 0.2)
  TRANSFER_HOP = "Transfer Hop",   // Dadar Interface Cross-line (Weight: 0.5)
  FINAL_HOP = "Final Hop"          // Sorting Hub to Destination (Weight: 0.1)
}

export interface ComplexityScore {
  score: number;                   // Sum of (Weight * Hop_Type)
  rating: ComplexityRating;
  hops: NetworkHop[];
  calculation: string;             // Human-readable calculation breakdown
}

export enum ComplexityRating {
  LOW = "LOW",                     // 0.1 - 0.4: Direct Route
  MEDIUM = "MEDIUM",               // 0.5 - 0.8: Inter-station Sorting
  HIGH = "HIGH"                    // 0.9+: Cross-line Transfer / Multi-hub
}

export interface SystemConfidence {
  percentage: number;              // 99.999[X]% precision
  baselineAccuracy: number;        // 99.99999% (1 error in 16 million)
  degradationFactors: ReliabilityDegradationFactor[];
  finalConfidence: number;
  displayFormat: string;           // "99.999[X]%"
}

export interface ReliabilityDegradationFactor {
  type: DegradationFactorType;
  impact: number;                  // Percentage reduction
  description: string;
  isActive: boolean;
}

export enum DegradationFactorType {
  DADAR_PENALTY = "Dadar Penalty",           // 0.0001% for W-C crossing
  PEAK_HOUR_JITTER = "Peak Hour Jitter",    // 10:15-11:30 AM collision risk
  RAIN_VARIABLE = "Rain Variable"            // 2% per 10mm at Kurla/Parel
}

export interface EnvironmentalFactors {
  currentTime: Date;
  monsoonMode: boolean;
  rainfallKurla: number;           // mm
  rainfallParel: number;           // mm
  isWesternToCentralCrossing: boolean;
}

export interface ReliabilityMetrics {
  systemConfidence: SystemConfidence;
  hopCount: number;
  complexityScore: ComplexityScore;
  thresholdStatus: ThresholdStatus;
  alternateRoutes: AlternateRoute[];
}

export interface ThresholdStatus {
  status: ReliabilityThreshold;
  message: string;
  color: string;                   // UI color coding
  actionRequired: boolean;
}

export enum ReliabilityThreshold {
  OPTIMAL = "OPTIMAL ROUTE",                           // > 99.9%
  MONITORING = "MONITORING ACTIVE (Delay Possible)",  // 95% - 99.8%
  CRITICAL = "JUGAAD PROTOCOL INITIATED (Critical Delay)" // < 95%
}

export interface AlternateRoute {
  description: string;
  alternateNode: string;           // e.g., "Parel-Node instead of Dadar"
  expectedImprovement: number;     // Confidence percentage improvement
  reasoning: string;
}