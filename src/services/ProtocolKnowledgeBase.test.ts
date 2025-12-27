// Unit tests for Protocol Knowledge Base Service
import { ProtocolKnowledgeBase } from './ProtocolKnowledgeBase';
import { DestinationType, PriorityLevel } from '../models';

describe('ProtocolKnowledgeBase', () => {
  let knowledgeBase: ProtocolKnowledgeBase;

  beforeEach(async () => {
    knowledgeBase = new ProtocolKnowledgeBase();
    await knowledgeBase.initialize();
  });

  describe('Initialization', () => {
    test('should load protocol data successfully', async () => {
      const stats = knowledgeBase.getProtocolStats();
      
      expect(stats.stations).toBeGreaterThanOrEqual(15);
      expect(stats.symbols).toBeGreaterThanOrEqual(5);
      expect(stats.colors).toBeGreaterThanOrEqual(5);
      expect(stats.slangTerms).toBeGreaterThan(0);
      expect(stats.timingRules).toBeGreaterThan(0);
    });

    test('should validate protocol completeness', () => {
      const validation = knowledgeBase.validateProtocolCompleteness();
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  describe('Station Code Operations', () => {
    test('should retrieve station by code', () => {
      const vlpStation = knowledgeBase.getStationByCode('VLP');
      
      expect(vlpStation).toBeDefined();
      expect(vlpStation?.code).toBe('VLP');
      expect(vlpStation?.fullName).toBe('Vile Parle');
      expect(vlpStation?.zone).toBe('Zone 2');
      expect(vlpStation?.area).toBe('Western Suburbs');
      expect(vlpStation?.coordinates).toBeDefined();
    });

    test('should handle case-insensitive station codes', () => {
      const station1 = knowledgeBase.getStationByCode('VLP');
      const station2 = knowledgeBase.getStationByCode('vlp');
      
      expect(station1).toEqual(station2);
    });

    test('should return undefined for invalid station codes', () => {
      const invalidStation = knowledgeBase.getStationByCode('XYZ');
      
      expect(invalidStation).toBeUndefined();
    });

    test('should retrieve Dadar sorting hub', () => {
      const dadarStation = knowledgeBase.getStationByCode('DDR');
      
      expect(dadarStation).toBeDefined();
      expect(dadarStation?.fullName).toBe('Dadar');
      expect(dadarStation?.code).toBe('DDR');
    });

    test('should list all station codes', () => {
      const stationCodes = knowledgeBase.getAllStationCodes();
      
      expect(stationCodes).toContain('VLP');
      expect(stationCodes).toContain('DDR');
      expect(stationCodes).toContain('BKC');
      expect(stationCodes.length).toBeGreaterThanOrEqual(15);
    });
  });

  describe('Symbol Logic Operations', () => {
    test('should retrieve symbol by shape', () => {
      const circleSymbol = knowledgeBase.getSymbolByShape('Circle');
      
      expect(circleSymbol).toBeDefined();
      expect(circleSymbol?.shape).toBe('Circle');
      expect(circleSymbol?.destinationType).toBe(DestinationType.INDUSTRIAL_ESTATE);
      expect(circleSymbol?.description).toContain('Manufacturing');
    });

    test('should handle case-insensitive symbol shapes', () => {
      const symbol1 = knowledgeBase.getSymbolByShape('Circle');
      const symbol2 = knowledgeBase.getSymbolByShape('circle');
      
      expect(symbol1).toEqual(symbol2);
    });

    test('should support symbol aliases', () => {
      const circleSymbol1 = knowledgeBase.getSymbolByShape('Circle');
      const circleSymbol2 = knowledgeBase.getSymbolByShape('○');
      
      expect(circleSymbol1).toEqual(circleSymbol2);
    });

    test('should list all symbol shapes', () => {
      const symbolShapes = knowledgeBase.getAllSymbolShapes();
      
      expect(symbolShapes).toContain('Circle');
      expect(symbolShapes).toContain('Triangle');
      expect(symbolShapes).toContain('Square');
      expect(symbolShapes).toContain('Diamond');
      expect(symbolShapes).toContain('Star');
      expect(symbolShapes.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Color Spectrum Operations', () => {
    test('should retrieve color by name', () => {
      const redColor = knowledgeBase.getColorByName('Red');
      
      expect(redColor).toBeDefined();
      expect(redColor?.name).toBe('Red');
      expect(redColor?.priority).toBe(PriorityLevel.URGENT);
      expect(redColor?.hexCode).toBe('#FF0000');
      expect(redColor?.areaType).toContain('High-density');
    });

    test('should handle case-insensitive color names', () => {
      const color1 = knowledgeBase.getColorByName('Red');
      const color2 = knowledgeBase.getColorByName('red');
      
      expect(color1).toEqual(color2);
    });

    test('should list all color names', () => {
      const colorNames = knowledgeBase.getAllColorNames();
      
      expect(colorNames).toContain('Red');
      expect(colorNames).toContain('Orange');
      expect(colorNames).toContain('Yellow');
      expect(colorNames).toContain('Green');
      expect(colorNames).toContain('Blue');
      expect(colorNames.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Timing Operations', () => {
    test('should retrieve sorting hub time', () => {
      const sortingTime = knowledgeBase.getSortingHubTime();
      
      expect(sortingTime).toBe('10:30 AM');
    });

    test('should retrieve timing constraints', () => {
      const timingConstraints = knowledgeBase.getTimingConstraints();
      
      expect(timingConstraints.length).toBeGreaterThan(0);
      
      const sortingRule = timingConstraints.find(rule => rule.phase === 'Sorting');
      expect(sortingRule).toBeDefined();
      expect(sortingRule?.standardTime).toContain('10:30 AM');
    });
  });

  describe('Mumbai Slang Operations', () => {
    test('should retrieve Mumbai slang terms', () => {
      const slangTerms = knowledgeBase.getMumbaiSlang();
      
      expect(slangTerms.length).toBeGreaterThan(0);
      
      const jholSlang = slangTerms.find((slang: any) => slang.slang === 'Jhol in the route');
      expect(jholSlang).toBeDefined();
      expect(jholSlang.meaning).toContain('delay');
    });
  });

  describe('Configuration Reloading', () => {
    test('should reload protocol without errors', async () => {
      const initialStats = knowledgeBase.getProtocolStats();
      
      await knowledgeBase.reloadProtocol();
      
      const reloadedStats = knowledgeBase.getProtocolStats();
      expect(reloadedStats).toEqual(initialStats);
    });
  });

  describe('Error Handling', () => {
    test('should throw error when not initialized', () => {
      const uninitializedKB = new ProtocolKnowledgeBase();
      
      expect(() => uninitializedKB.getStationByCode('VLP')).toThrow('not initialized');
    });
  });
});