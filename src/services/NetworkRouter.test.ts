// Unit tests for Network Router Engine
import { NetworkRouter } from './NetworkRouter';
import { ProtocolKnowledgeBase } from './ProtocolKnowledgeBase';
import { DestinationType, PriorityLevel } from '../models';

describe('NetworkRouter', () => {
  let networkRouter: NetworkRouter;
  let protocolKB: ProtocolKnowledgeBase;

  beforeEach(async () => {
    protocolKB = new ProtocolKnowledgeBase();
    await protocolKB.initialize();
    networkRouter = new NetworkRouter(protocolKB);
  });

  describe('Delivery Marker Parsing', () => {
    test('should parse valid marker with standard format', () => {
      const marker = 'Red Triangle - VLP - 4';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.color.name).toBe('Red');
      expect(parsed.color.priority).toBe(PriorityLevel.URGENT);
      expect(parsed.symbol.shape).toBe('Triangle');
      expect(parsed.symbol.destinationType).toBe(DestinationType.RESIDENTIAL_CHAWL);
      expect(parsed.station.code).toBe('VLP');
      expect(parsed.station.fullName).toBe('Vile Parle');
      expect(parsed.sequence).toBe(4);
      expect(parsed.errors).toHaveLength(0);
    });

    test('should parse marker with alternative format', () => {
      const marker = 'Blue Circle DDR 1';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.color.name).toBe('Blue');
      expect(parsed.symbol.shape).toBe('Circle');
      expect(parsed.station.code).toBe('DDR');
      expect(parsed.sequence).toBe(1);
    });

    test('should parse marker with dashes', () => {
      const marker = 'Green-Square-BKC-7';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.color.name).toBe('Green');
      expect(parsed.symbol.shape).toBe('Square');
      expect(parsed.station.code).toBe('BKC');
      expect(parsed.sequence).toBe(7);
    });

    test('should default sequence to 1 when not provided', () => {
      const marker = 'Yellow Star AND';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.sequence).toBe(1);
    });

    test('should handle case-insensitive input', () => {
      const marker = 'red triangle vlp 2';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.color.name).toBe('Red');
      expect(parsed.symbol.shape).toBe('Triangle');
      expect(parsed.station.code).toBe('VLP');
    });
  });

  describe('Validation', () => {
    test('should detect invalid color', () => {
      const marker = 'Purple Triangle - VLP - 4';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      
      expect(parsed.isValid).toBe(false);
      expect(parsed.errors).toHaveLength(1);
      expect(parsed.errors[0].component).toBe('color');
      expect(parsed.errors[0].message).toContain('Unknown color: Purple');
      expect(parsed.errors[0].suggestions).toContain('Red');
    });

    test('should detect invalid symbol', () => {
      const marker = 'Red Hexagon - VLP - 4';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      
      expect(parsed.isValid).toBe(false);
      expect(parsed.errors).toHaveLength(1);
      expect(parsed.errors[0].component).toBe('symbol');
      expect(parsed.errors[0].message).toContain('Unknown symbol: Hexagon');
      expect(parsed.errors[0].suggestions).toContain('Triangle');
    });

    test('should detect invalid station code', () => {
      const marker = 'Red Triangle - XYZ - 4';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      
      expect(parsed.isValid).toBe(false);
      expect(parsed.errors).toHaveLength(1);
      expect(parsed.errors[0].component).toBe('station');
      expect(parsed.errors[0].message).toContain('Unknown station code: XYZ');
      expect(parsed.errors[0].suggestions).toBeDefined();
    });

    test('should detect invalid sequence number', () => {
      const marker = 'Red Triangle - VLP - 1000';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      
      expect(parsed.isValid).toBe(false);
      expect(parsed.errors).toHaveLength(1);
      expect(parsed.errors[0].component).toBe('sequence');
      expect(parsed.errors[0].message).toContain('Invalid sequence number: 1000');
    });

    test('should detect multiple validation errors', () => {
      const marker = 'Purple Hexagon - XYZ - 0';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      
      expect(parsed.isValid).toBe(false);
      expect(parsed.errors.length).toBeGreaterThan(1);
      
      const errorComponents = parsed.errors.map(e => e.component);
      expect(errorComponents).toContain('color');
      expect(errorComponents).toContain('symbol');
      expect(errorComponents).toContain('station');
      expect(errorComponents).toContain('sequence');
    });

    test('should handle malformed marker format', () => {
      const marker = 'completely invalid input that cannot be parsed';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      
      expect(parsed.isValid).toBe(false);
      expect(parsed.errors.length).toBeGreaterThan(0);
      // Should have format error or multiple component errors
      const hasFormatError = parsed.errors.some(e => e.component === 'format');
      const hasComponentErrors = parsed.errors.some(e => ['color', 'symbol', 'station'].includes(e.component));
      expect(hasFormatError || hasComponentErrors).toBe(true);
    });
  });

  describe('Routing Path Generation', () => {
    test('should generate routing path for valid marker', () => {
      const marker = 'Red Triangle - VLP - 4';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      const routingPath = networkRouter.generateRoutingPath(parsed);
      
      expect(routingPath.origin.code).toBe('DDR'); // Always originates from Dadar
      expect(routingPath.destination.code).toBe('VLP');
      expect(routingPath.destinationType).toBe(DestinationType.RESIDENTIAL_CHAWL);
      expect(routingPath.priority).toBe(PriorityLevel.URGENT);
      expect(routingPath.sortingHub).toBe('Dadar');
      expect(routingPath.sortingTime).toContain('10:30 AM');
      expect(routingPath.route).toBeDefined();
      expect(routingPath.route.length).toBeGreaterThan(0);
    });

    test('should throw error for invalid marker', () => {
      const marker = 'Invalid Format';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      
      expect(() => networkRouter.generateRoutingPath(parsed)).toThrow('Cannot generate routing path for invalid marker');
    });

    test('should include proper timing constraints', () => {
      const marker = 'Green Square - BKC - 1';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      const routingPath = networkRouter.generateRoutingPath(parsed);
      
      expect(routingPath.collectionTime).toBeDefined();
      expect(routingPath.deliveryTime).toBeDefined();
      expect(routingPath.sortingTime).toContain('10:30 AM');
    });
  });

  describe('Timing Calculations', () => {
    test('should calculate timing constraints', () => {
      const marker = 'Red Triangle - VLP - 4';
      const parsed = networkRouter.parseDeliveryMarker(marker);
      const timing = networkRouter.calculateTiming(parsed);
      
      expect(timing.collectionWindow.start).toBeDefined();
      expect(timing.collectionWindow.end).toBeDefined();
      expect(timing.sortingTime).toContain('10:30 AM');
      expect(timing.deliveryWindow.start).toBeDefined();
      expect(timing.deliveryWindow.end).toBeDefined();
    });

    test('should adjust timing for urgent priority', () => {
      const marker = 'Red Triangle - VLP - 4'; // Red = Urgent
      const parsed = networkRouter.parseDeliveryMarker(marker);
      const timing = networkRouter.calculateTiming(parsed);
      
      // Urgent deliveries should have shorter delivery windows
      const deliveryStart = new Date(`1970-01-01 ${timing.deliveryWindow.start}`);
      const deliveryEnd = new Date(`1970-01-01 ${timing.deliveryWindow.end}`);
      const durationMinutes = (deliveryEnd.getTime() - deliveryStart.getTime()) / (1000 * 60);
      
      expect(durationMinutes).toBeLessThanOrEqual(60); // Urgent = 60 minutes max
    });
  });

  describe('Mumbai Slang Processing', () => {
    test('should detect and process Mumbai slang', () => {
      const input = 'Red Triangle - VLP - 4 but Jhol in the route';
      const processed = networkRouter.handleMumbaiSlang(input);
      
      expect(processed.originalInput).toBe(input);
      expect(processed.slangDetected.length).toBeGreaterThan(0);
      expect(processed.expansions.length).toBeGreaterThan(0);
      expect(processed.expansions[0]).toContain('alternative paths');
    });

    test('should handle Dadar handoff failed scenario', () => {
      const input = 'Dadar handoff failed for Red Triangle - VLP - 4';
      const processed = networkRouter.handleMumbaiSlang(input);
      
      expect(processed.slangDetected.length).toBeGreaterThan(0);
      expect(processed.expansions[0]).toContain('secondary sort at 1:00 PM');
    });

    test('should return original input when no slang detected', () => {
      const input = 'Red Triangle - VLP - 4';
      const processed = networkRouter.handleMumbaiSlang(input);
      
      expect(processed.originalInput).toBe(input);
      expect(processed.processedInput).toBe(input);
      expect(processed.slangDetected).toHaveLength(0);
      expect(processed.expansions).toHaveLength(0);
    });
  });

  describe('Station Code Suggestions', () => {
    test('should suggest closest station codes for typos', () => {
      const marker = 'Red Triangle - VLQ - 4'; // VLQ instead of VLP
      const parsed = networkRouter.parseDeliveryMarker(marker);
      
      expect(parsed.isValid).toBe(false);
      const stationError = parsed.errors.find(e => e.component === 'station');
      expect(stationError?.suggestions).toContain('VLP');
    });
  });
});