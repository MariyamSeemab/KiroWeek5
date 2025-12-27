# Bambaiyya-Binary Protocol Specification
## Network Router Configuration for Dabbawala Logistics System

*This document defines the symbolic coding system used by the Mumbai Dabbawala Network for deterministic routing operations. All Network Router components must reference this protocol for accurate packet decoding.*

---

## Station Key Mappings

### Western Railway Corridor
- **VLP** = Vile Parle (Zone 2, Western Suburbs)
- **AND** = Andheri (Zone 2, Western Suburbs) 
- **JOG** = Jogeshwari (Zone 2, Western Suburbs)
- **GOR** = Goregaon (Zone 3, Western Suburbs)
- **MAL** = Malad (Zone 3, Western Suburbs)
- **BOR** = Borivali (Zone 3, Western Suburbs)

### Central Railway Corridor  
- **DDR** = Dadar (Zone 1, Central Hub) *[PRIMARY SORTING HUB]*
- **KUR** = Kurla (Zone 2, Central Suburbs)
- **GHA** = Ghatkopar (Zone 2, Central Suburbs)
- **VIK** = Vikhroli (Zone 3, Central Suburbs)
- **BHA** = Bhandup (Zone 3, Central Suburbs)

### Harbour Line
- **CST** = Chhatrapati Shivaji Terminus (Zone 1, South Mumbai)
- **BCL** = Mumbai Central (Zone 1, South Mumbai)
- **KIN** = King's Circle (Zone 1, Central Mumbai)
- **CHU** = Chunabhatti (Zone 2, Harbour Line)

### Business Districts
- **BKC** = Bandra Kurla Complex (Zone 2, Commercial Hub)
- **NAR** = Nariman Point (Zone 1, Financial District)
- **POW** = Powai (Zone 3, IT Hub)

---

## Symbol Logic Definitions

### Circle (○)
- **Destination Type**: Industrial Estate
- **Description**: Manufacturing zones, warehouses, factory complexes
- **Examples**: Andheri SEEPZ, Vikhroli Industrial Estate, Powai IT Park
- **Routing Priority**: Standard industrial timing (9:00 AM - 6:00 PM)

### Triangle (△)  
- **Destination Type**: Residential Chawl
- **Description**: Dense residential communities, housing societies
- **Examples**: Dharavi clusters, Worli villages, Bandra East societies
- **Routing Priority**: Lunch delivery timing (12:00 PM - 2:00 PM)

### Square (□)
- **Destination Type**: Commercial Complex
- **Description**: Office buildings, shopping centers, malls
- **Examples**: Nariman Point towers, BKC offices, Phoenix Mills
- **Routing Priority**: Business hours (10:00 AM - 7:00 PM)

### Diamond (◇)
- **Destination Type**: Government Office  
- **Description**: Municipal buildings, administrative centers
- **Examples**: BMC offices, Mantralaya, Collectorate
- **Routing Priority**: Government timing (10:00 AM - 5:30 PM)

### Star (★)
- **Destination Type**: Educational Institute
- **Description**: Schools, colleges, universities, training centers
- **Examples**: IIT Powai, Mumbai University, St. Xavier's College
- **Routing Priority**: Academic hours (8:00 AM - 4:00 PM)

---

## Color Spectrum Priority System

### Red (HIGH PRIORITY)
- **Area Type**: High-density commercial zones
- **Priority Level**: Urgent
- **Hex Code**: #FF0000
- **Description**: Financial district, prime business areas requiring immediate delivery
- **Examples**: Nariman Point, Fort, Ballard Estate

### Orange (MEDIUM-HIGH PRIORITY)
- **Area Type**: Mixed commercial-residential
- **Priority Level**: High  
- **Hex Code**: #FF8C00
- **Description**: Busy suburban centers with time-sensitive deliveries
- **Examples**: Bandra, Andheri, Ghatkopar

### Yellow (STANDARD PRIORITY)
- **Area Type**: Suburban residential
- **Priority Level**: Medium
- **Hex Code**: #FFD700
- **Description**: Regular residential areas with standard delivery windows
- **Examples**: Vile Parle, Kurla, Chunabhatti

### Green (LOW PRIORITY)
- **Area Type**: Suburban hub
- **Priority Level**: Standard
- **Hex Code**: #32CD32
- **Description**: Outer suburban areas with flexible delivery timing
- **Examples**: Borivali, Vikhroli, Powai

### Blue (SPECIAL ROUTING)
- **Area Type**: Island city core
- **Priority Level**: High
- **Hex Code**: #003399
- **Description**: South Mumbai heritage areas requiring special handling
- **Examples**: Colaba, Churchgate, Marine Drive

---

## Timing Constraints & Cycle Operations

### Primary Sorting Hub Schedule
- **Location**: Dadar Railway Station (DDR)
- **Critical Sorting Time**: 10:30 AM (FIXED REFERENCE POINT)
- **Collection Window**: 9:00 AM - 10:15 AM
- **Dispatch Window**: 10:45 AM - 11:30 AM
- **Secondary Sort**: 1:00 PM (for late arrivals)

### Zone-Based Delivery Windows
- **Zone 1** (South Mumbai): 11:45 AM - 1:15 PM
- **Zone 2** (Central Suburbs): 12:00 PM - 1:30 PM  
- **Zone 3** (Outer Suburbs): 12:15 PM - 1:45 PM

### Route Timing Calculations
- **Collection to Dadar**: 15-45 minutes (depending on zone)
- **Sorting Duration**: 15 minutes standard
- **Dadar to Delivery**: 30-60 minutes (depending on destination zone)
- **Buffer Time**: 10 minutes per transfer point

---

## Mumbai Slang & Local Terminology

### Operational Terms
- **"Jhol in the route"** = Routing complication detected
  - *Meaning*: Unexpected delay or obstacle in delivery path
  - *Action*: Calculate alternative routing options
  - *Alternatives*: "Route mein problem", "Delivery stuck"

- **"Dadar handoff failed"** = Primary sorting hub transfer unsuccessful  
  - *Meaning*: Packet missed the 10:30 AM sorting window
  - *Action*: Route to 1:00 PM secondary sort or direct delivery
  - *Alternatives*: "Dadar miss ho gaya", "Sorting time nikla"

- **"Packet chalega"** = Delivery will proceed as planned
  - *Meaning*: Route confirmed, no complications
  - *Context*: Positive routing confirmation

- **"Local pakad"** = Catch the local train
  - *Meaning*: Use suburban railway for fastest routing
  - *Context*: Time-critical delivery instructions

### Station Nicknames & Aliases
- **VLP**: "VP", "Vile Parle", "Ville"
- **DDR**: "Dadar TT", "Central Hub", "Main Junction"  
- **BKC**: "Bandra Complex", "BK Complex"
- **CST**: "VT", "Victoria Terminus", "Main Station"
- **AND**: "Andheri Station", "Western Hub"

### Area Classifications
- **"Bombie"** = Mumbai local/native
- **"Gully"** = Narrow lane requiring walking delivery
- **"Society"** = Residential building complex
- **"Chawl"** = Traditional tenement housing
- **"Mill area"** = Former textile mill converted zones

---

## Error Handling Protocols

### Invalid Station Codes
- **Action**: Suggest closest matching stations
- **Format**: "Station code '{CODE}' not recognized. Did you mean: {SUGGESTIONS}?"

### Unknown Symbols  
- **Action**: List valid symbol options
- **Format**: "Symbol '{SYMBOL}' invalid. Valid options: Circle, Triangle, Square, Diamond, Star"

### Color Validation Failures
- **Action**: Display color spectrum with priorities
- **Format**: "Color '{COLOR}' not in spectrum. Valid: Red (Urgent), Orange (High), Yellow (Medium), Green (Standard), Blue (Special)"

### Timing Conflicts
- **Action**: Calculate next available delivery window
- **Format**: "Requested timing conflicts with Dadar sort. Next available: {TIME}"

---

## Network Router Implementation Notes

### Deterministic Routing Requirements
- All routing calculations MUST use Dadar 10:30 AM as reference point
- Symbol-to-destination mappings MUST remain consistent across sessions
- Color-to-priority assignments MUST be deterministic
- Station code expansions MUST include full location details

### Offline Operation Specifications  
- All routing logic contained within this protocol file
- No external API calls or network dependencies
- Local file system storage for all configuration data
- Cached protocol data for system startup without file access

### Authentication & Validation
- Protocol version: 1.0.0
- Last updated: Mumbai Dabbawala Heritage Foundation
- Validation checksum: MD5 hash verification recommended
- Backward compatibility: Maintain support for legacy marker formats

---

*End of Protocol Specification*

**System Status**: OPERATIONAL  
**Network Router**: READY FOR PACKET PROCESSING  
**Dadar Sorting Hub**: SYNCHRONIZED  
**Mumbai Terminology Database**: LOADED**