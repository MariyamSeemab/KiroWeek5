"use strict";
// Protocol Knowledge Base Service for Bambaiyya-Binary Logistics Decoder
// Manages loading, caching, and accessing protocol configuration data
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolKnowledgeBase = void 0;
const BinaryProtocolParser_1 = require("../parsers/BinaryProtocolParser");
class ProtocolKnowledgeBase {
    constructor(protocolFilePath) {
        this.protocolData = null;
        this.stationCodesMap = new Map();
        this.symbolLogicMap = new Map();
        this.colorSpectrumMap = new Map();
        this.timingConstraints = [];
        this.isLoaded = false;
        this.parser = new BinaryProtocolParser_1.BinaryProtocolParser(protocolFilePath);
    }
    async initialize() {
        await this.loadProtocolData();
    }
    async loadProtocolData() {
        try {
            this.protocolData = await this.parser.parseProtocolFile();
            this.buildMaps();
            this.isLoaded = true;
            console.log('✅ Binary Protocol loaded successfully');
            console.log(`   Stations: ${this.stationCodesMap.size}`);
            console.log(`   Symbols: ${this.symbolLogicMap.size}`);
            console.log(`   Colors: ${this.colorSpectrumMap.size}`);
            console.log(`   Slang terms: ${this.protocolData.mumbaiSlang.length}`);
        }
        catch (error) {
            console.error('❌ Failed to load Binary Protocol:', error);
            throw error;
        }
    }
    buildMaps() {
        if (!this.protocolData)
            return;
        // Build station codes map
        this.stationCodesMap.clear();
        for (const station of this.protocolData.stationCodes) {
            const stationInfo = {
                code: station.code,
                fullName: station.fullName,
                area: station.area,
                zone: station.zone,
                coordinates: this.getStationCoordinates(station.code) // Mock coordinates for now
            };
            this.stationCodesMap.set(station.code, stationInfo);
            // Also map aliases to the same station
            for (const alias of station.aliases) {
                this.stationCodesMap.set(alias.toUpperCase(), stationInfo);
            }
        }
        // Build symbol logic map
        this.symbolLogicMap.clear();
        for (const symbol of this.protocolData.symbolLogic) {
            const symbolInfo = {
                shape: symbol.shape,
                destinationType: symbol.destinationType,
                description: symbol.description
            };
            this.symbolLogicMap.set(symbol.shape.toLowerCase(), symbolInfo);
            // Map common symbol representations
            const symbolMappings = this.getSymbolMappings(symbol.shape);
            for (const mapping of symbolMappings) {
                this.symbolLogicMap.set(mapping, symbolInfo);
            }
        }
        // Build color spectrum map
        this.colorSpectrumMap.clear();
        for (const color of this.protocolData.colorSpectrum) {
            const colorInfo = {
                name: color.color,
                priority: color.priority,
                areaType: color.areaType,
                hexCode: color.hexCode
            };
            this.colorSpectrumMap.set(color.color.toLowerCase(), colorInfo);
        }
        // Store timing constraints
        this.timingConstraints = [...this.protocolData.timingConstraints];
    }
    loadStationCodes() {
        this.ensureLoaded();
        return new Map(this.stationCodesMap);
    }
    getSymbolLogic() {
        this.ensureLoaded();
        return new Map(this.symbolLogicMap);
    }
    getColorSpectrum() {
        this.ensureLoaded();
        return new Map(this.colorSpectrumMap);
    }
    getTimingConstraints() {
        this.ensureLoaded();
        return [...this.timingConstraints];
    }
    async reloadProtocol() {
        console.log('🔄 Reloading Binary Protocol...');
        const oldStationCount = this.stationCodesMap.size;
        const oldSymbolCount = this.symbolLogicMap.size;
        const oldColorCount = this.colorSpectrumMap.size;
        await this.loadProtocolData();
        // Report changes
        const newStationCount = this.stationCodesMap.size;
        const newSymbolCount = this.symbolLogicMap.size;
        const newColorCount = this.colorSpectrumMap.size;
        if (oldStationCount !== newStationCount || oldSymbolCount !== newSymbolCount || oldColorCount !== newColorCount) {
            console.log('📊 Protocol changes detected:');
            if (oldStationCount !== newStationCount) {
                console.log(`   Stations: ${oldStationCount} → ${newStationCount}`);
            }
            if (oldSymbolCount !== newSymbolCount) {
                console.log(`   Symbols: ${oldSymbolCount} → ${newSymbolCount}`);
            }
            if (oldColorCount !== newColorCount) {
                console.log(`   Colors: ${oldColorCount} → ${newColorCount}`);
            }
        }
        else {
            console.log('✅ Protocol reloaded - no structural changes detected');
        }
    }
    // Helper methods for protocol access
    getStationByCode(code) {
        this.ensureLoaded();
        return this.stationCodesMap.get(code.toUpperCase());
    }
    getSymbolByShape(shape) {
        this.ensureLoaded();
        return this.symbolLogicMap.get(shape.toLowerCase());
    }
    getColorByName(color) {
        this.ensureLoaded();
        return this.colorSpectrumMap.get(color.toLowerCase());
    }
    getSortingHubTime() {
        this.ensureLoaded();
        const sortingRule = this.timingConstraints.find(rule => rule.phase === 'Sorting');
        const fullTime = sortingRule?.standardTime || '10:30 AM';
        // Extract just the time part, removing any additional text in parentheses
        return fullTime.replace(/\s*\([^)]*\)/, '');
    }
    getMumbaiSlang() {
        this.ensureLoaded();
        return this.protocolData?.mumbaiSlang || [];
    }
    getAllStationCodes() {
        this.ensureLoaded();
        return Array.from(new Set(Array.from(this.stationCodesMap.keys()).filter(key => key.length === 3)));
    }
    getAllSymbolShapes() {
        this.ensureLoaded();
        return Array.from(new Set(Array.from(this.symbolLogicMap.values()).map(symbol => symbol.shape)));
    }
    getAllColorNames() {
        this.ensureLoaded();
        return Array.from(new Set(Array.from(this.colorSpectrumMap.values()).map(color => color.name)));
    }
    // Validation methods
    validateProtocolCompleteness() {
        this.ensureLoaded();
        const errors = [];
        // Check minimum requirements from spec
        if (this.getAllStationCodes().length < 15) {
            errors.push(`Insufficient station codes: ${this.getAllStationCodes().length} (minimum 15 required)`);
        }
        if (this.getAllSymbolShapes().length < 5) {
            errors.push(`Insufficient symbol definitions: ${this.getAllSymbolShapes().length} (minimum 5 required)`);
        }
        // Check for required Dadar sorting hub
        const dadarStation = this.getStationByCode('DDR');
        if (!dadarStation) {
            errors.push('Missing required Dadar (DDR) sorting hub station');
        }
        // Check for sorting time configuration
        const sortingTime = this.getSortingHubTime();
        if (!sortingTime || sortingTime === '10:30 AM') {
            // This is actually correct, but let's verify it's properly configured
            const sortingRule = this.timingConstraints.find(rule => rule.phase === 'Sorting');
            if (!sortingRule) {
                errors.push('Missing sorting time configuration');
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    getProtocolStats() {
        this.ensureLoaded();
        return {
            stations: this.getAllStationCodes().length,
            symbols: this.getAllSymbolShapes().length,
            colors: this.getAllColorNames().length,
            slangTerms: this.getMumbaiSlang().length,
            timingRules: this.timingConstraints.length
        };
    }
    ensureLoaded() {
        if (!this.isLoaded) {
            throw new Error('Protocol Knowledge Base not initialized. Call initialize() first.');
        }
    }
    getStationCoordinates(stationCode) {
        // Mock coordinates for Mumbai stations - in a real system these would be actual GPS coordinates
        const coordinates = {
            'VLP': { lat: 19.0990, lng: 72.8442 },
            'AND': { lat: 19.1197, lng: 72.8464 },
            'JOG': { lat: 19.1347, lng: 72.8478 },
            'GOR': { lat: 19.1544, lng: 72.8410 },
            'MAL': { lat: 19.1875, lng: 72.8489 },
            'BOR': { lat: 19.2307, lng: 72.8567 },
            'DDR': { lat: 19.0176, lng: 72.8562 },
            'KUR': { lat: 19.0728, lng: 72.8826 },
            'GHA': { lat: 19.0864, lng: 72.9081 },
            'VIK': { lat: 19.1076, lng: 72.9252 },
            'BHA': { lat: 19.1438, lng: 72.9394 },
            'CST': { lat: 18.9398, lng: 72.8355 },
            'BCL': { lat: 18.9690, lng: 72.8205 },
            'KIN': { lat: 19.0330, lng: 72.8569 },
            'CHU': { lat: 19.0546, lng: 72.8776 },
            'BKC': { lat: 19.0596, lng: 72.8656 },
            'NAR': { lat: 18.9067, lng: 72.8147 },
            'POW': { lat: 19.1197, lng: 72.9089 }
        };
        return coordinates[stationCode] || { lat: 19.0760, lng: 72.8777 }; // Default to Mumbai center
    }
    getSymbolMappings(shape) {
        // Map various representations of symbols to canonical shapes
        const mappings = {
            'Circle': ['circle', 'o', '○', 'round'],
            'Triangle': ['triangle', 'tri', '△', 'arrow'],
            'Square': ['square', 'box', '□', 'rect'],
            'Diamond': ['diamond', 'rhombus', '◇', 'lozenge'],
            'Star': ['star', '★', 'asterisk', '*']
        };
        return mappings[shape] || [shape.toLowerCase()];
    }
}
exports.ProtocolKnowledgeBase = ProtocolKnowledgeBase;
//# sourceMappingURL=ProtocolKnowledgeBase.js.map