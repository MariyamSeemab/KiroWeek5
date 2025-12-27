// Six-Sigma Reliability Metrics Engine for Bambaiyya-Binary Logistics Decoder
// Implements complexity scoring, degradation factors, and confidence calculations

import { 
  RoutingPath, 
  StationInfo,
  NetworkHop,
  HopType,
  ComplexityScore,
  ComplexityRating,
  SystemConfidence,
  ReliabilityDegradationFactor,
  DegradationFactorType,
  EnvironmentalFactors,
  ReliabilityMetrics,
  ThresholdStatus,
  ReliabilityThreshold,
  AlternateRoute
} from '../models';

export class ReliabilityMetricsEngine {
  private readonly BASELINE_ACCURACY = 99.99999; // 1 error in 16 million transactions
  private readonly HOP_WEIGHTS = {
    [HopType.BASE_HOP]: 0.1,      // Collection to Local Station
    [HopType.TRANSIT_HOP]: 0.2,   // Local Train to Sorting Hub
    [HopType.TRANSFER_HOP]: 0.5,  // Dadar Interface Cross-line
    [HopType.FINAL_HOP]: 0.1      // Sorting Hub to Destination
  };

  constructor() {
    console.log('🎯 Six-Sigma Reliability Metrics Engine initialized');
    console.log(`   Baseline Accuracy: ${this.BASELINE_ACCURACY}% (1 error in 16 million)`);
  }

  // Calculate complexity score based on network hops
  calculateComplexityScore(route: RoutingPath): ComplexityScore {
    console.log('📊 Calculating complexity score...');
    
    // Detect network hops for the route
    const networkHops = this.detectNetworkHops(route);
    
    // Calculate weighted complexity score
    let totalScore = 0;
    const calculations: string[] = [];
    
    for (const hop of networkHops) {
      const weight = this.HOP_WEIGHTS[hop.type];
      totalScore += weight;
      calculations.push(`${hop.type} (${weight})`);
    }
    
    const rating = this.categorizeComplexity(totalScore);
    const calculation = `Sum of (${calculations.join(' + ')}) = ${totalScore}`;
    
    const complexityScore: ComplexityScore = {
      score: totalScore,
      rating,
      hops: networkHops,
      calculation
    };
    
    console.log(`✅ Complexity Score: ${totalScore} (${rating})`);
    return complexityScore;
  }

  // Detect network hops based on routing path
  private detectNetworkHops(route: RoutingPath): NetworkHop[] {
    const hops: NetworkHop[] = [];
    
    // Base Hop: Collection to Local Station (always present)
    hops.push({
      type: HopType.BASE_HOP,
      weight: this.HOP_WEIGHTS[HopType.BASE_HOP],
      description: 'Collection to Local Station',
      station: route.origin
    });
    
    // Transit Hop: Local Train to Sorting Hub (always through Dadar)
    hops.push({
      type: HopType.TRANSIT_HOP,
      weight: this.HOP_WEIGHTS[HopType.TRANSIT_HOP],
      description: 'Local Train Carriage to Sorting Hub',
      station: this.createDadarStation()
    });
    
    // Transfer Hop: Check if crossing Western to Central lines
    if (this.isWesternToCentralCrossing(route)) {
      hops.push({
        type: HopType.TRANSFER_HOP,
        weight: this.HOP_WEIGHTS[HopType.TRANSFER_HOP],
        description: 'Dadar Interface Cross-line Transfer',
        station: this.createDadarStation()
      });
    }
    
    // Final Hop: Sorting Hub to Destination (always present)
    hops.push({
      type: HopType.FINAL_HOP,
      weight: this.HOP_WEIGHTS[HopType.FINAL_HOP],
      description: 'Sorting Hub to Destination Node',
      station: route.destination
    });
    
    return hops;
  }

  // Categorize complexity score into LOW/MEDIUM/HIGH
  private categorizeComplexity(score: number): ComplexityRating {
    if (score >= 0.9) {
      return ComplexityRating.HIGH;   // Cross-line Transfer / Multi-hub
    } else if (score >= 0.5) {
      return ComplexityRating.MEDIUM; // Inter-station Sorting
    } else {
      return ComplexityRating.LOW;    // Direct Route
    }
  }

  // Check if route crosses from Western to Central lines
  private isWesternToCentralCrossing(route: RoutingPath): boolean {
    const originArea = route.origin.area.toLowerCase();
    const destinationArea = route.destination.area.toLowerCase();
    
    const isOriginWestern = originArea.includes('western');
    const isDestinationCentral = destinationArea.includes('central');
    
    const isOriginCentral = originArea.includes('central');
    const isDestinationWestern = destinationArea.includes('western');
    
    return (isOriginWestern && isDestinationCentral) || (isOriginCentral && isDestinationWestern);
  }

  // Calculate system confidence with degradation factors
  calculateSystemConfidence(route: RoutingPath, environmental: EnvironmentalFactors): SystemConfidence {
    console.log('🔒 Calculating system confidence...');
    
    let confidence = this.BASELINE_ACCURACY;
    const degradationFactors: ReliabilityDegradationFactor[] = [];
    
    // Apply Dadar Penalty (0.0001% for Western-Central crossing)
    if (environmental.isWesternToCentralCrossing) {
      const impact = 0.0001;
      confidence -= impact;
      degradationFactors.push({
        type: DegradationFactorType.DADAR_PENALTY,
        impact,
        description: 'Western to Central line crossing penalty',
        isActive: true
      });
    }
    
    // Apply Peak Hour Jitter (10:15 AM - 11:30 AM)
    if (this.isPeakHour(environmental.currentTime)) {
      const impact = 0.001; // Increased collision probability
      confidence -= impact;
      degradationFactors.push({
        type: DegradationFactorType.PEAK_HOUR_JITTER,
        impact,
        description: 'Peak hour packet collision probability',
        isActive: true
      });
    }
    
    // Apply Rain Variable (2% per 10mm at Kurla/Parel)
    if (environmental.monsoonMode) {
      const kurlaImpact = (environmental.rainfallKurla / 10) * 2.0;
      const parelImpact = (environmental.rainfallParel / 10) * 2.0;
      const totalRainImpact = Math.max(kurlaImpact, parelImpact); // Use worst case
      
      if (totalRainImpact > 0) {
        confidence -= totalRainImpact;
        degradationFactors.push({
          type: DegradationFactorType.RAIN_VARIABLE,
          impact: totalRainImpact,
          description: `Monsoon impact: ${Math.max(environmental.rainfallKurla, environmental.rainfallParel)}mm rainfall`,
          isActive: true
        });
      }
    }
    
    const finalConfidence = Math.max(confidence, 0); // Ensure non-negative
    const displayFormat = this.formatConfidenceDisplay(finalConfidence);
    
    const systemConfidence: SystemConfidence = {
      percentage: this.BASELINE_ACCURACY,
      baselineAccuracy: this.BASELINE_ACCURACY,
      degradationFactors,
      finalConfidence,
      displayFormat
    };
    
    console.log(`✅ System Confidence: ${displayFormat}`);
    return systemConfidence;
  }

  // Check if current time is during peak hours (10:15 AM - 11:30 AM)
  private isPeakHour(currentTime: Date): boolean {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    
    // Peak hours: 10:15 AM - 11:30 AM
    const startTime = 10 * 60 + 15; // 10:15 AM in minutes
    const endTime = 11 * 60 + 30;   // 11:30 AM in minutes
    const currentMinutes = hour * 60 + minute;
    
    return currentMinutes >= startTime && currentMinutes <= endTime;
  }

  // Format confidence display with 99.999[X]% precision
  private formatConfidenceDisplay(confidence: number): string {
    // Format to 5 decimal places and add brackets around the last digit
    const formatted = confidence.toFixed(5);
    const parts = formatted.split('.');
    const wholePart = parts[0];
    const decimalPart = parts[1];
    
    if (decimalPart.length >= 5) {
      const firstFour = decimalPart.substring(0, 4);
      const lastDigit = decimalPart.substring(4, 5);
      return `${wholePart}.${firstFour}[${lastDigit}]%`;
    }
    
    return `${formatted}%`;
  }

  // Determine reliability threshold status
  determineThresholdStatus(confidence: number): ThresholdStatus {
    let status: ReliabilityThreshold;
    let message: string;
    let color: string;
    let actionRequired: boolean;
    
    if (confidence > 99.9) {
      status = ReliabilityThreshold.OPTIMAL;
      message = 'OPTIMAL ROUTE';
      color = '#32CD32'; // Green
      actionRequired = false;
    } else if (confidence >= 95.0) {
      status = ReliabilityThreshold.MONITORING;
      message = 'MONITORING ACTIVE (Delay Possible)';
      color = '#FFD700'; // Yellow
      actionRequired = false;
    } else {
      status = ReliabilityThreshold.CRITICAL;
      message = 'JUGAAD PROTOCOL INITIATED (Critical Delay)';
      color = '#FF0000'; // Red
      actionRequired = true;
    }
    
    return {
      status,
      message,
      color,
      actionRequired
    };
  }

  // Suggest alternate routing options for reliability drops
  suggestAlternateRouting(route: RoutingPath, confidence: number): AlternateRoute[] {
    const alternatives: AlternateRoute[] = [];
    
    if (confidence < 99.0) {
      // Suggest Parel-Node instead of Dadar for manual transfer
      alternatives.push({
        description: 'Manual transfer route via Parel Node',
        alternateNode: 'Parel-Node instead of Dadar',
        expectedImprovement: 2.5, // 2.5% confidence improvement
        reasoning: 'Bypass high-traffic Dadar junction during peak hours'
      });
      
      // Suggest direct delivery for critical cases
      if (confidence < 95.0) {
        alternatives.push({
          description: 'Direct delivery bypass (skip sorting)',
          alternateNode: 'Direct route to destination',
          expectedImprovement: 5.0, // 5% confidence improvement
          reasoning: 'Emergency protocol - direct delivery without central sorting'
        });
      }
    }
    
    return alternatives;
  }

  // Generate comprehensive reliability metrics
  generateReliabilityMetrics(route: RoutingPath, environmental: EnvironmentalFactors): ReliabilityMetrics {
    console.log('📈 Generating comprehensive reliability metrics...');
    
    const complexityScore = this.calculateComplexityScore(route);
    const systemConfidence = this.calculateSystemConfidence(route, environmental);
    const thresholdStatus = this.determineThresholdStatus(systemConfidence.finalConfidence);
    const alternateRoutes = this.suggestAlternateRouting(route, systemConfidence.finalConfidence);
    const hopCount = complexityScore.hops.length;
    
    const metrics: ReliabilityMetrics = {
      systemConfidence,
      hopCount,
      complexityScore,
      thresholdStatus,
      alternateRoutes
    };
    
    console.log('✅ Reliability metrics generated successfully');
    console.log(`   Hop Count: ${hopCount}`);
    console.log(`   Complexity: ${complexityScore.rating}`);
    console.log(`   Status: ${thresholdStatus.message}`);
    
    return metrics;
  }

  // Helper method to create Dadar station info
  private createDadarStation(): StationInfo {
    return {
      code: 'DDR',
      fullName: 'Dadar',
      area: 'Central Hub',
      zone: 'Zone 1',
      coordinates: { lat: 19.0176, lng: 72.8562 }
    };
  }
}