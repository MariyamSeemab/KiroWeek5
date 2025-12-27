export declare enum DestinationType {
    INDUSTRIAL_ESTATE = "Industrial Estate",
    RESIDENTIAL_CHAWL = "Residential Chawl",
    COMMERCIAL_COMPLEX = "Commercial Complex",
    GOVERNMENT_OFFICE = "Government Office",
    EDUCATIONAL_INSTITUTE = "Educational Institute"
}
export declare enum PriorityLevel {
    HIGH = "High",
    MEDIUM = "Medium",
    LOW = "Low",
    URGENT = "Urgent",
    STANDARD = "Standard"
}
export interface DeliveryMarker {
    color: string;
    symbol: string;
    stationCode: string;
    sequence: number;
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
    sortingHub: string;
    collectionTime: string;
    sortingTime: string;
    deliveryTime: string;
    route: RouteSegment[];
    networkHops?: NetworkHop[];
    complexityScore?: ComplexityScore;
    systemConfidence?: SystemConfidence;
    reliabilityMetrics?: ReliabilityMetrics;
}
export interface StationInfo {
    code: string;
    fullName: string;
    area: string;
    zone: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}
export interface SymbolInfo {
    shape: string;
    destinationType: DestinationType;
    description: string;
}
export interface ColorInfo {
    name: string;
    priority: PriorityLevel;
    areaType: string;
    hexCode: string;
}
export interface RouteSegment {
    from: string;
    to: string;
    mode: string;
    duration: number;
    distance: number;
}
export interface ValidationError {
    component: string;
    message: string;
    suggestions?: string[];
}
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
    phase: string;
    standardTime: string;
    constraints: string[];
}
export interface SlangMapping {
    slang: string;
    meaning: string;
    context: string;
    alternatives?: string[];
}
export interface NetworkHop {
    type: HopType;
    weight: number;
    description: string;
    station: StationInfo;
}
export declare enum HopType {
    BASE_HOP = "Base Hop",// Collection to Local Station (Weight: 0.1)
    TRANSIT_HOP = "Transit Hop",// Local Train to Sorting Hub (Weight: 0.2)
    TRANSFER_HOP = "Transfer Hop",// Dadar Interface Cross-line (Weight: 0.5)
    FINAL_HOP = "Final Hop"
}
export interface ComplexityScore {
    score: number;
    rating: ComplexityRating;
    hops: NetworkHop[];
    calculation: string;
}
export declare enum ComplexityRating {
    LOW = "LOW",// 0.1 - 0.4: Direct Route
    MEDIUM = "MEDIUM",// 0.5 - 0.8: Inter-station Sorting
    HIGH = "HIGH"
}
export interface SystemConfidence {
    percentage: number;
    baselineAccuracy: number;
    degradationFactors: ReliabilityDegradationFactor[];
    finalConfidence: number;
    displayFormat: string;
}
export interface ReliabilityDegradationFactor {
    type: DegradationFactorType;
    impact: number;
    description: string;
    isActive: boolean;
}
export declare enum DegradationFactorType {
    DADAR_PENALTY = "Dadar Penalty",// 0.0001% for W-C crossing
    PEAK_HOUR_JITTER = "Peak Hour Jitter",// 10:15-11:30 AM collision risk
    RAIN_VARIABLE = "Rain Variable"
}
export interface EnvironmentalFactors {
    currentTime: Date;
    monsoonMode: boolean;
    rainfallKurla: number;
    rainfallParel: number;
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
    color: string;
    actionRequired: boolean;
}
export declare enum ReliabilityThreshold {
    OPTIMAL = "OPTIMAL ROUTE",// > 99.9%
    MONITORING = "MONITORING ACTIVE (Delay Possible)",// 95% - 99.8%
    CRITICAL = "JUGAAD PROTOCOL INITIATED (Critical Delay)"
}
export interface AlternateRoute {
    description: string;
    alternateNode: string;
    expectedImprovement: number;
    reasoning: string;
}
//# sourceMappingURL=index.d.ts.map