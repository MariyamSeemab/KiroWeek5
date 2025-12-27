# Railway Topology & Network Latency Engine
## Real-Time Train Status Integration for Packet Routing

*This document defines the railway network topology and latency calculations for the Bambaiyya-Binary system. All routing decisions must account for real-time train delays and network jitter.*

---

## Railway Network Topology

### Primary Corridors
```
Western Line: BOR ←→ MAL ←→ GOR ←→ JOG ←→ AND ←→ VLP ←→ DDR
Central Line: BHA ←→ VIK ←→ GHA ←→ KUR ←→ DDR ←→ CST
Harbour Line: CHU ←→ KIN ←→ BCL ←→ CST
```

### Critical Junction Points
- **DDR (Dadar)**: Primary sorting hub - ALL packets route through here
- **CST (Chhatrapati Shivaji Terminus)**: South Mumbai distribution point
- **AND (Andheri)**: Western Line major interchange
- **KUR (Kurla)**: Central Line distribution hub

---

## Network Latency Factors

### Train Status Variables
- **On-Time**: 0% delay factor
- **Minor Delay**: 5-15 minutes (15% delay factor)
- **Major Delay**: 15-30 minutes (35% delay factor)
- **Service Disruption**: 30+ minutes (60% delay factor)
- **Line Closure**: Complete rerouting required (100% delay factor)

### Peak Hour Multipliers
- **Morning Rush** (7:00-10:00 AM): 1.3x delay factor
- **Evening Rush** (5:00-8:00 PM): 1.5x delay factor
- **Monsoon Season**: 2.0x delay factor
- **Festival Days**: 1.8x delay factor

---

## Handoff Risk Calculation

### Risk Matrix
```
Delay Factor | Handoff Risk | Action Required
0-10%       | LOW          | Standard routing via Dadar
11-25%      | MEDIUM       | Monitor for backup options
26-45%      | HIGH         | Prepare Dadar-bypass routes
46-70%      | CRITICAL     | Activate emergency protocols
71-100%     | EMERGENCY    | Direct routing, skip Dadar
```

### Dadar-Bypass Protocols
When Dadar handoff risk exceeds 45%:

1. **Western Line Bypass**: Route via AND (Andheri) direct delivery
2. **Central Line Bypass**: Route via KUR (Kurla) local distribution
3. **Harbour Line Bypass**: Route via CST (CST) emergency sorting
4. **Cross-Line Transfer**: Use bus/taxi for critical deliveries

---

## Real-Time Status Indicators

### Terminal Display Codes
- 🟢 **GREEN**: All lines operational, standard routing
- 🟡 **YELLOW**: Minor delays detected, monitoring active
- 🟠 **ORANGE**: Significant delays, backup routes prepared
- 🔴 **RED**: Critical delays, emergency protocols active
- ⚫ **BLACK**: Service disruption, manual intervention required

### Latency Alert Triggers
```javascript
if (delayFactor > 25%) {
  displayAlert("LATENCY ALERT: Train delays detected");
  calculateBypassRoutes();
}

if (delayFactor > 45%) {
  displayAlert("CRITICAL: Dadar handoff at risk");
  activateEmergencyProtocols();
}
```

---

## Line-Specific Characteristics

### Western Line
- **Peak Capacity**: 4,500 passengers per train
- **Average Delay**: 8 minutes during peak hours
- **Reliability**: 85% on-time performance
- **Bypass Options**: Andheri hub, bus connectivity

### Central Line  
- **Peak Capacity**: 4,200 passengers per train
- **Average Delay**: 12 minutes during peak hours
- **Reliability**: 78% on-time performance
- **Bypass Options**: Kurla hub, auto-rickshaw network

### Harbour Line
- **Peak Capacity**: 3,800 passengers per train
- **Average Delay**: 6 minutes during peak hours
- **Reliability**: 88% on-time performance
- **Bypass Options**: CST direct, taxi services

---

## Dynamic Routing Algorithms

### Standard Algorithm (Low Risk)
```
1. Collection → Local Station
2. Local Station → Dadar (10:30 AM sort)
3. Dadar → Destination Line
4. Destination Line → Final Delivery
```

### Bypass Algorithm (High Risk)
```
1. Collection → Local Station
2. Risk Assessment → Bypass Decision
3. Direct Route → Alternative Hub
4. Alternative Hub → Final Delivery
```

### Emergency Algorithm (Critical Risk)
```
1. Collection → Immediate Assessment
2. Direct Transport → Destination Area
3. Local Distribution → Final Delivery
4. Manual Confirmation → Delivery Complete
```

---

*Network Status: OPERATIONAL*  
*Last Updated: Real-time via Mumbai Local Train API*  
*Next Maintenance Window: Sunday 2:00-6:00 AM*