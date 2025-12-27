// Binary Protocol Parser for Bambaiyya-Binary Logistics Decoder
// Parses .kiro/binary_protocol.md to extract routing configuration

import * as fs from 'fs/promises';
import * as path from 'path';
import { 
  BinaryProtocolParser as IBinaryProtocolParser,
  ProtocolData,
  StationMapping,
  SymbolDefinition,
  ColorRule,
  TimingRule,
  SlangMapping
} from '../interfaces';
import { DestinationType, PriorityLevel } from '../models';

export class BinaryProtocolParser implements IBinaryProtocolParser {
  private protocolFilePath: string;

  constructor(protocolFilePath: string = '.kiro/binary_protocol.md') {
    this.protocolFilePath = protocolFilePath;
  }

  async parseProtocolFile(filePath?: string): Promise<ProtocolData> {
    const targetPath = filePath || this.protocolFilePath;
    
    try {
      const content = await fs.readFile(targetPath, 'utf-8');
      
      return {
        stationCodes: this.extractStationMappings(content),
        symbolLogic: this.extractSymbolDefinitions(content),
        colorSpectrum: this.extractColorRules(content),
        timingConstraints: this.extractTimingRules(content),
        mumbaiSlang: this.extractSlangMappings(content)
      };
    } catch (error) {
      throw new Error(`Failed to parse protocol file at ${targetPath}: ${error}`);
    }
  }

  extractStationMappings(content: string): StationMapping[] {
    const stationMappings: StationMapping[] = [];
    
    // Extract station mappings from the Station Key Mappings section
    const stationSection = this.extractSection(content, '## Station Key Mappings');
    if (!stationSection) return stationMappings;

    // Parse station entries like: - **VLP** = Vile Parle (Zone 2, Western Suburbs)
    const stationRegex = /- \*\*([A-Z]{3})\*\* = ([^(]+)\(([^)]+)\)/g;
    let match;

    while ((match = stationRegex.exec(stationSection)) !== null) {
      const [, code, fullName, zoneInfo] = match;
      const cleanFullName = fullName.trim();
      
      // Parse zone and area from zoneInfo like "Zone 2, Western Suburbs"
      const zoneMatch = zoneInfo.match(/Zone (\d+),?\s*(.+)/);
      const zone = zoneMatch ? `Zone ${zoneMatch[1]}` : 'Zone 1';
      const area = zoneMatch ? zoneMatch[2].trim() : 'Mumbai';

      // Extract aliases from Station Nicknames section
      const aliases = this.extractStationAliases(content, code);

      stationMappings.push({
        code,
        fullName: cleanFullName,
        area,
        zone,
        aliases
      });
    }

    return stationMappings;
  }

  extractSymbolDefinitions(content: string): SymbolDefinition[] {
    const symbolDefinitions: SymbolDefinition[] = [];
    
    // Extract from Symbol Logic Definitions section
    const symbolSection = this.extractSection(content, '## Symbol Logic Definitions');
    if (!symbolSection) return symbolDefinitions;

    // Parse symbol blocks like:
    // ### Circle (○)
    // - **Destination Type**: Industrial Estate
    // - **Description**: Manufacturing zones, warehouses, factory complexes
    // - **Examples**: Andheri SEEPZ, Vikhroli Industrial Estate, Powai IT Park
    
    const symbolBlocks = symbolSection.split('### ').slice(1); // Remove empty first element
    
    for (const block of symbolBlocks) {
      const lines = block.split('\n');
      const headerMatch = lines[0].match(/^(.+?)\s*\((.+?)\)/);
      
      if (!headerMatch) continue;
      
      const shape = headerMatch[1].trim();
      const symbol = headerMatch[2].trim();
      
      let destinationType = DestinationType.INDUSTRIAL_ESTATE;
      let description = '';
      let examples: string[] = [];
      
      for (const line of lines) {
        if (line.includes('**Destination Type**:')) {
          const typeMatch = line.match(/\*\*Destination Type\*\*:\s*(.+)/);
          if (typeMatch) {
            const typeStr = typeMatch[1].trim();
            destinationType = this.parseDestinationType(typeStr);
          }
        } else if (line.includes('**Description**:')) {
          const descMatch = line.match(/\*\*Description\*\*:\s*(.+)/);
          if (descMatch) {
            description = descMatch[1].trim();
          }
        } else if (line.includes('**Examples**:')) {
          const exampleMatch = line.match(/\*\*Examples\*\*:\s*(.+)/);
          if (exampleMatch) {
            examples = exampleMatch[1].split(',').map(ex => ex.trim());
          }
        }
      }
      
      symbolDefinitions.push({
        shape,
        destinationType,
        description,
        examples
      });
    }

    return symbolDefinitions;
  }

  extractColorRules(content: string): ColorRule[] {
    const colorRules: ColorRule[] = [];
    
    // Extract from Color Spectrum Priority System section
    const colorSection = this.extractSection(content, '## Color Spectrum Priority System');
    if (!colorSection) return colorRules;

    // Parse color blocks like:
    // ### Red (HIGH PRIORITY)
    // - **Area Type**: High-density commercial zones
    // - **Priority Level**: Urgent
    // - **Hex Code**: #FF0000
    // - **Description**: Financial district, prime business areas requiring immediate delivery
    
    const colorBlocks = colorSection.split('### ').slice(1);
    
    for (const block of colorBlocks) {
      const lines = block.split('\n');
      const headerMatch = lines[0].match(/^(.+?)\s*\((.+?)\)/);
      
      if (!headerMatch) continue;
      
      const color = headerMatch[1].trim();
      
      let areaType = '';
      let priority = PriorityLevel.STANDARD;
      let hexCode = '';
      let description = '';
      
      for (const line of lines) {
        if (line.includes('**Area Type**:')) {
          const areaMatch = line.match(/\*\*Area Type\*\*:\s*(.+)/);
          if (areaMatch) areaType = areaMatch[1].trim();
        } else if (line.includes('**Priority Level**:')) {
          const priorityMatch = line.match(/\*\*Priority Level\*\*:\s*(.+)/);
          if (priorityMatch) {
            priority = this.parsePriorityLevel(priorityMatch[1].trim());
          }
        } else if (line.includes('**Hex Code**:')) {
          const hexMatch = line.match(/\*\*Hex Code\*\*:\s*(.+)/);
          if (hexMatch) hexCode = hexMatch[1].trim();
        } else if (line.includes('**Description**:')) {
          const descMatch = line.match(/\*\*Description\*\*:\s*(.+)/);
          if (descMatch) description = descMatch[1].trim();
        }
      }
      
      colorRules.push({
        color,
        priority,
        areaType,
        hexCode,
        description
      });
    }

    return colorRules;
  }

  extractTimingRules(content: string): TimingRule[] {
    const timingRules: TimingRule[] = [];
    
    // Extract from Timing Constraints & Cycle Operations section
    const timingSection = this.extractSection(content, '## Timing Constraints & Cycle Operations');
    if (!timingSection) return timingRules;

    // Parse Primary Sorting Hub Schedule
    const sortingMatch = timingSection.match(/\*\*Critical Sorting Time\*\*:\s*([^*\n]+)/);
    if (sortingMatch) {
      timingRules.push({
        phase: 'Sorting',
        standardTime: sortingMatch[1].trim(),
        constraints: ['Fixed reference point', 'All routing calculations use this time']
      });
    }

    // Parse Collection Window
    const collectionMatch = timingSection.match(/\*\*Collection Window\*\*:\s*([^*\n]+)/);
    if (collectionMatch) {
      timingRules.push({
        phase: 'Collection',
        standardTime: collectionMatch[1].trim(),
        constraints: ['Must arrive before sorting time']
      });
    }

    // Parse Dispatch Window
    const dispatchMatch = timingSection.match(/\*\*Dispatch Window\*\*:\s*([^*\n]+)/);
    if (dispatchMatch) {
      timingRules.push({
        phase: 'Delivery',
        standardTime: dispatchMatch[1].trim(),
        constraints: ['Post-sorting dispatch to final destinations']
      });
    }

    return timingRules;
  }

  private extractSlangMappings(content: string): SlangMapping[] {
    const slangMappings: SlangMapping[] = [];
    
    // Extract from Mumbai Slang & Local Terminology section
    const slangSection = this.extractSection(content, '## Mumbai Slang & Local Terminology');
    if (!slangSection) return slangMappings;

    // Parse slang entries like:
    // - **"Jhol in the route"** = Routing complication detected
    //   - *Meaning*: Unexpected delay or obstacle in delivery path
    //   - *Action*: Calculate alternative routing options
    //   - *Alternatives*: "Route mein problem", "Delivery stuck"
    
    const slangRegex = /- \*\*"([^"]+)"\*\* = ([^\n]+)/g;
    let match;

    while ((match = slangRegex.exec(slangSection)) !== null) {
      const [, slang, meaning] = match;
      
      // Find the context and alternatives for this slang term
      const slangBlockStart = content.indexOf(match[0]);
      const nextSlangStart = content.indexOf('- **"', slangBlockStart + 1);
      const blockEnd = nextSlangStart === -1 ? content.length : nextSlangStart;
      const slangBlock = content.substring(slangBlockStart, blockEnd);
      
      // Extract meaning, context, and alternatives
      const meaningMatch = slangBlock.match(/\*Meaning\*:\s*([^\n]+)/);
      const contextMatch = slangBlock.match(/\*Action\*:\s*([^\n]+)/);
      const alternativesMatch = slangBlock.match(/\*Alternatives\*:\s*([^\n]+)/);
      
      const alternatives = alternativesMatch 
        ? alternativesMatch[1].split(',').map(alt => alt.trim().replace(/"/g, ''))
        : [];

      slangMappings.push({
        slang,
        meaning: meaningMatch ? meaningMatch[1].trim() : meaning.trim(),
        context: contextMatch ? contextMatch[1].trim() : 'General usage',
        alternatives
      });
    }

    return slangMappings;
  }

  private extractSection(content: string, sectionHeader: string): string | null {
    const startIndex = content.indexOf(sectionHeader);
    if (startIndex === -1) return null;
    
    // Find the next section header (##) or end of file
    const nextSectionIndex = content.indexOf('\n## ', startIndex + 1);
    const endIndex = nextSectionIndex === -1 ? content.length : nextSectionIndex;
    
    return content.substring(startIndex, endIndex);
  }

  private extractStationAliases(content: string, stationCode: string): string[] {
    // Look for aliases in the Station Nicknames & Aliases section
    const aliasSection = this.extractSection(content, '### Station Nicknames & Aliases');
    if (!aliasSection) return [];

    const aliasRegex = new RegExp(`- \\*\\*${stationCode}\\*\\*:\\s*([^\\n]+)`, 'i');
    const match = aliasSection.match(aliasRegex);
    
    if (match) {
      return match[1].split(',').map(alias => alias.trim().replace(/"/g, ''));
    }
    
    return [];
  }

  private parseDestinationType(typeStr: string): DestinationType {
    switch (typeStr.toLowerCase()) {
      case 'industrial estate':
        return DestinationType.INDUSTRIAL_ESTATE;
      case 'residential chawl':
        return DestinationType.RESIDENTIAL_CHAWL;
      case 'commercial complex':
        return DestinationType.COMMERCIAL_COMPLEX;
      case 'government office':
        return DestinationType.GOVERNMENT_OFFICE;
      case 'educational institute':
        return DestinationType.EDUCATIONAL_INSTITUTE;
      default:
        return DestinationType.INDUSTRIAL_ESTATE;
    }
  }

  private parsePriorityLevel(priorityStr: string): PriorityLevel {
    switch (priorityStr.toLowerCase()) {
      case 'urgent':
        return PriorityLevel.URGENT;
      case 'high':
        return PriorityLevel.HIGH;
      case 'medium':
        return PriorityLevel.MEDIUM;
      case 'low':
        return PriorityLevel.LOW;
      case 'standard':
        return PriorityLevel.STANDARD;
      default:
        return PriorityLevel.STANDARD;
    }
  }
}