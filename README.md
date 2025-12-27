# Bambaiyya-Binary Logistics Decoder

**Gold Tier Terminal for the Dabbawala Network**

A sophisticated logistics decoder that digitizes Mumbai's 130-year-old Dabbawala delivery system. This terminal application acts as a Network Router, parsing visual delivery markers into complete routing paths using deterministic algorithms and authentic Mumbai terminology.

## 🚂 Features

- **Industrial Terminal Interface**: Cyberpunk railway dashboard with monospace fonts
- **Binary Protocol Decoder**: Parses symbolic delivery markers (colors, shapes, station codes)
- **Deterministic Routing**: Consistent routing calculations with Dadar Sorting Hub timing
- **Mumbai Authenticity**: Handles local slang and terminology ("Jhol in the route", "Dadar handoff failed")
- **Edge Computing**: Works entirely offline using local protocol files
- **Property-Based Testing**: Robust validation with 100+ test iterations per property

## 🎯 System Architecture

```
┌─────────────────────────────────────────┐
│           Terminal Interface            │
│    (Industrial UI/Railway Dashboard)    │
├─────────────────────────────────────────┤
│          Network Router Engine          │
│     (Parsing & Routing Logic)          │
├─────────────────────────────────────────┤
│         Protocol Knowledge Base         │
│      (Binary Protocol Parser)          │
├─────────────────────────────────────────┤
│           Local File System            │
│      (.kiro/binary_protocol.md)        │
└─────────────────────────────────────────┘
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Run tests
npm test

# Start production build
npm start
```

## 📋 Usage

Input delivery markers in the format: `"Red Triangle - VLP - 4"`

The system will decode:
- **Color**: Priority level (Red = High-density area)
- **Symbol**: Destination type (Triangle = Residential Chawl)  
- **Station**: Location (VLP = Vile Parle)
- **Sequence**: Delivery order (4)

Output: Complete routing path with timing constraints and Dadar Sorting Hub integration.

## 🏗️ Development

This project follows spec-driven development with comprehensive requirements, design, and implementation tasks defined in `.kiro/specs/dabbawala-logistics-decoder/`.

## 🧪 Testing

- **Unit Tests**: Jest for specific scenarios and edge cases
- **Property-Based Tests**: fast-check for universal correctness properties
- **Integration Tests**: End-to-end workflow validation

## 📜 License

MIT License - Digitizing Mumbai's delivery heritage with respect and authenticity.