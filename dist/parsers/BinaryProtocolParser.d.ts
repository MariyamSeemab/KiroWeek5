import { BinaryProtocolParser as IBinaryProtocolParser, ProtocolData, StationMapping, SymbolDefinition, ColorRule, TimingRule } from '../interfaces';
export declare class BinaryProtocolParser implements IBinaryProtocolParser {
    private protocolFilePath;
    constructor(protocolFilePath?: string);
    parseProtocolFile(filePath?: string): Promise<ProtocolData>;
    extractStationMappings(content: string): StationMapping[];
    extractSymbolDefinitions(content: string): SymbolDefinition[];
    extractColorRules(content: string): ColorRule[];
    extractTimingRules(content: string): TimingRule[];
    private extractSlangMappings;
    private extractSection;
    private extractStationAliases;
    private parseDestinationType;
    private parsePriorityLevel;
}
//# sourceMappingURL=BinaryProtocolParser.d.ts.map