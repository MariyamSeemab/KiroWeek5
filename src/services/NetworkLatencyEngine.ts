// Network Latency Engine - Railway Jitter Simulation
// Calculates real-time train delays and handoff risks

export interface TrainStatus {
  line: 'Western' | 'Central' | 'Harbour';
  delayFactor: number; // 0-100%
  status: 'On-Time' | 'Minor Delay' | 'Major Delay' | 'Service Disruption' | 'Line Closure';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';
  bypassRequired: boolean;
}

export interface LatencyAlert {
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'EMERGENCY';
  message: string;
  action: string;
  timestamp: string;
}

export class NetworkLatencyEngine {
  private currentStatus: Map<string, TrainStatus> = new Map();
  private alerts: LatencyAlert[] = [];

  constructor() {
    this.initializeTrainStatus();
  }

  private initializeTrainStatus(): void {
    // Simulate real-time train status
    this.currentStatus.set('Western', {
      line: 'Western',
      delayFactor: Math.random() * 30, // 0-30% random delay
      status: 'On-Time',
      riskLevel: 'LOW',
      bypassRequired: false
    });

    this.currentStatus.set('Central', {
      line: 'Central', 
      delayFactor: Math.random() * 40, // Central line typically has more delays
      status: 'Minor Delay',
      riskLevel: 'MEDIUM',
      bypassRequired: false
    });

    this.currentStatus.set('Harbour', {
      line: 'Harbour',
      delayFactor: Math.random() * 20, // Harbour line is most reliable
      status: 'On-Time',
      riskLevel: 'LOW',
      bypassRequired: false
    });

    this.updateRiskLevels();
  }

  calculateHandoffRisk(stationCode: string, targetTime: string = '10:30 AM'): TrainStatus {
    const line = this.getLineForStation(stationCode);
    const status = this.currentStatus.get(line) || this.getDefaultStatus(line);
    
    // Apply peak hour multipliers
    const peakMultiplier = this.getPeakHourMultiplier();
    const adjustedDelay = status.delayFactor * peakMultiplier;
    
    // Update risk assessment
    const updatedStatus = {
      ...status,
      delayFactor: adjustedDelay,
      ...this.assessRisk(adjustedDelay)
    };

    this.currentStatus.set(line, updatedStatus);
    
    // Generate alerts if necessary
    this.checkForAlerts(updatedStatus);
    
    return updatedStatus;
  }

  private getLineForStation(stationCode: string): string {
    const westernStations = ['VLP', 'AND', 'JOG', 'GOR', 'MAL', 'BOR'];
    const centralStations = ['DDR', 'KUR', 'GHA', 'VIK', 'BHA'];
    const harbourStations = ['CST', 'BCL', 'KIN', 'CHU'];
    
    if (westernStations.includes(stationCode)) return 'Western';
    if (centralStations.includes(stationCode)) return 'Central';
    if (harbourStations.includes(stationCode)) return 'Harbour';
    
    return 'Central'; // Default to Central (includes Dadar)
  }

  private getPeakHourMultiplier(): number {
    const now = new Date();
    const hour = now.getHours();
    
    // Morning rush: 7-10 AM
    if (hour >= 7 && hour <= 10) return 1.3;
    
    // Evening rush: 5-8 PM  
    if (hour >= 17 && hour <= 20) return 1.5;
    
    // Monsoon season (simulate)
    const month = now.getMonth();
    if (month >= 5 && month <= 9) return 2.0; // June-October
    
    return 1.0; // Normal hours
  }

  private assessRisk(delayFactor: number): { status: TrainStatus['status'], riskLevel: TrainStatus['riskLevel'], bypassRequired: boolean } {
    if (delayFactor <= 10) {
      return { status: 'On-Time', riskLevel: 'LOW', bypassRequired: false };
    } else if (delayFactor <= 25) {
      return { status: 'Minor Delay', riskLevel: 'MEDIUM', bypassRequired: false };
    } else if (delayFactor <= 45) {
      return { status: 'Major Delay', riskLevel: 'HIGH', bypassRequired: true };
    } else if (delayFactor <= 70) {
      return { status: 'Service Disruption', riskLevel: 'CRITICAL', bypassRequired: true };
    } else {
      return { status: 'Line Closure', riskLevel: 'EMERGENCY', bypassRequired: true };
    }
  }

  private checkForAlerts(status: TrainStatus): void {
    const now = new Date().toISOString();
    
    if (status.delayFactor > 25 && status.delayFactor <= 45) {
      this.alerts.push({
        type: 'WARNING',
        message: `🟡 LATENCY ALERT: ${status.line} Line delays detected (${Math.round(status.delayFactor)}%)`,
        action: 'Monitoring active, backup routes prepared',
        timestamp: now
      });
    } else if (status.delayFactor > 45) {
      this.alerts.push({
        type: 'CRITICAL',
        message: `🔴 CRITICAL: ${status.line} Line handoff at risk (${Math.round(status.delayFactor)}%)`,
        action: 'Emergency protocols activated, Dadar bypass recommended',
        timestamp: now
      });
    }
    
    // Keep only last 10 alerts
    if (this.alerts.length > 10) {
      this.alerts = this.alerts.slice(-10);
    }
  }

  getBypassRoutes(stationCode: string): string[] {
    const line = this.getLineForStation(stationCode);
    
    switch (line) {
      case 'Western':
        return [
          'Route via AND (Andheri) direct delivery',
          'Bus connectivity from Dadar to Western suburbs',
          'Taxi service for urgent deliveries'
        ];
      case 'Central':
        return [
          'Route via KUR (Kurla) local distribution',
          'Auto-rickshaw network from Dadar',
          'Cross-line transfer via Harbour Line'
        ];
      case 'Harbour':
        return [
          'Route via CST (CST) emergency sorting',
          'Taxi services to South Mumbai',
          'Bus routes from Dadar to Harbour Line'
        ];
      default:
        return ['Manual intervention required'];
    }
  }

  getCurrentAlerts(): LatencyAlert[] {
    return [...this.alerts];
  }

  getNetworkStatus(): { overall: string, lines: Map<string, TrainStatus> } {
    const statuses = Array.from(this.currentStatus.values());
    const maxRisk = Math.max(...statuses.map(s => this.getRiskScore(s.riskLevel)));
    
    let overall = '🟢 GREEN';
    if (maxRisk >= 4) overall = '⚫ BLACK';
    else if (maxRisk >= 3) overall = '🔴 RED';
    else if (maxRisk >= 2) overall = '🟠 ORANGE';
    else if (maxRisk >= 1) overall = '🟡 YELLOW';
    
    return {
      overall,
      lines: new Map(this.currentStatus)
    };
  }

  private getRiskScore(riskLevel: TrainStatus['riskLevel']): number {
    switch (riskLevel) {
      case 'LOW': return 0;
      case 'MEDIUM': return 1;
      case 'HIGH': return 2;
      case 'CRITICAL': return 3;
      case 'EMERGENCY': return 4;
      default: return 0;
    }
  }

  private getDefaultStatus(line: string): TrainStatus {
    return {
      line: line as any,
      delayFactor: 0,
      status: 'On-Time',
      riskLevel: 'LOW',
      bypassRequired: false
    };
  }

  private updateRiskLevels(): void {
    for (const [line, status] of this.currentStatus) {
      const updated = {
        ...status,
        ...this.assessRisk(status.delayFactor)
      };
      this.currentStatus.set(line, updated);
    }
  }

  // Simulate real-time updates
  simulateRealTimeUpdates(): void {
    setInterval(() => {
      for (const [line, status] of this.currentStatus) {
        // Simulate minor fluctuations in delay
        const fluctuation = (Math.random() - 0.5) * 10; // ±5% change
        const newDelay = Math.max(0, Math.min(100, status.delayFactor + fluctuation));
        
        const updated = {
          ...status,
          delayFactor: newDelay,
          ...this.assessRisk(newDelay)
        };
        
        this.currentStatus.set(line, updated);
        this.checkForAlerts(updated);
      }
    }, 30000); // Update every 30 seconds
  }
}