// System Monitor - Real-time Performance and Health Monitoring
// Provides comprehensive system monitoring for the Bambaiyya Binary system

import { EventEmitter } from 'events';
import { NetworkRouter } from './NetworkRouter';
import { ProtocolKnowledgeBase } from './ProtocolKnowledgeBase';
import { BambaiyyaDebugger } from './BambaiyyaDebugger';
import { ReliabilityMetricsEngine } from './ReliabilityMetricsEngine';

export interface SystemMetrics {
  timestamp: string;
  uptime: number;
  performance: PerformanceMetrics;
  health: HealthMetrics;
  operations: OperationMetrics;
  resources: ResourceMetrics;
  alerts: Alert[];
}

export interface PerformanceMetrics {
  requestsPerSecond: number;
  averageResponseTime: number;
  successRate: number;
  errorRate: number;
  throughput: number;
  latency: {
    p50: number;
    p95: number;
    p99: number;
  };
}

export interface HealthMetrics {
  overall: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
  components: {
    protocolKB: ComponentHealth;
    networkRouter: ComponentHealth;
    reliabilityEngine: ComponentHealth;
    debugger: ComponentHealth;
  };
  systemIntegrity: number; // 0-100%
}

export interface ComponentHealth {
  status: 'OPERATIONAL' | 'DEGRADED' | 'FAILED';
  responseTime: number;
  errorCount: number;
  lastError?: string;
  uptime: number;
}

export interface OperationMetrics {
  totalRequests: number;
  successfulParsing: number;
  failedParsing: number;
  routingOperations: number;
  slangProcessing: number;
  reliabilityCalculations: number;
}

export interface ResourceMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    connectionsActive: number;
  };
}

export interface Alert {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  component: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  severity: number; // 1-10
}

export class SystemMonitor extends EventEmitter {
  private networkRouter: NetworkRouter;
  private protocolKB: ProtocolKnowledgeBase;
  private bambaiyyaDebugger: BambaiyyaDebugger;
  private reliabilityEngine: ReliabilityMetricsEngine;
  
  private metrics: SystemMetrics;
  private operationMetrics: OperationMetrics;
  private performanceHistory: PerformanceMetrics[] = [];
  private alerts: Alert[] = [];
  private monitoringInterval?: NodeJS.Timeout;
  private startTime: number;
  private requestTimes: number[] = [];
  private activeConnections: number = 0;

  constructor(
    networkRouter: NetworkRouter,
    protocolKB: ProtocolKnowledgeBase,
    bambaiyyaDebugger: BambaiyyaDebugger,
    reliabilityEngine: ReliabilityMetricsEngine
  ) {
    super();
    
    this.networkRouter = networkRouter;
    this.protocolKB = protocolKB;
    this.bambaiyyaDebugger = bambaiyyaDebugger;
    this.reliabilityEngine = reliabilityEngine;
    this.startTime = Date.now();
    
    this.operationMetrics = {
      totalRequests: 0,
      successfulParsing: 0,
      failedParsing: 0,
      routingOperations: 0,
      slangProcessing: 0,
      reliabilityCalculations: 0
    };
    
    this.metrics = this.initializeMetrics();
    this.startMonitoring();
  }

  private initializeMetrics(): SystemMetrics {
    return {
      timestamp: new Date().toISOString(),
      uptime: 0,
      performance: {
        requestsPerSecond: 0,
        averageResponseTime: 0,
        successRate: 100,
        errorRate: 0,
        throughput: 0,
        latency: { p50: 0, p95: 0, p99: 0 }
      },
      health: {
        overall: 'EXCELLENT',
        components: {
          protocolKB: { status: 'OPERATIONAL', responseTime: 0, errorCount: 0, uptime: 0 },
          networkRouter: { status: 'OPERATIONAL', responseTime: 0, errorCount: 0, uptime: 0 },
          reliabilityEngine: { status: 'OPERATIONAL', responseTime: 0, errorCount: 0, uptime: 0 },
          debugger: { status: 'OPERATIONAL', responseTime: 0, errorCount: 0, uptime: 0 }
        },
        systemIntegrity: 100
      },
      operations: this.operationMetrics,
      resources: {
        memory: { used: 0, total: 0, percentage: 0 },
        cpu: { usage: 0, loadAverage: [] },
        network: { bytesIn: 0, bytesOut: 0, connectionsActive: 0 }
      },
      alerts: []
    };
  }

  startMonitoring(): void {
    console.log('📊 Starting system monitoring...');
    
    this.monitoringInterval = setInterval(() => {
      this.updateMetrics();
      this.checkAlerts();
      this.emit('metrics-updated', this.metrics);
    }, 5000); // Update every 5 seconds
    
    console.log('✅ System monitoring active');
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    console.log('📊 System monitoring stopped');
  }

  private updateMetrics(): void {
    const now = Date.now();
    const uptime = (now - this.startTime) / 1000;
    
    this.metrics = {
      timestamp: new Date().toISOString(),
      uptime,
      performance: this.calculatePerformanceMetrics(),
      health: this.calculateHealthMetrics(),
      operations: { ...this.operationMetrics },
      resources: this.calculateResourceMetrics(),
      alerts: this.getActiveAlerts()
    };
    
    // Keep performance history (last 100 entries)
    this.performanceHistory.push(this.metrics.performance);
    if (this.performanceHistory.length > 100) {
      this.performanceHistory.shift();
    }
  }

  private calculatePerformanceMetrics(): PerformanceMetrics {
    const now = Date.now();
    const recentRequests = this.requestTimes.filter(time => now - time < 60000); // Last minute
    
    const requestsPerSecond = recentRequests.length / 60;
    const averageResponseTime = recentRequests.length > 0 
      ? recentRequests.reduce((sum, time) => sum + time, 0) / recentRequests.length 
      : 0;
    
    const successRate = this.operationMetrics.totalRequests > 0 
      ? (this.operationMetrics.successfulParsing / this.operationMetrics.totalRequests) * 100 
      : 100;
    
    const errorRate = 100 - successRate;
    
    // Calculate latency percentiles
    const sortedTimes = [...recentRequests].sort((a, b) => a - b);
    const latency = {
      p50: this.getPercentile(sortedTimes, 50),
      p95: this.getPercentile(sortedTimes, 95),
      p99: this.getPercentile(sortedTimes, 99)
    };
    
    return {
      requestsPerSecond,
      averageResponseTime,
      successRate,
      errorRate,
      throughput: requestsPerSecond,
      latency
    };
  }

  private calculateHealthMetrics(): HealthMetrics {
    const components = {
      protocolKB: this.checkComponentHealth('protocolKB'),
      networkRouter: this.checkComponentHealth('networkRouter'),
      reliabilityEngine: this.checkComponentHealth('reliabilityEngine'),
      debugger: this.checkComponentHealth('debugger')
    };
    
    // Calculate overall health
    const componentStatuses = Object.values(components);
    const operationalCount = componentStatuses.filter(c => c.status === 'OPERATIONAL').length;
    const degradedCount = componentStatuses.filter(c => c.status === 'DEGRADED').length;
    const failedCount = componentStatuses.filter(c => c.status === 'FAILED').length;
    
    let overall: HealthMetrics['overall'];
    let systemIntegrity: number;
    
    if (failedCount > 0) {
      overall = 'CRITICAL';
      systemIntegrity = Math.max(0, 100 - (failedCount * 30) - (degradedCount * 15));
    } else if (degradedCount > 1) {
      overall = 'POOR';
      systemIntegrity = Math.max(50, 100 - (degradedCount * 20));
    } else if (degradedCount === 1) {
      overall = 'FAIR';
      systemIntegrity = Math.max(70, 100 - (degradedCount * 15));
    } else if (operationalCount === componentStatuses.length) {
      overall = this.metrics.performance.successRate > 95 ? 'EXCELLENT' : 'GOOD';
      systemIntegrity = Math.min(100, 85 + (this.metrics.performance.successRate * 0.15));
    } else {
      overall = 'GOOD';
      systemIntegrity = 85;
    }
    
    return {
      overall,
      components,
      systemIntegrity
    };
  }

  private checkComponentHealth(component: string): ComponentHealth {
    const now = Date.now();
    const uptime = (now - this.startTime) / 1000;
    
    try {
      let status: ComponentHealth['status'] = 'OPERATIONAL';
      let responseTime = 0;
      let errorCount = 0;
      let lastError: string | undefined;
      
      // Component-specific health checks
      switch (component) {
        case 'protocolKB':
          const startTime = Date.now();
          this.protocolKB.getProtocolStats();
          responseTime = Date.now() - startTime;
          
          const validation = this.protocolKB.validateProtocolCompleteness();
          if (!validation.isValid) {
            status = 'DEGRADED';
            errorCount = validation.errors.length;
            lastError = validation.errors[0];
          }
          break;
          
        case 'networkRouter':
          const routerStart = Date.now();
          const testParsed = this.networkRouter.parseDeliveryMarker('Red Triangle - VLP - 4');
          responseTime = Date.now() - routerStart;
          
          if (!testParsed.isValid) {
            status = 'DEGRADED';
            errorCount = 1;
            lastError = 'Basic parsing test failed';
          }
          break;
          
        case 'reliabilityEngine':
          const reliabilityStart = Date.now();
          this.reliabilityEngine.calculateSystemConfidence(99.99999, []);
          responseTime = Date.now() - reliabilityStart;
          break;
          
        case 'debugger':
          const debuggerStart = Date.now();
          this.bambaiyyaDebugger.getCurrentSession();
          responseTime = Date.now() - debuggerStart;
          break;
      }
      
      // Determine status based on response time and errors
      if (responseTime > 1000) {
        status = 'DEGRADED';
      }
      if (responseTime > 5000 || errorCount > 0) {
        status = 'FAILED';
      }
      
      return {
        status,
        responseTime,
        errorCount,
        lastError,
        uptime
      };
      
    } catch (error) {
      return {
        status: 'FAILED',
        responseTime: 0,
        errorCount: 1,
        lastError: error instanceof Error ? error.message : 'Unknown error',
        uptime
      };
    }
  }

  private calculateResourceMetrics(): ResourceMetrics {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memory: {
        used: memoryUsage.heapUsed,
        total: memoryUsage.heapTotal,
        percentage: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
      },
      cpu: {
        usage: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert to seconds
        loadAverage: process.platform !== 'win32' ? require('os').loadavg() : [0, 0, 0]
      },
      network: {
        bytesIn: 0, // Would need network monitoring library
        bytesOut: 0,
        connectionsActive: this.activeConnections
      }
    };
  }

  private getPercentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0;
    
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, Math.min(index, sortedArray.length - 1))];
  }

  private checkAlerts(): void {
    const currentAlerts: Alert[] = [];
    
    // Check performance alerts
    if (this.metrics.performance.errorRate > 10) {
      currentAlerts.push({
        id: `alert-${Date.now()}-error-rate`,
        type: 'WARNING',
        component: 'Performance',
        message: `High error rate detected: ${this.metrics.performance.errorRate.toFixed(1)}%`,
        timestamp: new Date().toISOString(),
        resolved: false,
        severity: 6
      });
    }
    
    if (this.metrics.performance.averageResponseTime > 2000) {
      currentAlerts.push({
        id: `alert-${Date.now()}-response-time`,
        type: 'WARNING',
        component: 'Performance',
        message: `Slow response time: ${this.metrics.performance.averageResponseTime.toFixed(0)}ms`,
        timestamp: new Date().toISOString(),
        resolved: false,
        severity: 5
      });
    }
    
    // Check resource alerts
    if (this.metrics.resources.memory.percentage > 85) {
      currentAlerts.push({
        id: `alert-${Date.now()}-memory`,
        type: 'ERROR',
        component: 'Resources',
        message: `High memory usage: ${this.metrics.resources.memory.percentage.toFixed(1)}%`,
        timestamp: new Date().toISOString(),
        resolved: false,
        severity: 7
      });
    }
    
    // Check component health alerts
    for (const [componentName, health] of Object.entries(this.metrics.health.components)) {
      if (health.status === 'FAILED') {
        currentAlerts.push({
          id: `alert-${Date.now()}-${componentName}`,
          type: 'CRITICAL',
          component: componentName,
          message: `Component failed: ${health.lastError || 'Unknown error'}`,
          timestamp: new Date().toISOString(),
          resolved: false,
          severity: 9
        });
      } else if (health.status === 'DEGRADED') {
        currentAlerts.push({
          id: `alert-${Date.now()}-${componentName}`,
          type: 'WARNING',
          component: componentName,
          message: `Component degraded: ${health.lastError || 'Performance issues'}`,
          timestamp: new Date().toISOString(),
          resolved: false,
          severity: 4
        });
      }
    }
    
    // Add new alerts and emit events
    for (const alert of currentAlerts) {
      if (!this.alerts.find(a => a.component === alert.component && a.type === alert.type)) {
        this.alerts.push(alert);
        this.emit('alert', alert);
      }
    }
    
    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(-50);
    }
  }

  private getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  // Public methods for tracking operations
  recordRequest(responseTime: number): void {
    this.requestTimes.push(responseTime);
    this.operationMetrics.totalRequests++;
    
    // Keep only last 1000 request times
    if (this.requestTimes.length > 1000) {
      this.requestTimes.shift();
    }
  }

  recordSuccessfulParsing(): void {
    this.operationMetrics.successfulParsing++;
  }

  recordFailedParsing(): void {
    this.operationMetrics.failedParsing++;
  }

  recordRoutingOperation(): void {
    this.operationMetrics.routingOperations++;
  }

  recordSlangProcessing(): void {
    this.operationMetrics.slangProcessing++;
  }

  recordReliabilityCalculation(): void {
    this.operationMetrics.reliabilityCalculations++;
  }

  incrementActiveConnections(): void {
    this.activeConnections++;
  }

  decrementActiveConnections(): void {
    this.activeConnections = Math.max(0, this.activeConnections - 1);
  }

  // Getters
  getCurrentMetrics(): SystemMetrics {
    return { ...this.metrics };
  }

  getPerformanceHistory(): PerformanceMetrics[] {
    return [...this.performanceHistory];
  }

  getAlerts(): Alert[] {
    return [...this.alerts];
  }

  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      this.emit('alert-resolved', alert);
      return true;
    }
    return false;
  }

  // Generate monitoring report
  generateReport(): string {
    const metrics = this.getCurrentMetrics();
    
    let report = '# System Monitoring Report\n\n';
    report += `Generated: ${metrics.timestamp}\n`;
    report += `Uptime: ${(metrics.uptime / 3600).toFixed(2)} hours\n\n`;
    
    report += '## System Health\n';
    report += `Overall: ${metrics.health.overall}\n`;
    report += `System Integrity: ${metrics.health.systemIntegrity.toFixed(1)}%\n\n`;
    
    report += '## Performance Metrics\n';
    report += `Requests/sec: ${metrics.performance.requestsPerSecond.toFixed(2)}\n`;
    report += `Success Rate: ${metrics.performance.successRate.toFixed(1)}%\n`;
    report += `Average Response Time: ${metrics.performance.averageResponseTime.toFixed(0)}ms\n\n`;
    
    report += '## Component Status\n';
    for (const [name, health] of Object.entries(metrics.health.components)) {
      report += `- ${name}: ${health.status} (${health.responseTime}ms)\n`;
    }
    
    if (metrics.alerts.length > 0) {
      report += '\n## Active Alerts\n';
      for (const alert of metrics.alerts) {
        report += `- ${alert.type}: ${alert.message} (${alert.component})\n`;
      }
    }
    
    return report;
  }
}