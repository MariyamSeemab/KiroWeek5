// Specific Mumbai Slang Phrase Handlers
// Handles "Jhol in the route" and "Dadar handoff failed" scenarios

import { RoutingPath, ValidationError } from '../models';
import { ProtocolKnowledgeBase } from './ProtocolKnowledgeBase';

export interface RouteComplication {
  type: 'jhol' | 'dadar_failed' | 'general';
  severity: 'low' | 'medium' | 'high';
  alternatives: string[];
  estimatedDelay: number; // minutes
  recommendation: string;
}

export class SlangPhraseHandlers {
  private protocolKB: ProtocolKnowledgeBase;

  constructor(protocolKnowledgeBase: ProtocolKnowledgeBase) {
    this.protocolKB = protocolKnowledgeBase;
  }

  handleJholInRoute(originalRoute: RoutingPath): RouteComplication {
    console.log('🚨 Jhol detected in route - calculating alternatives...');
    
    const alternatives: string[] = [];
    let severity: 'low' | 'medium' | 'high' = 'medium';
    let estimatedDelay = 15; // Default 15 minute delay
    
    // Analyze the route complication based on destination zone
    switch (originalRoute.destination.zone) {
      case 'Zone 1':
        severity = 'low';
        estimatedDelay = 10;
        alternatives.push('Direct route via local train');
        alternatives.push('Walking route from nearest station');
        break;
        
      case 'Zone 2':
        severity = 'medium';
        estimatedDelay = 20;
        alternatives.push('Alternative railway line');
        alternatives.push('Bus route backup');
        alternatives.push('Cycle delivery from hub');
        break;
        
      case 'Zone 3':
        severity = 'high';
        estimatedDelay = 30;
        alternatives.push('Next available train service');
        alternatives.push('Road transport backup');
        alternatives.push('Delay to next delivery window');
        break;
    }
    
    // Add priority-based alternatives
    if (originalRoute.priority === 'Urgent') {
      alternatives.unshift('Express delivery via taxi');
      alternatives.unshift('Immediate cycle courier');
    }
    
    const recommendation = this.generateJholRecommendation(originalRoute, severity);
    
    return {
      type: 'jhol',
      severity,
      alternatives,
      estimatedDelay,
      recommendation
    };
  }

  handleDadarHandoffFailed(originalRoute: RoutingPath): RouteComplication {
    console.log('⚠️ Dadar handoff failed - routing to secondary sort...');
    
    const alternatives: string[] = [];
    const estimatedDelay = 150; // 2.5 hours to next sorting window
    const severity: 'low' | 'medium' | 'high' = 'high';
    
    // Calculate backup routing options
    alternatives.push('Route to 1:00 PM secondary sorting at Dadar');
    alternatives.push('Direct delivery bypass (if urgent)');
    alternatives.push('Hold for next day delivery');
    
    // Priority-based handling
    if (originalRoute.priority === 'Urgent') {
      alternatives.unshift('Emergency direct delivery');
      alternatives.unshift('Immediate courier dispatch');
    }
    
    // Zone-based alternatives
    if (originalRoute.destination.zone === 'Zone 1') {
      alternatives.push('Direct delivery from collection point');
    }
    
    const recommendation = this.generateDadarFailureRecommendation(originalRoute);
    
    return {
      type: 'dadar_failed',
      severity,
      alternatives,
      estimatedDelay,
      recommendation
    };
  }

  calculateBackupRouting(originalRoute: RoutingPath, complication: RouteComplication): RoutingPath {
    const backupRoute: RoutingPath = { ...originalRoute };
    
    switch (complication.type) {
      case 'jhol':
        // Adjust timing for route complications
        backupRoute.deliveryTime = this.addMinutesToTime(originalRoute.deliveryTime, complication.estimatedDelay);
        backupRoute.route = this.generateAlternativeRoute(originalRoute, complication);
        break;
        
      case 'dadar_failed':
        // Route to secondary sorting
        backupRoute.sortingTime = '1:00 PM (SECONDARY SORT)';
        backupRoute.collectionTime = this.addMinutesToTime(originalRoute.collectionTime, 30);
        backupRoute.deliveryTime = this.addMinutesToTime('1:00 PM', 45);
        backupRoute.route = this.generateSecondaryRoute(originalRoute);
        break;
    }
    
    return backupRoute;
  }

  private generateJholRecommendation(route: RoutingPath, severity: 'low' | 'medium' | 'high'): string {
    const destination = route.destination.fullName;
    const priority = route.priority;
    
    switch (severity) {
      case 'low':
        return `Minor route adjustment needed for ${destination}. Continue with standard delivery protocol.`;
      
      case 'medium':
        return `Route complication detected for ${destination}. Consider alternative transport mode. Priority: ${priority}.`;
      
      case 'high':
        return `Significant route disruption for ${destination}. Immediate alternative routing required. Priority: ${priority}.`;
      
      default:
        return `Route complication detected. Assess alternatives for ${destination}.`;
    }
  }

  private generateDadarFailureRecommendation(route: RoutingPath): string {
    const destination = route.destination.fullName;
    const priority = route.priority;
    
    if (priority === 'Urgent') {
      return `URGENT: Dadar sorting missed for ${destination}. Initiate emergency direct delivery protocol immediately.`;
    } else {
      return `Dadar handoff failed for ${destination}. Route to 1:00 PM secondary sort or consider next-day delivery. Priority: ${priority}.`;
    }
  }

  private generateAlternativeRoute(originalRoute: RoutingPath, complication: RouteComplication): any[] {
    const alternativeSegments = [...originalRoute.route];
    
    // Modify route based on complication
    alternativeSegments.forEach(segment => {
      segment.duration += complication.estimatedDelay / alternativeSegments.length;
    });
    
    // Add alternative transport note
    alternativeSegments.push({
      from: 'Route Adjustment',
      to: originalRoute.destination.fullName,
      mode: 'Alternative Transport',
      duration: complication.estimatedDelay,
      distance: 0
    });
    
    return alternativeSegments;
  }

  private generateSecondaryRoute(originalRoute: RoutingPath): any[] {
    return [
      {
        from: 'Collection Point',
        to: 'Dadar Secondary Sort',
        mode: 'Local Transport',
        duration: 30,
        distance: 5
      },
      {
        from: 'Dadar Secondary Sort (1:00 PM)',
        to: originalRoute.destination.fullName,
        mode: originalRoute.route[0]?.mode || 'Local Transport',
        duration: 45,
        distance: originalRoute.route[0]?.distance || 15
      }
    ];
  }

  private addMinutesToTime(timeStr: string, minutes: number): string {
    // Simple time addition - in production would use proper date/time library
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeMatch) return timeStr;
    
    let [, hours, mins, period] = timeMatch;
    let totalMinutes = parseInt(hours) * 60 + parseInt(mins) + minutes;
    
    // Handle AM/PM conversion
    if (period.toUpperCase() === 'PM' && parseInt(hours) !== 12) {
      totalMinutes += 12 * 60;
    }
    if (period.toUpperCase() === 'AM' && parseInt(hours) === 12) {
      totalMinutes -= 12 * 60;
    }
    
    // Convert back to 12-hour format
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    const newPeriod = newHours >= 12 ? 'PM' : 'AM';
    const displayHours = newHours === 0 ? 12 : newHours > 12 ? newHours - 12 : newHours;
    
    return `${displayHours}:${newMins.toString().padStart(2, '0')} ${newPeriod}`;
  }

  // Public methods for checking specific scenarios
  isJholScenario(input: string): boolean {
    const jholPatterns = [
      'jhol in the route',
      'route mein problem',
      'delivery stuck',
      'route complication',
      'path blocked'
    ];
    
    return jholPatterns.some(pattern => 
      input.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  isDadarFailureScenario(input: string): boolean {
    const dadarPatterns = [
      'dadar handoff failed',
      'dadar miss ho gaya',
      'sorting time nikla',
      'missed sorting',
      'dadar failed'
    ];
    
    return dadarPatterns.some(pattern => 
      input.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  getComplicationSeverity(input: string): 'low' | 'medium' | 'high' {
    const highSeverityKeywords = ['emergency', 'urgent', 'critical', 'immediate'];
    const lowSeverityKeywords = ['minor', 'small', 'slight', 'little'];
    
    const inputLower = input.toLowerCase();
    
    if (highSeverityKeywords.some(keyword => inputLower.includes(keyword))) {
      return 'high';
    }
    
    if (lowSeverityKeywords.some(keyword => inputLower.includes(keyword))) {
      return 'low';
    }
    
    return 'medium';
  }
}