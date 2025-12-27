import { DeliveryMarker, ProtocolData } from '../models';
export declare class TestDataGenerator {
    generateTestProtocolData(): ProtocolData;
    private generateTestStations;
    private generateTestSymbols;
    private generateTestColors;
    private generateTestTimingRules;
    private generateTestSlangTerms;
    generateValidMarkers(): DeliveryMarker[];
    generateInvalidMarkers(): Array<{
        marker: DeliveryMarker;
        expectedErrors: string[];
    }>;
    generateMumbaiTerminologyTests(): Array<{
        input: string;
        expectedSlang: string[];
        expectedExpansions: string[];
    }>;
    generateMarkerStringVariations(): Array<{
        input: string;
        expected: DeliveryMarker;
    }>;
    generateTimingTestScenarios(): Array<{
        marker: DeliveryMarker;
        expectedCollectionWindow: string;
        expectedDeliveryWindow: string;
    }>;
    generateStationSimilarityTests(): Array<{
        input: string;
        expectedSuggestions: string[];
    }>;
    generateTestProtocolFileContent(): string;
    generateReliabilityTestScenarios(): Array<{
        scenario: string;
        marker: DeliveryMarker;
        environmentalFactors: any;
        expectedComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
        expectedConfidenceRange: {
            min: number;
            max: number;
        };
        expectedDegradationFactors: string[];
    }>;
    generateEnvironmentalTestData(): Array<{
        condition: string;
        factors: any;
        expectedImpact: string;
        description: string;
    }>;
    generateThresholdBoundaryTests(): Array<{
        testCase: string;
        confidence: number;
        expectedStatus: string;
        expectedColor: string;
        actionRequired: boolean;
    }>;
}
//# sourceMappingURL=TestDataGenerator.d.ts.map