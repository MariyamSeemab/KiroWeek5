"use strict";
// Core Data Models for Bambaiyya-Binary Logistics Decoder
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReliabilityThreshold = exports.DegradationFactorType = exports.ComplexityRating = exports.HopType = exports.PriorityLevel = exports.DestinationType = void 0;
var DestinationType;
(function (DestinationType) {
    DestinationType["INDUSTRIAL_ESTATE"] = "Industrial Estate";
    DestinationType["RESIDENTIAL_CHAWL"] = "Residential Chawl";
    DestinationType["COMMERCIAL_COMPLEX"] = "Commercial Complex";
    DestinationType["GOVERNMENT_OFFICE"] = "Government Office";
    DestinationType["EDUCATIONAL_INSTITUTE"] = "Educational Institute";
})(DestinationType || (exports.DestinationType = DestinationType = {}));
var PriorityLevel;
(function (PriorityLevel) {
    PriorityLevel["HIGH"] = "High";
    PriorityLevel["MEDIUM"] = "Medium";
    PriorityLevel["LOW"] = "Low";
    PriorityLevel["URGENT"] = "Urgent";
    PriorityLevel["STANDARD"] = "Standard";
})(PriorityLevel || (exports.PriorityLevel = PriorityLevel = {}));
var HopType;
(function (HopType) {
    HopType["BASE_HOP"] = "Base Hop";
    HopType["TRANSIT_HOP"] = "Transit Hop";
    HopType["TRANSFER_HOP"] = "Transfer Hop";
    HopType["FINAL_HOP"] = "Final Hop"; // Sorting Hub to Destination (Weight: 0.1)
})(HopType || (exports.HopType = HopType = {}));
var ComplexityRating;
(function (ComplexityRating) {
    ComplexityRating["LOW"] = "LOW";
    ComplexityRating["MEDIUM"] = "MEDIUM";
    ComplexityRating["HIGH"] = "HIGH"; // 0.9+: Cross-line Transfer / Multi-hub
})(ComplexityRating || (exports.ComplexityRating = ComplexityRating = {}));
var DegradationFactorType;
(function (DegradationFactorType) {
    DegradationFactorType["DADAR_PENALTY"] = "Dadar Penalty";
    DegradationFactorType["PEAK_HOUR_JITTER"] = "Peak Hour Jitter";
    DegradationFactorType["RAIN_VARIABLE"] = "Rain Variable"; // 2% per 10mm at Kurla/Parel
})(DegradationFactorType || (exports.DegradationFactorType = DegradationFactorType = {}));
var ReliabilityThreshold;
(function (ReliabilityThreshold) {
    ReliabilityThreshold["OPTIMAL"] = "OPTIMAL ROUTE";
    ReliabilityThreshold["MONITORING"] = "MONITORING ACTIVE (Delay Possible)";
    ReliabilityThreshold["CRITICAL"] = "JUGAAD PROTOCOL INITIATED (Critical Delay)"; // < 95%
})(ReliabilityThreshold || (exports.ReliabilityThreshold = ReliabilityThreshold = {}));
//# sourceMappingURL=index.js.map