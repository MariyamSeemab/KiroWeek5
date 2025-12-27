// Simple Express Server for Bambaiyya-Binary Logistics Decoder
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Basic API endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'operational',
    service: 'Bambaiyya-Binary Logistics Decoder',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ready',
    stats: {
      stations: 18,
      symbols: 5,
      colors: 5,
      slangTerms: 4,
      timingRules: 3
    },
    validation: {
      isValid: true,
      errors: []
    },
    sortingHubTime: '10:30 AM',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/parse', (req, res) => {
  const { marker } = req.body;
  
  if (!marker) {
    return res.status(400).json({ 
      error: 'Invalid request', 
      message: 'Marker string is required' 
    });
  }
  
  // Simple parsing simulation
  const parts = marker.split(/[-\s]+/);
  if (parts.length >= 3) {
    const [color, symbol, station, sequence = '1'] = parts;
    
    // Simulate Six-Sigma reliability calculations
    const isWesternToCentral = ['VLP', 'AND', 'GOR'].includes(station.toUpperCase()) && 
                              ['KUR', 'GHA', 'DDR'].includes(station.toUpperCase());
    const currentHour = new Date().getHours();
    const isPeakHour = currentHour >= 10 && currentHour <= 11;
    const isMonsoon = [5, 6, 7, 8].includes(new Date().getMonth());
    
    // Calculate complexity score
    let complexityScore = 0.3; // Base + Transit + Final
    if (isWesternToCentral) complexityScore += 0.5; // Transfer hop
    
    const complexityRating = complexityScore >= 0.9 ? 'HIGH' : 
                           complexityScore >= 0.5 ? 'MEDIUM' : 'LOW';
    
    // Calculate system confidence
    let confidence = 99.99999;
    const degradationFactors = [];
    
    if (isWesternToCentral) {
      confidence -= 0.0001;
      degradationFactors.push({
        type: 'Dadar Penalty',
        impact: 0.0001,
        description: 'Western to Central line crossing penalty',
        isActive: true
      });
    }
    
    if (isPeakHour) {
      confidence -= 0.001;
      degradationFactors.push({
        type: 'Peak Hour Jitter',
        impact: 0.001,
        description: 'Peak hour packet collision probability',
        isActive: true
      });
    }
    
    if (isMonsoon) {
      const rainImpact = 2.0; // Simulate 10mm rainfall
      confidence -= rainImpact;
      degradationFactors.push({
        type: 'Rain Variable',
        impact: rainImpact,
        description: 'Monsoon impact: 10mm rainfall at Kurla/Parel',
        isActive: true
      });
    }
    
    // Determine threshold status
    let thresholdStatus;
    if (confidence > 99.9) {
      thresholdStatus = {
        status: 'OPTIMAL ROUTE',
        message: 'OPTIMAL ROUTE',
        color: '#32CD32',
        actionRequired: false
      };
    } else if (confidence >= 95.0) {
      thresholdStatus = {
        status: 'MONITORING ACTIVE (Delay Possible)',
        message: 'MONITORING ACTIVE (Delay Possible)',
        color: '#FFD700',
        actionRequired: false
      };
    } else {
      thresholdStatus = {
        status: 'JUGAAD PROTOCOL INITIATED (Critical Delay)',
        message: 'JUGAAD PROTOCOL INITIATED (Critical Delay)',
        color: '#FF0000',
        actionRequired: true
      };
    }
    
    // Format confidence display
    const formatted = confidence.toFixed(5);
    const confidenceParts = formatted.split('.');
    const wholePart = confidenceParts[0];
    const decimalPart = confidenceParts[1];
    const firstFour = decimalPart.substring(0, 4);
    const lastDigit = decimalPart.substring(4, 5);
    const displayFormat = `${wholePart}.${firstFour}[${lastDigit}]%`;
    
    // Generate alternate routes if needed
    const alternateRoutes = confidence < 99.0 ? [
      {
        description: 'Manual transfer route via Parel Node',
        alternateNode: 'Parel-Node instead of Dadar',
        expectedImprovement: 2.5,
        reasoning: 'Bypass high-traffic Dadar junction during peak hours'
      }
    ] : [];
    
    res.json({
      success: true,
      parsed: {
        color: { name: color, priority: color === 'Red' ? 'Urgent' : 'Standard' },
        symbol: { shape: symbol, destinationType: 'Commercial Complex' },
        station: { code: station, fullName: `${station} Station`, area: 'Mumbai', zone: 'Zone 1' },
        sequence: parseInt(sequence) || 1,
        isValid: true,
        errors: []
      },
      routingPath: {
        origin: { fullName: 'Collection Point', code: 'COL' },
        destination: { fullName: `${station} Station`, code: station },
        destinationType: 'Commercial Complex',
        priority: color === 'Red' ? 'Urgent' : 'Standard',
        sortingHub: 'Dadar',
        collectionTime: '9:00 AM',
        sortingTime: '10:30 AM',
        deliveryTime: '11:30 AM',
        route: [
          {
            from: 'Collection Point',
            to: `${station} Station`,
            mode: 'Local Railway',
            duration: 30,
            distance: 15
          }
        ],
        complexityScore: {
          score: complexityScore,
          rating: complexityRating,
          hops: [
            { type: 'Base Hop', weight: 0.1, description: 'Collection to Local Station' },
            { type: 'Transit Hop', weight: 0.2, description: 'Local Train to Sorting Hub' },
            { type: 'Final Hop', weight: 0.1, description: 'Sorting Hub to Destination' }
          ],
          calculation: `Base Hop (0.1) + Transit Hop (0.2) + Final Hop (0.1) = ${complexityScore}`
        },
        systemConfidence: { 
          finalConfidence: confidence,
          displayFormat: displayFormat,
          baselineAccuracy: 99.99999,
          degradationFactors: degradationFactors
        },
        reliabilityMetrics: {
          hopCount: 3,
          complexityScore: {
            score: complexityScore,
            rating: complexityRating,
            hops: [
              { type: 'Base Hop', weight: 0.1, description: 'Collection to Local Station' },
              { type: 'Transit Hop', weight: 0.2, description: 'Local Train to Sorting Hub' },
              { type: 'Final Hop', weight: 0.1, description: 'Sorting Hub to Destination' }
            ],
            calculation: `Base Hop (0.1) + Transit Hop (0.2) + Final Hop (0.1) = ${complexityScore}`
          },
          systemConfidence: {
            finalConfidence: confidence,
            displayFormat: displayFormat,
            baselineAccuracy: 99.99999,
            degradationFactors: degradationFactors
          },
          thresholdStatus: thresholdStatus,
          alternateRoutes: alternateRoutes
        }
      },
      timestamp: new Date().toISOString()
    });
  } else {
    res.json({
      success: false,
      parsed: {
        isValid: false,
        errors: [{ component: 'format', message: 'Invalid marker format' }]
      },
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/protocol', (req, res) => {
  res.json({
    stations: ['VLP', 'AND', 'DDR', 'BKC', 'CST', 'KUR', 'GHA', 'NAR'],
    symbols: ['Circle', 'Triangle', 'Square', 'Diamond', 'Star'],
    colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange'],
    slang: [
      { slang: 'Jhol in the route', meaning: 'Route complication' },
      { slang: 'Dadar handoff failed', meaning: 'Missed sorting window' }
    ],
    timestamp: new Date().toISOString()
  });
});

// Serve main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export for Vercel serverless functions
module.exports = app;

// Start server locally if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log('');
    console.log('🚂 Bambaiyya-Binary Logistics Decoder v1.0.0');
    console.log('   Gold Tier Terminal for the Dabbawala Network');
    console.log('   Digitizing 130 years of Mumbai delivery excellence');
    console.log('');
    console.log(`🌐 Server running on: http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at: http://localhost:${PORT}/api/`);
    console.log('');
    console.log('🎯 System ready for packet routing operations');
    console.log('   Dadar Sorting Hub synchronized at 10:30 AM');
    console.log('   Network Router operational with Mumbai terminology support');
    console.log('');
    console.log('💡 Try these endpoints:');
    console.log(`   GET  http://localhost:${PORT}/api/status`);
    console.log(`   POST http://localhost:${PORT}/api/parse`);
    console.log('');
  });
}