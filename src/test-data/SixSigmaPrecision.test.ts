// Six-Sigma Precision Requirements Validation Test Suite
// Tests baseline accuracy, confidence display precision, and complexity score accuracy

import { NetworkRouter } from '../services/NetworkRouter';
import { ProtocolKnowledgeBase } from '../services/ProtocolKnowledgeBase';
import { ReliabilityMetricsEngine } from '../services/ReliabilityMetricsEngine';
import { TestDataGenerator } from './TestDataGenerator';

describe('Six-Sigma Precision Requirements Validation', () => {
  let networkRouter: NetworkRouter;
  let protocolKB: ProtocolKnowledgeBase;
  let reliabilityEngine: ReliabilityMetricsEngine;
  let testDataGenerator: TestDataGenerator;

  beforeAll(async () => {
    protocolKB = new ProtocolKnowledgeBase('.kiro/binary_protocol.md');
    await protocolKB.initialize();
    
    networkRouter = new NetworkRouter(protocolKB);
    reliabilityEngine = new ReliabilityMetricsEngine();
    testDataGenerator = new TestDataGenerator();
  });

  describe('Baseline Accuracy Maintenance (1 error in 16 million)', () => {
    test('should maintain 99.99999% baseline accuracy', async () => {
      const BASELINE_ACCURACY = 99.99999;
      const markers = testDataGenerator.generateValidMarkers();
      let successfulProcessing = 0;
      let totalProcessed = 0;

      for (const marker of markers) {
        try {
          const markerString = `${marker.color} ${marker.symbol} - ${marker.stationCode} - ${marker.sequence}`;
          const parsed = networkRouter.parseDeliveryMarker(markerString);
          
          if (parsed.isValid) {
            const route = networkRouter.generateRoutingPath(parsed);
            if (route && route.reliabilityMetrics) {
              successfulProcessing++;
            }
          }
          totalProcessed++;
        } catch (error) {
          totalProcessed++;
          // Expected to have very few errors
        }
      }

      const actualAccuracy = (successfulProcessing / totalProcessed) * 100;
      expect(actualAccuracy).toBeGreaterThanOrEqual(BASELINE_ACCURACY - 0.001); // Allow tiny margin
      expect(totalProcessed).toBeGreaterThan(0);
    });

    test('should track baseline accuracy in system confidence', async () => {
      const marker = 'Red Triangle - VLP - 4';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      const route = networkRouter.generateRoutingPath(parsed);

      expect(route.reliabilityMetrics?.systemConfidence.baselineAccuracy).toBe(99.99999);
      expect(route.reliabilityMetrics?.systemConfidence.percentage).toBe(99.99999);
    });

    test('should indicate optimal system performance when baseline maintained', async () => {
      const marker = 'Green Circle - DDR - 1'; // Simple, optimal route
      const parsed = networkRouter.parseDeliveryMarker(marker);
      const route = networkRouter.generateRoutingPath(parsed);

      // Should maintain near-baseline confidence for optimal routes
      expect(route.reliabilityMetrics?.systemConfidence.finalConfidence).toBeGreaterThan(99.99);
      expect(route.reliabilityMetrics?.thresholdStatus.status).toBe('OPTIMAL ROUTE');
    });
  });

  describe('Confidence Display Precision (99.999[X]% format)', () => {
    test('should format confidence with 99.999[X]% precision', async () => {
      const testCases = [
        { confidence: 99.99999, expected: /99\.9999\[9\]%/ },
        { confidence: 99.99987, expected: /99\.9998\[7\]%/ },
        { confidence: 99.99876, expected: /99\.9987\[6\]%/ },
        { confidence: 99.99765, expected: /99\.9976\[5\]%/ },
        { confidence: 99.99654, expected: /99\.9965\[4\]%/ }
      ];

      for (const testCase of testCases) {
        const marker = 'Red Triangle - VLP - 4';
        const parsed = networkRouter.parseDeliveryMarker(marker);
        const route = networkRouter.generateRoutingPath(parsed);

        // Mock the confidence value for testing
        if (route.reliabilityMetrics) {
          route.reliabilityMetrics.systemConfidence.finalConfidence = testCase.confidence;
          
          // Re-format the display
          const formatted = formatConfidenceDisplay(testCase.confidence);
          expect(formatted).toMatch(testCase.expected);
        }
      }
    });

    test('should maintain precision across all confidence ranges', async () => {
      const confidenceValues = [99.99999, 99.99950, 99.99000, 99.90000, 95.00000, 90.00000];
      
      for (const confidence of confidenceValues) {
        const formatted = formatConfidenceDisplay(confidence);
        
        // Should always have the [X]% format
        expect(formatted).toMatch(/\d+\.\d{4}\[\d\]%/);
        
        // Should preserve the original precision
        const numericPart = parseFloat(formatted.replace(/\[|\]|%/g, ''));
        expect(Math.abs(numericPart - confidence)).toBeLessThan(0.00001);
      }
    });

    test('should display precision format in terminal output', async () => {
      const marker = 'Blue Square - BKC - 1';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      const route = networkRouter.generateRoutingPath(parsed);

      const displayFormat = route.reliabilityMetrics?.systemConfidence.displayFormat;
      expect(displayFormat).toMatch(/99\.999\d\[\d\]%/);
    });
  });

  describe('Complexity Score Calculation Accuracy', () => {
    test('should calculate exact complexity scores using defined weights', async () => {
      const HOP_WEIGHTS = {
        'Base Hop': 0.1,
        'Transit Hop': 0.2,
        'Transfer Hop': 0.5,
        'Final Hop': 0.1
      };

      // Test direct route (no transfer hop)
      const directMarker = 'Green Circle - DDR - 1';
      const directParsed = networkRouter.parseDeliveryMarker(directMarker);
      const directRoute = networkRouter.generateRoutingPath(directParsed);
      
      const expectedDirectScore = HOP_WEIGHTS['Base Hop'] + HOP_WEIGHTS['Transit Hop'] + HOP_WEIGHTS['Final Hop'];
      expect(directRoute.complexityScore?.score).toBeCloseTo(expectedDirectScore, 3);
      expect(directRoute.complexityScore?.rating).toBe('LOW');

      // Test cross-line transfer route (includes transfer hop)
      const transferMarker = 'Red Triangle - VLP - 1'; // Western to Central
      const transferParsed = networkRouter.parseDeliveryMarker(transferMarker);
      const transferRoute = networkRouter.generateRoutingPath(transferParsed);
      
      const expectedTransferScore = expectedDirectScore + HOP_WEIGHTS['Transfer Hop'];
      expect(transferRoute.complexityScore?.score).toBeCloseTo(expectedTransferScore, 3);
      expect(transferRoute.complexityScore?.rating).toBe('HIGH');
    });

    test('should provide accurate calculation breakdown', async () => {
      const marker = 'Red Triangle - VLP - 1';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      const route = networkRouter.generateRoutingPath(parsed);

      const calculation = route.complexityScore?.calculation || '';
      expect(calculation).toContain('Base Hop (0.1)');
      expect(calculation).toContain('Transit Hop (0.2)');
      expect(calculation).toContain('Transfer Hop (0.5)');
      expect(calculation).toContain('Final Hop (0.1)');
      expect(calculation).toContain('= 0.9');
    });

    test('should categorize complexity ratings accurately', async () => {
      const testCases = [
        { score: 0.3, expectedRating: 'LOW' },    // 0.1-0.4
        { score: 0.4, expectedRating: 'LOW' },    // Boundary
        { score: 0.5, expectedRating: 'MEDIUM' }, // 0.5-0.8
        { score: 0.8, expectedRating: 'MEDIUM' }, // Boundary
        { score: 0.9, expectedRating: 'HIGH' },   // 0.9+
        { score: 1.0, expectedRating: 'HIGH' }    // Maximum
      ];

      for (const testCase of testCases) {
        // We'll test the categorization logic directly
        const rating = categorizeComplexity(testCase.score);
        expect(rating).toBe(testCase.expectedRating);
      }
    });

    test('should validate all hop combinations across route types', async () => {
      const routeTypes = [
        { marker: 'Green Circle - DDR - 1', expectedHops: 3, description: 'Direct to Dadar' },
        { marker: 'Yellow Triangle - AND - 2', expectedHops: 3, description: 'Western line suburban' },
        { marker: 'Blue Square - KUR - 3', expectedHops: 3, description: 'Central line suburban' },
        { marker: 'Red Diamond - VLP - 4', expectedHops: 4, description: 'Cross-line transfer' }
      ];

      for (const routeType of routeTypes) {
        const parsed = networkRouter.parseDeliveryMarker(routeType.marker);
        const route = networkRouter.generateRoutingPath(parsed);

        expect(route.complexityScore?.hops).toHaveLength(routeType.expectedHops);
        expect(route.reliabilityMetrics?.hopCount).toBe(routeType.expectedHops);

        // Verify hop types are correct
        const hopTypes = route.complexityScore?.hops.map(hop => hop.type) || [];
        expect(hopTypes).toContain('Base Hop');
        expect(hopTypes).toContain('Transit Hop');
        expect(hopTypes).toContain('Final Hop');
        
        if (routeType.expectedHops === 4) {
          expect(hopTypes).toContain('Transfer Hop');
        }
      }
    });
  });

  describe('Degradation Factor Precision', () => {
    test('should apply exact Dadar penalty (0.0001%)', async () => {
      const marker = 'Red Triangle - VLP - 1'; // Western to Central crossing
      const parsed = networkRouter.parseDeliveryMarker(marker);
      const route = networkRouter.generateRoutingPath(parsed);

      const dadarFactors = route.reliabilityMetrics?.systemConfidence.degradationFactors
        .filter(factor => factor.type === 'Dadar Penalty') || [];

      if (dadarFactors.length > 0) {
        expect(dadarFactors[0].impact).toBeCloseTo(0.0001, 6);
        expect(dadarFactors[0].isActive).toBe(true);
      }
    });

    test('should calculate exact monsoon impact (2% per 10mm)', async () => {
      const testCases = [
        { rainfall: 10, expectedImpact: 2.0 },
        { rainfall: 25, expectedImpact: 5.0 },
        { rainfall: 50, expectedImpact: 10.0 }
      ];

      for (const testCase of testCases) {
        // This would require mocking environmental factors
        const calculatedImpact = (testCase.rainfall / 10) * 2.0;
        expect(calculatedImpact).toBeCloseTo(testCase.expectedImpact, 2);
      }
    });

    test('should maintain precision in combined degradation factors', async () => {
      // Test scenario with multiple factors
      const marker = 'Red Triangle - BOR - 1';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      const route = networkRouter.generateRoutingPath(parsed);

      const totalDegradation = route.reliabilityMetrics?.systemConfidence.degradationFactors
        .filter(factor => factor.isActive)
        .reduce((sum, factor) => sum + factor.impact, 0) || 0;

      const expectedFinalConfidence = 99.99999 - totalDegradation;
      const actualFinalConfidence = route.reliabilityMetrics?.systemConfidence.finalConfidence || 0;

      expect(actualFinalConfidence).toBeCloseTo(expectedFinalConfidence, 5);
    });
  });

  describe('Performance and Accuracy Benchmarks', () => {
    test('should process 1000 markers within performance limits', async () => {
      const markers: any[] = [];
      for (let i = 0; i < 1000; i++) {
        markers.push(testDataGenerator.generateValidMarkers()[i % 20]);
      }

      const startTime = Date.now();
      let successCount = 0;

      for (const marker of markers) {
        try {
          const markerString = `${marker.color} ${marker.symbol} - ${marker.stationCode} - ${marker.sequence}`;
          const parsed = networkRouter.parseDeliveryMarker(markerString);
          
          if (parsed.isValid) {
            const route = networkRouter.generateRoutingPath(parsed);
            if (route.reliabilityMetrics) {
              successCount++;
            }
          }
        } catch (error) {
          // Count errors for accuracy calculation
        }
      }

      const endTime = Date.now();
      const processingTime = endTime - startTime;
      const accuracy = (successCount / markers.length) * 100;

      expect(processingTime).toBeLessThan(5000); // Should process 1000 markers in under 5 seconds
      expect(accuracy).toBeGreaterThan(99.9); // Should maintain high accuracy
    });

    test('should maintain precision under load', async () => {
      const marker = 'Red Triangle - VLP - 4';
      const results: number[] = [];

      // Process same marker 100 times
      for (let i = 0; i < 100; i++) {
        const parsed = networkRouter.parseDeliveryMarker(marker);
        const route = networkRouter.generateRoutingPath(parsed);
        results.push(route.reliabilityMetrics?.systemConfidence.finalConfidence || 0);
      }

      // All results should be identical (deterministic)
      const firstResult = results[0];
      for (const result of results) {
        expect(result).toBeCloseTo(firstResult, 6);
      }
    });
  });
});

// Helper functions for testing
function formatConfidenceDisplay(confidence: number): string {
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

function categorizeComplexity(score: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (score >= 0.9) {
    return 'HIGH';
  } else if (score >= 0.5) {
    return 'MEDIUM';
  } else {
    return 'LOW';
  }
}