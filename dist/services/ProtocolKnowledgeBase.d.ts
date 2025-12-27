import { ProtocolKnowledgeBase as IProtocolKnowledgeBase, StationInfo, SymbolInfo, ColorInfo, TimingRule } from '../interfaces';
export declare class ProtocolKnowledgeBase implements IProtocolKnowledgeBase {
    private parser;
    private protocolData;
    private stationCodesMap;
    private symbolLogicMap;
    private colorSpectrumMap;
    private timingConstraints;
    private isLoaded;
    constructor(protocolFilePath?: string);
    initialize(): Promise<void>;
    private loadProtocolData;
    private buildMaps;
    loadStationCodes(): Map<string, StationInfo>;
    getSymbolLogic(): Map<string, SymbolInfo>;
    getColorSpectrum(): Map<string, ColorInfo>;
    getTimingConstraints(): TimingRule[];
    reloadProtocol(): Promise<void>;
    getStationByCode(code: string): StationInfo | undefined;
    getSymbolByShape(shape: string): SymbolInfo | undefined;
    getColorByName(color: string): ColorInfo | undefined;
    getSortingHubTime(): string;
    getMumbaiSlang(): any[];
    getAllStationCodes(): string[];
    getAllSymbolShapes(): string[];
    getAllColorNames(): string[];
    validateProtocolCompleteness(): {
        isValid: boolean;
        errors: string[];
    };
    getProtocolStats(): {
        stations: number;
        symbols: number;
        colors: number;
        slangTerms: number;
        timingRules: number;
    };
    private ensureLoaded;
    private getStationCoordinates;
    private getSymbolMappings;
}
//# sourceMappingURL=ProtocolKnowledgeBase.d.ts.map