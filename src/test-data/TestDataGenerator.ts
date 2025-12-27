// Comprehensive Test Data Generator for Bambaiyya-Binary Logistics Decoder
// Generates test protocol files, marker generators, and Mumbai terminology database

import { DeliveryMarker, ProtocolData, StationMapping, SymbolDefinition, ColorRule, TimingRule, SlangMapping, DestinationType, PriorityLevel } from '../models';

export class TestDataGenerator {
  
  // Generate comprehensive test protocol data
  generateTestProtocolData(): ProtocolData {
    return {
      stationCodes: this.generateTestStations(),
      symbolLogic: this.generateTestSymbols(),
      colorSpectrum: this.generateTestColors(),
      timingConstraints: this.generateTestTimingRules(),
      mumbaiSlang: this.generateTestSlangTerms()
    };
  }

  // Generate test station mappings
  private generateTestStations(): StationMapping[] {
    return [
      // Western Railway Corridor
      { code: 'VLP', fullName: 'Vile Parle', area: 'Western Suburbs', zone: 'Zone 2', aliases: ['VP', 'Ville'] },
      { code: 'AND', fullName: 'Andheri', area: 'Western Suburbs', zone: 'Zone 2', aliases: ['Andheri Station'] },
      { code: 'JOG', fullName: 'Jogeshwari', area: 'Western Suburbs', zone: 'Zone 2', aliases: [] },
      { code: 'GOR', fullName: 'Goregaon', area: 'Western Suburbs', zone: 'Zone 3', aliases: [] },
      { code: 'MAL', fullName: 'Malad', area: 'Western Suburbs', zone: 'Zone 3', aliases: [] },
      { code: 'BOR', fullName: 'Borivali', area: 'Western Suburbs', zone: 'Zone 3', aliases: [] },
      
      // Central Railway Corridor
      { code: 'DDR', fullName: 'Dadar', area: 'Central Hub', zone: 'Zone 1', aliases: ['Dadar TT', 'Central Hub'] },
      { code: 'KUR', fullName: 'Kurla', area: 'Central Suburbs', zone: 'Zone 2', aliases: [] },
      { code: 'GHA', fullName: 'Ghatkopar', area: 'Central Suburbs', zone: 'Zone 2', aliases: [] },
      { code: 'VIK', fullName: 'Vikhroli', area: 'Central Suburbs', zone: 'Zone 3', aliases: [] },
      { code: 'BHA', fullName: 'Bhandup', area: 'Central Suburbs', zone: 'Zone 3', aliases: [] },
      
      // Harbour Line
      { code: 'CST', fullName: 'Chhatrapati Shivaji Terminus', area: 'South Mumbai', zone: 'Zone 1', aliases: ['VT', 'Victoria Terminus'] },
      { code: 'BCL', fullName: 'Mumbai Central', area: 'South Mumbai', zone: 'Zone 1', aliases: [] },
      { code: 'KIN', fullName: 'King\'s Circle', area: 'Central Mumbai', zone: 'Zone 1', aliases: [] },
      { code: 'CHU', fullName: 'Chunabhatti', area: 'Harbour Line', zone: 'Zone 2', aliases: [] },
      
      // Business Districts
      { code: 'BKC', fullName: 'Bandra Kurla Complex', area: 'Commercial Hub', zone: 'Zone 2', aliases: ['BK Complex'] },
      { code: 'NAR', fullName: 'Nariman Point', area: 'Financial District', zone: 'Zone 1', aliases: [] },
      { code: 'POW', fullName: 'Powai', area: 'IT Hub', zone: 'Zone 3', aliases: [] }
    ];
  }

  // Generate test symbol definitions
  private generateTestSymbols(): SymbolDefinition[] {
    return [
      {
        shape: 'Circle',
        destinationType: DestinationType.INDUSTRIAL_ESTATE,
        description: 'Manufacturing zones, warehouses, factory complexes',
        examples: ['Andheri SEEPZ', 'Vikhroli Industrial Estate', 'Powai IT Park']
      },
      {
        shape: 'Triangle',
        destinationType: DestinationType.RESIDENTIAL_CHAWL,
        description: 'Dense residential communities, housing societies',
        examples: ['Dharavi clusters', 'Worli villages', 'Bandra East societies']
      },
      {
        shape: 'Square',
        destinationType: DestinationType.COMMERCIAL_COMPLEX,
        description: 'Office buildings, shopping centers, malls',
        examples: ['Nariman Point towers', 'BKC offices', 'Phoenix Mills']
      },
      {
        shape: 'Diamond',
        destinationType: DestinationType.GOVERNMENT_OFFICE,
        description: 'Municipal buildings, administrative centers',
        examples: ['BMC offices', 'Mantralaya', 'Collectorate']
      },
      {
        shape: 'Star',
        destinationType: DestinationType.EDUCATIONAL_INSTITUTE,
        description: 'Schools, colleges, universities, training centers',
        examples: ['IIT Powai', 'Mumbai University', 'St. Xavier\'s College']
      }
    ];
  }

  // Generate test color rules
  private generateTestColors(): ColorRule[] {
    return [
      {
        color: 'Red',
        priority: PriorityLevel.URGENT,
        areaType: 'High-density commercial zones',
        hexCode: '#FF0000',
        description: 'Financial district, prime business areas requiring immediate delivery'
      },
      {
        color: 'Orange',
        priority: PriorityLevel.HIGH,
        areaType: 'Mixed commercial-residential',
        hexCode: '#FF8C00',
        description: 'Busy suburban centers with time-sensitive deliveries'
      },
      {
        color: 'Yellow',
        priority: PriorityLevel.MEDIUM,
        areaType: 'Suburban residential',
        hexCode: '#FFD700',
        description: 'Regular residential areas with standard delivery windows'
      },
      {
        color: 'Green',
        priority: PriorityLevel.STANDARD,
        areaType: 'Suburban hub',
        hexCode: '#32CD32',
        description: 'Outer suburban areas with flexible delivery timing'
      },
      {
        color: 'Blue',
        priority: PriorityLevel.HIGH,
        areaType: 'Island city core',
        hexCode: '#003399',
        description: 'South Mumbai heritage areas requiring special handling'
      }
    ];
  }

  // Generate test timing rules
  private generateTestTimingRules(): TimingRule[] {
    return [
      {
        phase: 'Collection',
        standardTime: '9:00 AM - 10:15 AM',
        constraints: ['Must arrive before sorting time']
      },
      {
        phase: 'Sorting',
        standardTime: '10:30 AM (FIXED REFERENCE POINT)',
        constraints: ['Fixed reference point', 'All routing calculations use this time']
      },
      {
        phase: 'Delivery',
        standardTime: '10:45 AM - 11:30 AM',
        constraints: ['Post-sorting dispatch to final destinations']
      }
    ];
  }

  // Generate test Mumbai slang terms
  private generateTestSlangTerms(): SlangMapping[] {
    return [
      {
        slang: 'Jhol in the route',
        meaning: 'Unexpected delay or obstacle in delivery path',
        context: 'Calculate alternative routing options',
        alternatives: ['Route mein problem', 'Delivery stuck']
      },
      {
        slang: 'Dadar handoff failed',
        meaning: 'Packet missed the 10:30 AM sorting window',
        context: 'Route to 1:00 PM secondary sort or direct delivery',
        alternatives: ['Dadar miss ho gaya', 'Sorting time nikla']
      },
      {
        slang: 'Packet chalega',
        meaning: 'Route confirmed, no complications',
        context: 'Positive routing confirmation',
        alternatives: []
      },
      {
        slang: 'Local pakad',
        meaning: 'Use suburban railway for fastest routing',
        context: 'Time-critical delivery instructions',
        alternatives: []
      }
    ];
  }

  // Generate valid delivery markers for testing
  generateValidMarkers(): DeliveryMarker[] {
    const colors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue'];
    const symbols = ['Circle', 'Triangle', 'Square', 'Diamond', 'Star'];
    const stations = ['VLP', 'AND', 'DDR', 'BKC', 'NAR', 'CST', 'KUR', 'GHA'];
    
    const markers: DeliveryMarker[] = [];
    
    // Generate systematic combinations
    for (let i = 0; i < 20; i++) {
      markers.push({
        color: colors[i % colors.length],
        symbol: symbols[i % symbols.length],
        stationCode: stations[i % stations.length],
        sequence: (i % 10) + 1
      });
    }
    
    return markers;
  }

  // Generate invalid delivery markers for error testing
  generateInvalidMarkers(): Array<{marker: DeliveryMarker, expectedErrors: string[]}> {
    return [
      {
        marker: { color: 'Purple', symbol: 'Circle', stationCode: 'VLP', sequence: 1 },
        expectedErrors: ['color']
      },
      {
        marker: { color: 'Red', symbol: 'Hexagon', stationCode: 'VLP', sequence: 1 },
        expectedErrors: ['symbol']
      },
      {
        marker: { color: 'Red', symbol: 'Circle', stationCode: 'XYZ', sequence: 1 },
        expectedErrors: ['station']
      },
      {
        marker: { color: 'Red', symbol: 'Circle', stationCode: 'VLP', sequence: 1000 },
        expectedErrors: ['sequence']
      },
      {
        marker: { color: 'Purple', symbol: 'Hexagon', stationCode: 'XYZ', sequence: 0 },
        expectedErrors: ['color', 'symbol', 'station', 'sequence']
      }
    ];
  }

  // Generate Mumbai terminology test cases
  generateMumbaiTerminologyTests(): Array<{input: string, expectedSlang: string[], expectedExpansions: string[]}> {
    return [
      {
        input: 'Red Triangle - VLP - 4 but Jhol in the route',
        expectedSlang: ['Jhol in the route'],
        expectedExpansions: ['Route complication detected - alternative paths will be calculated']
      },
      {
        input: 'Dadar handoff failed for Blue Circle - BKC - 1',
        expectedSlang: ['Dadar handoff failed'],
        expectedExpansions: ['Primary sorting missed - routing to secondary sort at 1:00 PM']
      },
      {
        input: 'Packet chalega for Green Square - AND - 3',
        expectedSlang: ['Packet chalega'],
        expectedExpansions: []
      },
      {
        input: 'Local pakad for urgent delivery to NAR',
        expectedSlang: ['Local pakad'],
        expectedExpansions: []
      }
    ];
  }

  // Generate marker string variations for parsing tests
  generateMarkerStringVariations(): Array<{input: string, expected: DeliveryMarker}> {
    const baseMarker: DeliveryMarker = {
      color: 'Red',
      symbol: 'Triangle',
      stationCode: 'VLP',
      sequence: 4
    };

    return [
      { input: 'Red Triangle - VLP - 4', expected: baseMarker },
      { input: 'Red Triangle VLP 4', expected: baseMarker },
      { input: 'Red-Triangle-VLP-4', expected: baseMarker },
      { input: 'red triangle vlp 4', expected: baseMarker },
      { input: 'RED TRIANGLE VLP 4', expected: baseMarker },
      { input: '  Red   Triangle  -  VLP  -  4  ', expected: baseMarker },
      { input: 'Red Triangle - VLP', expected: { ...baseMarker, sequence: 1 } }
    ];
  }

  // Generate timing constraint test scenarios
  generateTimingTestScenarios(): Array<{
    marker: DeliveryMarker,
    expectedCollectionWindow: string,
    expectedDeliveryWindow: string
  }> {
    return [
      {
        marker: { color: 'Red', symbol: 'Triangle', stationCode: 'VLP', sequence: 1 },
        expectedCollectionWindow: '9:00 AM - 10:15 AM',
        expectedDeliveryWindow: '11:15 AM - 12:15 PM' // Urgent = 60 min window
      },
      {
        marker: { color: 'Green', symbol: 'Circle', stationCode: 'BOR', sequence: 1 },
        expectedCollectionWindow: '9:00 AM - 10:15 AM',
        expectedDeliveryWindow: '11:15 AM - 1:15 PM' // Zone 3 = 120 min window
      },
      {
        marker: { color: 'Yellow', symbol: 'Square', stationCode: 'DDR', sequence: 1 },
        expectedCollectionWindow: '9:00 AM - 10:15 AM',
        expectedDeliveryWindow: '11:15 AM - 12:45 PM' // Zone 1 = 90 min window
      }
    ];
  }

  // Generate station code similarity test cases
  generateStationSimilarityTests(): Array<{input: string, expectedSuggestions: string[]}> {
    return [
      { input: 'VLQ', expectedSuggestions: ['VLP'] },
      { input: 'ANE', expectedSuggestions: ['AND'] },
      { input: 'DDQ', expectedSuggestions: ['DDR'] },
      { input: 'BKD', expectedSuggestions: ['BKC'] },
      { input: 'XYZ', expectedSuggestions: ['VLP', 'AND', 'JOG'] } // Should return closest matches
    ];
  }

  // Generate comprehensive test protocol file content
  generateTestProtocolFileContent(): string {
    return `# Test Binary Protocol Specification
## Network Router Configuration for Dabbawala Logistics System

### Station Key Mappings

#### Western Railway Corridor
- **VLP** = Vile Parle (Zone 2, Western Suburbs)
- **AND** = Andheri (Zone 2, Western Suburbs)
- **JOG** = Jogeshwari (Zone 2, Western Suburbs)

#### Central Railway Corridor  
- **DDR** = Dadar (Zone 1, Central Hub) *[PRIMARY SORTING HUB]*
- **KUR** = Kurla (Zone 2, Central Suburbs)

### Symbol Logic Definitions

#### Circle (○)
- **Destination Type**: Industrial Estate
- **Description**: Manufacturing zones, warehouses
- **Examples**: Andheri SEEPZ, Vikhroli Industrial Estate

#### Triangle (△)  
- **Destination Type**: Residential Chawl
- **Description**: Dense residential communities
- **Examples**: Dharavi clusters, Worli villages

### Color Spectrum Priority System

#### Red (HIGH PRIORITY)
- **Area Type**: High-density commercial zones
- **Priority Level**: Urgent
- **Hex Code**: #FF0000
- **Description**: Financial district areas

#### Green (STANDARD PRIORITY)
- **Area Type**: Suburban hub
- **Priority Level**: Standard
- **Hex Code**: #32CD32
- **Description**: Outer suburban areas

### Timing Constraints & Cycle Operations

#### Primary Sorting Hub Schedule
- **Location**: Dadar Railway Station (DDR)
- **Critical Sorting Time**: 10:30 AM (FIXED REFERENCE POINT)
- **Collection Window**: 9:00 AM - 10:15 AM

### Mumbai Slang & Local Terminology

#### Operational Terms
- **"Jhol in the route"** = Routing complication detected
  - *Meaning*: Unexpected delay or obstacle in delivery path
  - *Action*: Calculate alternative routing options

- **"Dadar handoff failed"** = Primary sorting hub transfer unsuccessful  
  - *Meaning*: Packet missed the 10:30 AM sorting window
  - *Action*: Route to 1:00 PM secondary sort
`;
  }

  // Generate comprehensive reliability test scenarios
  generateReliabilityTestScenarios(): Array<{
    scenario: string;
    marker: DeliveryMarker;
    environmentalFactors: any;
    expectedComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
    expectedConfidenceRange: { min: number; max: number };
    expectedDegradationFactors: string[];
  }> {
    return [
      {
        scenario: 'Optimal Route - Direct Zone 1 Delivery',
        marker: { color: 'Green', symbol: 'Circle', stationCode: 'DDR', sequence: 1 },
        environmentalFactors: {
          currentTime: new Date('2024-01-15T09:00:00'),
          monsoonMode: false,
          rainfallKurla: 0,
          rainfallParel: 0,
          isWesternToCentralCrossing: false
        },
        expectedComplexity: 'LOW',
        expectedConfidenceRange: { min: 99.99, max: 100.0 },
        expectedDegradationFactors: []
      },
      {
        scenario: 'Medium Complexity - Inter-station Sorting',
        marker: { color: 'Yellow', symbol: 'Triangle', stationCode: 'AND', sequence: 5 },
        environmentalFactors: {
          currentTime: new Date('2024-01-15T09:30:00'),
          monsoonMode: false,
          rainfallKurla: 0,
          rainfallParel: 0,
          isWesternToCentralCrossing: false
        },
        expectedComplexity: 'MEDIUM',
        expectedConfidenceRange: { min: 99.9, max: 99.99 },
        expectedDegradationFactors: []
      },
      {
        scenario: 'High Complexity - Cross-line Transfer with Dadar Penalty',
        marker: { color: 'Red', symbol: 'Square', stationCode: 'VLP', sequence: 10 },
        environmentalFactors: {
          currentTime: new Date('2024-01-15T09:45:00'),
          monsoonMode: false,
          rainfallKurla: 0,
          rainfallParel: 0,
          isWesternToCentralCrossing: true
        },
        expectedComplexity: 'HIGH',
        expectedConfidenceRange: { min: 99.8, max: 99.9 },
        expectedDegradationFactors: ['Dadar Penalty']
      },
      {
        scenario: 'Peak Hour Jitter - High Traffic Period',
        marker: { color: 'Orange', symbol: 'Diamond', stationCode: 'BKC', sequence: 3 },
        environmentalFactors: {
          currentTime: new Date('2024-01-15T10:45:00'), // Peak hour
          monsoonMode: false,
          rainfallKurla: 0,
          rainfallParel: 0,
          isWesternToCentralCrossing: false
        },
        expectedComplexity: 'MEDIUM',
        expectedConfidenceRange: { min: 99.8, max: 99.9 },
        expectedDegradationFactors: ['Peak Hour Jitter']
      },
      {
        scenario: 'Monsoon Impact - Heavy Rainfall at Kurla',
        marker: { color: 'Blue', symbol: 'Star', stationCode: 'KUR', sequence: 7 },
        environmentalFactors: {
          currentTime: new Date('2024-07-15T09:30:00'), // Monsoon season
          monsoonMode: true,
          rainfallKurla: 25, // 25mm rainfall
          rainfallParel: 15,
          isWesternToCentralCrossing: false
        },
        expectedComplexity: 'MEDIUM',
        expectedConfidenceRange: { min: 94.0, max: 96.0 },
        expectedDegradationFactors: ['Rain Variable']
      },
      {
        scenario: 'Critical Conditions - Multiple Degradation Factors',
        marker: { color: 'Red', symbol: 'Triangle', stationCode: 'BOR', sequence: 15 },
        environmentalFactors: {
          currentTime: new Date('2024-07-15T10:50:00'), // Peak hour + monsoon
          monsoonMode: true,
          rainfallKurla: 35, // Heavy rainfall
          rainfallParel: 30,
          isWesternToCentralCrossing: true
        },
        expectedComplexity: 'HIGH',
        expectedConfidenceRange: { min: 90.0, max: 94.0 },
        expectedDegradationFactors: ['Dadar Penalty', 'Peak Hour Jitter', 'Rain Variable']
      },
      {
        scenario: 'Threshold Boundary - 99.9% Confidence Edge Case',
        marker: { color: 'Yellow', symbol: 'Circle', stationCode: 'GHA', sequence: 2 },
        environmentalFactors: {
          currentTime: new Date('2024-01-15T10:20:00'), // Just entering peak hour
          monsoonMode: false,
          rainfallKurla: 0,
          rainfallParel: 0,
          isWesternToCentralCrossing: false
        },
        expectedComplexity: 'MEDIUM',
        expectedConfidenceRange: { min: 99.85, max: 99.95 },
        expectedDegradationFactors: ['Peak Hour Jitter']
      },
      {
        scenario: 'Threshold Boundary - 95% Confidence Edge Case',
        marker: { color: 'Red', symbol: 'Diamond', stationCode: 'POW', sequence: 20 },
        environmentalFactors: {
          currentTime: new Date('2024-07-15T11:00:00'), // Peak monsoon + peak hour
          monsoonMode: true,
          rainfallKurla: 50, // Extreme rainfall
          rainfallParel: 45,
          isWesternToCentralCrossing: true
        },
        expectedComplexity: 'HIGH',
        expectedConfidenceRange: { min: 85.0, max: 95.0 },
        expectedDegradationFactors: ['Dadar Penalty', 'Peak Hour Jitter', 'Rain Variable']
      }
    ];
  }

  // Generate environmental condition test data
  generateEnvironmentalTestData(): Array<{
    condition: string;
    factors: any;
    expectedImpact: string;
    description: string;
  }> {
    return [
      {
        condition: 'Clear Weather - Normal Operations',
        factors: {
          currentTime: new Date('2024-01-15T09:30:00'),
          monsoonMode: false,
          rainfallKurla: 0,
          rainfallParel: 0,
          isWesternToCentralCrossing: false
        },
        expectedImpact: 'No degradation',
        description: 'Optimal conditions with no environmental factors affecting reliability'
      },
      {
        condition: 'Light Monsoon - Minimal Impact',
        factors: {
          currentTime: new Date('2024-07-15T09:30:00'),
          monsoonMode: true,
          rainfallKurla: 5,
          rainfallParel: 3,
          isWesternToCentralCrossing: false
        },
        expectedImpact: '1% confidence reduction',
        description: 'Light rainfall with minimal impact on delivery reliability'
      },
      {
        condition: 'Heavy Monsoon - Significant Impact',
        factors: {
          currentTime: new Date('2024-07-15T09:30:00'),
          monsoonMode: true,
          rainfallKurla: 30,
          rainfallParel: 25,
          isWesternToCentralCrossing: false
        },
        expectedImpact: '6% confidence reduction',
        description: 'Heavy rainfall causing significant delays and reliability issues'
      },
      {
        condition: 'Peak Hour Traffic - Collision Risk',
        factors: {
          currentTime: new Date('2024-01-15T10:45:00'),
          monsoonMode: false,
          rainfallKurla: 0,
          rainfallParel: 0,
          isWesternToCentralCrossing: false
        },
        expectedImpact: '0.001% confidence reduction',
        description: 'High traffic period with increased packet collision probability'
      },
      {
        condition: 'Cross-line Transfer - Dadar Penalty',
        factors: {
          currentTime: new Date('2024-01-15T09:30:00'),
          monsoonMode: false,
          rainfallKurla: 0,
          rainfallParel: 0,
          isWesternToCentralCrossing: true
        },
        expectedImpact: '0.0001% confidence reduction',
        description: 'Western to Central line crossing requiring Dadar interface'
      }
    ];
  }

  // Generate threshold boundary test cases
  generateThresholdBoundaryTests(): Array<{
    testCase: string;
    confidence: number;
    expectedStatus: string;
    expectedColor: string;
    actionRequired: boolean;
  }> {
    return [
      {
        testCase: 'Optimal Route - Above 99.9%',
        confidence: 99.95,
        expectedStatus: 'OPTIMAL ROUTE',
        expectedColor: '#32CD32',
        actionRequired: false
      },
      {
        testCase: 'Optimal Route - Exactly 99.9%',
        confidence: 99.9,
        expectedStatus: 'OPTIMAL ROUTE',
        expectedColor: '#32CD32',
        actionRequired: false
      },
      {
        testCase: 'Monitoring - Just Below 99.9%',
        confidence: 99.89,
        expectedStatus: 'MONITORING ACTIVE (Delay Possible)',
        expectedColor: '#FFD700',
        actionRequired: false
      },
      {
        testCase: 'Monitoring - Mid Range',
        confidence: 97.5,
        expectedStatus: 'MONITORING ACTIVE (Delay Possible)',
        expectedColor: '#FFD700',
        actionRequired: false
      },
      {
        testCase: 'Monitoring - Exactly 95%',
        confidence: 95.0,
        expectedStatus: 'MONITORING ACTIVE (Delay Possible)',
        expectedColor: '#FFD700',
        actionRequired: false
      },
      {
        testCase: 'Critical - Just Below 95%',
        confidence: 94.99,
        expectedStatus: 'JUGAAD PROTOCOL INITIATED (Critical Delay)',
        expectedColor: '#FF0000',
        actionRequired: true
      },
      {
        testCase: 'Critical - Very Low Confidence',
        confidence: 85.0,
        expectedStatus: 'JUGAAD PROTOCOL INITIATED (Critical Delay)',
        expectedColor: '#FF0000',
        actionRequired: true
      }
    ];
  }
}