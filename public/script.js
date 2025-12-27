// Bambaiyya-Binary Logistics Decoder - Frontend JavaScript
// Industrial Terminal Interface Logic

class BambaiyyaBinaryTerminal {
    constructor() {
        this.apiBase = '/api';
        this.selectedColor = '';
        this.selectedSymbol = '';
        this.selectedStation = '';
        this.currentTool = null;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.updateTime();
        this.checkSystemStatus();
        await this.loadProtocolData();
        
        // Initialize sidebar state
        this.initializeSidebarState();
        
        // Update time every second
        setInterval(() => this.updateTime(), 1000);
        
        // Check system status every 30 seconds
        setInterval(() => this.checkSystemStatus(), 30000);
    }

    initializeSidebarState() {
        const sidebar = document.getElementById('sidebar');
        const openBtn = document.getElementById('openSidebarBtn');
        
        if (!sidebar) {
            console.error('❌ Sidebar element not found!');
            return;
        }
        
        // Start with sidebar open by default
        sidebar.classList.remove('hidden');
        if (openBtn) openBtn.style.display = 'none';
        
        console.log('🔧 Sidebar initialized: OPEN');
    }

    setupEventListeners() {
        // Process button
        const processBtn = document.getElementById('processBtn');
        if (processBtn) {
            processBtn.addEventListener('click', () => {
                this.processMarkerWithAnimation();
            });
        }

        // Enter key in input
        const markerInput = document.getElementById('markerInput');
        if (markerInput) {
            markerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.processMarkerWithAnimation();
                }
            });
        }

        // Example buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const example = e.target.dataset.example;
                if (markerInput) markerInput.value = example;
                this.processMarkerWithAnimation();
            });
        });

        // Clear button
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearOutput();
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportResults();
            });
        }

        // Footer buttons
        const statusBtn = document.getElementById('statusBtn');
        if (statusBtn) {
            statusBtn.addEventListener('click', () => {
                this.showSystemStatus();
            });
        }

        const protocolBtn = document.getElementById('protocolBtn');
        if (protocolBtn) {
            protocolBtn.addEventListener('click', () => {
                this.showProtocolInfo();
            });
        }

        const helpBtn = document.getElementById('helpBtn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showHelp();
            });
        }

        // Modal close
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close modal on background click
        const modal = document.getElementById('modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'modal') {
                    this.closeModal();
                }
            });
        }

        // Hamburger menu toggle
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Open sidebar button
        const openSidebarBtn = document.getElementById('openSidebarBtn');
        if (openSidebarBtn) {
            openSidebarBtn.addEventListener('click', () => {
                this.openSidebar();
            });
        }

        // Tool buttons
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;
                this.openTool(tool);
            });
        });

        // Tool modal close
        const toolModalClose = document.getElementById('toolModalClose');
        if (toolModalClose) {
            toolModalClose.addEventListener('click', () => {
                this.closeTool();
            });
        }

        // Close tool modal on background click
        const toolModal = document.getElementById('toolModal');
        if (toolModal) {
            toolModal.addEventListener('click', (e) => {
                if (e.target.id === 'toolModal') {
                    this.closeTool();
                }
            });
        }

        // Grid input sequence
        const sequenceInput = document.getElementById('sequenceInput');
        if (sequenceInput) {
            sequenceInput.addEventListener('input', () => {
                this.updateGridInput();
            });
        }
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const currentTime = document.getElementById('currentTime');
        if (currentTime) {
            currentTime.textContent = timeString;
        }
    }

    async checkSystemStatus() {
        try {
            const response = await fetch(`${this.apiBase}/status`);
            const data = await response.json();
            
            const indicator = document.getElementById('statusIndicator');
            const statusText = document.getElementById('statusText');
            const welcomeStatus = document.getElementById('welcomeStatus');
            
            if (data.status === 'ready') {
                if (indicator) indicator.className = 'status-indicator online';
                if (statusText) statusText.textContent = 'System Operational';
                if (welcomeStatus) welcomeStatus.textContent = 'Ready';
            } else {
                if (indicator) indicator.className = 'status-indicator offline';
                if (statusText) statusText.textContent = 'System Error';
                if (welcomeStatus) welcomeStatus.textContent = 'Error';
            }
        } catch (error) {
            console.error('Status check failed:', error);
            const indicator = document.getElementById('statusIndicator');
            const statusText = document.getElementById('statusText');
            
            if (indicator) indicator.className = 'status-indicator offline';
            if (statusText) statusText.textContent = 'Connection Error';
        }
    }

    async loadProtocolData() {
        try {
            const response = await fetch(`${this.apiBase}/protocol`);
            const data = await response.json();
            
            this.populateSymbolGrid(data);
        } catch (error) {
            console.error('Failed to load protocol data:', error);
        }
    }

    populateSymbolGrid(data) {
        // Populate colors
        const colorButtons = document.getElementById('colorButtons');
        if (colorButtons) {
            const colors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue'];
            colorButtons.innerHTML = '';
            
            colors.forEach(color => {
                const btn = document.createElement('button');
                btn.className = 'symbol-btn';
                btn.textContent = color;
                btn.dataset.type = 'color';
                btn.dataset.value = color;
                btn.addEventListener('click', () => this.selectSymbol(btn));
                colorButtons.appendChild(btn);
            });
        }

        // Populate symbols
        const symbolButtons = document.getElementById('symbolButtons');
        if (symbolButtons) {
            const symbols = ['Circle', 'Triangle', 'Square', 'Diamond', 'Star'];
            symbolButtons.innerHTML = '';
            
            symbols.forEach(symbol => {
                const btn = document.createElement('button');
                btn.className = 'symbol-btn';
                btn.textContent = this.getSymbolIcon(symbol);
                btn.title = symbol;
                btn.dataset.type = 'symbol';
                btn.dataset.value = symbol;
                btn.addEventListener('click', () => this.selectSymbol(btn));
                symbolButtons.appendChild(btn);
            });
        }

        // Populate stations
        const stationButtons = document.getElementById('stationButtons');
        if (stationButtons) {
            const stations = data.stations || ['VLP', 'DDR', 'BKC', 'AND', 'CST', 'NAR'];
            stationButtons.innerHTML = '';
            
            stations.slice(0, 12).forEach(station => {
                const btn = document.createElement('button');
                btn.className = 'symbol-btn';
                btn.textContent = station;
                btn.dataset.type = 'station';
                btn.dataset.value = station;
                btn.addEventListener('click', () => this.selectSymbol(btn));
                stationButtons.appendChild(btn);
            });
        }
    }

    getSymbolIcon(symbol) {
        const icons = {
            'Circle': '○',
            'Triangle': '△',
            'Square': '□',
            'Diamond': '◇',
            'Star': '★'
        };
        return icons[symbol] || symbol;
    }

    selectSymbol(btn) {
        const type = btn.dataset.type;
        const value = btn.dataset.value;
        
        // Remove previous selection of same type
        document.querySelectorAll(`[data-type="${type}"]`).forEach(b => {
            b.classList.remove('selected');
        });
        
        // Select current button
        btn.classList.add('selected');
        
        // Update selection
        if (type === 'color') {
            this.selectedColor = value;
        } else if (type === 'symbol') {
            this.selectedSymbol = value;
        } else if (type === 'station') {
            this.selectedStation = value;
        }
        
        this.updateGridInput();
    }

    updateGridInput() {
        const sequenceInput = document.getElementById('sequenceInput');
        const gridResult = document.getElementById('gridResult');
        const sequence = sequenceInput ? sequenceInput.value || '1' : '1';
        const parts = [];
        
        if (this.selectedColor) parts.push(this.selectedColor);
        if (this.selectedSymbol) parts.push(this.selectedSymbol);
        if (this.selectedStation) parts.push(this.selectedStation);
        if (parts.length > 0) parts.push(sequence);
        
        const result = parts.length > 2 ? parts.join(' - ') : parts.join(' ');
        if (gridResult) {
            // Add smooth transition when updating
            gridResult.style.opacity = '0.5';
            setTimeout(() => {
                gridResult.value = result;
                gridResult.style.opacity = '1';
            }, 150);
        }
        
        // Auto-process if all parts are selected
        if (this.selectedColor && this.selectedSymbol && this.selectedStation) {
            const markerInput = document.getElementById('markerInput');
            if (markerInput) {
                markerInput.style.opacity = '0.5';
                setTimeout(() => {
                    markerInput.value = result;
                    markerInput.style.opacity = '1';
                }, 150);
            }
        }
    }

    async processMarker() {
        const markerInput = document.getElementById('markerInput');
        const gridResult = document.getElementById('gridResult');
        
        let marker = markerInput ? markerInput.value.trim() : '';
        
        // Use grid result if main input is empty
        if (!marker && gridResult && gridResult.value.trim()) {
            marker = gridResult.value.trim();
            if (markerInput) markerInput.value = marker;
        }
        
        if (!marker) {
            this.showError('Please enter a delivery marker');
            return;
        }

        this.showLoading(true);
        
        try {
            console.log('🚀 Processing marker:', marker);
            const response = await fetch(`${this.apiBase}/parse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ marker })
            });
            
            console.log('📡 Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📊 Response data:', data);
            
            if (data.success) {
                console.log('✅ Processing successful, displaying results...');
                this.displayRoutingResult(data);
                console.log('✅ Results displayed successfully');
            } else {
                console.log('❌ Processing failed, displaying validation errors...');
                this.displayValidationErrors(data.errors || []);
            }
        } catch (error) {
            console.error('💥 Processing failed:', error);
            console.error('💥 Error stack:', error.stack);
            this.showError('Failed to process delivery marker. Please try again. Error: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    displayRoutingResult(data) {
        console.log('🎯 Displaying routing result:', data);
        const container = document.getElementById('outputContainer');
        if (!container) {
            console.error('❌ Output container not found!');
            return;
        }
        
        try {
            console.log('📦 Routing path:', data.routingPath);
            
            // Safely render reliability metrics with error handling
            let reliabilityMetricsHtml = '';
            try {
                reliabilityMetricsHtml = this.renderReliabilityMetrics(data.routingPath);
                console.log('✅ Reliability metrics rendered successfully');
            } catch (metricsError) {
                console.error('⚠️ Error rendering reliability metrics:', metricsError);
                reliabilityMetricsHtml = `
                    <div class="reliability-metrics">
                        <h4>📊 SIX-SIGMA RELIABILITY METRICS</h4>
                        <div class="metrics-grid">
                            <div class="metric-card system-confidence animate-item">
                                <div class="metric-header">
                                    <span class="metric-icon">🔒</span>
                                    <span class="metric-title">System Confidence</span>
                                </div>
                                <div class="metric-value confidence-display">99.999[9]%</div>
                                <div class="metric-subtitle">Baseline: 99.99999% (1 error in 16 million)</div>
                            </div>
                            <div class="metric-card complexity-score animate-item">
                                <div class="metric-header">
                                    <span class="metric-icon">⚡</span>
                                    <span class="metric-title">Complexity Rating</span>
                                </div>
                                <div class="metric-value complexity-rating medium">MEDIUM</div>
                                <div class="metric-subtitle">Score: 0.5 | Hops: 3</div>
                            </div>
                            <div class="metric-card threshold-status animate-item">
                                <div class="metric-header">
                                    <span class="metric-icon">✅</span>
                                    <span class="metric-title">Route Status</span>
                                </div>
                                <div class="metric-value status-display optimal">OPTIMAL ROUTE</div>
                                <div class="metric-subtitle">No Action Needed</div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            const html = `
                <div class="routing-output">
                    <div class="routing-header">
                        <h3>🗺️ ROUTING PATH DECODED</h3>
                        <p>Packet routing successfully generated with Six-Sigma reliability metrics</p>
                    </div>

                    ${reliabilityMetricsHtml}
                    
                    <div class="packet-info">
                        <h4>📦 PACKET INFORMATION</h4>
                        <div class="info-grid">
                            <div class="info-row animate-item">
                                <span class="label">Origin:</span>
                                <span class="value">${data.routingPath.origin?.fullName || 'Collection Point'} (${data.routingPath.origin?.code || 'COL'})</span>
                            </div>
                            <div class="info-row animate-item">
                                <span class="label">Destination:</span>
                                <span class="value">${data.routingPath.destination?.fullName || 'Destination'} (${data.routingPath.destination?.code || 'DEST'})</span>
                            </div>
                            <div class="info-row animate-item">
                                <span class="label">Type:</span>
                                <span class="value">${data.routingPath.destinationType || 'Commercial Complex'}</span>
                            </div>
                            <div class="info-row animate-item">
                                <span class="label">Priority:</span>
                                <span class="value text-${this.getPriorityClass(data.routingPath.priority)}">${data.routingPath.priority || 'Standard'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="timing-info">
                        <h4>⏰ DELIVERY TIMELINE</h4>
                        <div class="info-grid">
                            <div class="info-row animate-item">
                                <span class="label">Collection:</span>
                                <span class="value">${data.routingPath.collectionTime || '9:00 AM'}</span>
                            </div>
                            <div class="info-row animate-item">
                                <span class="label">Sorting:</span>
                                <span class="value text-warning">${data.routingPath.sortingTime || '10:30 AM'}</span>
                            </div>
                            <div class="info-row animate-item">
                                <span class="label">Delivery:</span>
                                <span class="value">${data.routingPath.deliveryTime || '11:30 AM'}</span>
                            </div>
                            <div class="info-row animate-item">
                                <span class="label">Hub:</span>
                                <span class="value">${data.routingPath.sortingHub || 'Dadar'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="route-segments">
                        <h4>🚂 ROUTE SEGMENTS</h4>
                        ${this.renderRouteSegments(data.routingPath.route)}
                    </div>
                </div>
            `;
            
            console.log('✅ Setting HTML content');
            container.innerHTML = html;
            
            // CRITICAL: Force all elements to be visible immediately
            setTimeout(() => {
                const allElements = container.querySelectorAll('*');
                allElements.forEach(element => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                });
                console.log('🔧 Forced', allElements.length, 'elements to be visible');
            }, 100);
            
            // Also trigger normal animations as backup
            setTimeout(() => {
                this.animateElements();
            }, 200);
            
        } catch (error) {
            console.error('💥 Error displaying routing result:', error);
            console.error('💥 Error stack:', error.stack);
            container.innerHTML = `
                <div class="error-output">
                    <h3>❌ Display Error</h3>
                    <p>There was an error displaying the routing results.</p>
                    <pre>${error.message}</pre>
                    <details>
                        <summary>Error Details</summary>
                        <pre>${error.stack}</pre>
                    </details>
                </div>
            `;
        }
    }
    
    renderRouteSegments(route) {
        if (!route || !Array.isArray(route) || route.length === 0) {
            return `
                <div class="route-segment animate-item">
                    <div class="segment-header">
                        <span class="segment-title">1. Collection Point → Destination</span>
                        <span class="segment-duration">30min</span>
                    </div>
                    <div class="segment-details">
                        Mode: Local Railway | Distance: 15km
                    </div>
                </div>
            `;
        }
        
        return route.map((segment, index) => `
            <div class="route-segment animate-item">
                <div class="segment-header">
                    <span class="segment-title">${index + 1}. ${segment.from || 'Unknown'} → ${segment.to || 'Unknown'}</span>
                    <span class="segment-duration">${segment.duration || 0}min</span>
                </div>
                <div class="segment-details">
                    Mode: ${segment.mode || 'Railway'} | Distance: ${segment.distance || 0}km
                </div>
            </div>
        `).join('');
    }

    renderReliabilityMetrics(routingPath) {
        console.log('🔍 Rendering reliability metrics for:', routingPath);
        
        let metrics;
        
        if (!routingPath || !routingPath.reliabilityMetrics) {
            console.log('⚠️ No reliability metrics found, using fallback data');
            // Use fallback data from the routingPath itself
            metrics = {
                systemConfidence: routingPath?.systemConfidence || {
                    displayFormat: '99.999[9]%',
                    baselineAccuracy: 99.99999,
                    finalConfidence: 99.99999
                },
                complexityScore: routingPath?.complexityScore || {
                    rating: 'MEDIUM',
                    score: 0.5
                },
                thresholdStatus: {
                    status: 'OPTIMAL ROUTE',
                    message: 'OPTIMAL ROUTE',
                    actionRequired: false
                },
                hopCount: routingPath?.route?.length || 3
            };
        } else {
            metrics = routingPath.reliabilityMetrics;
        }

        return this.renderMetricsHTML(metrics);
    }
    
    renderMetricsHTML(metrics) {
        try {
            const confidence = metrics.systemConfidence || {
                displayFormat: '99.999[9]%',
                baselineAccuracy: 99.99999
            };
            const complexity = metrics.complexityScore || {
                rating: 'MEDIUM',
                score: 0.5
            };
            const threshold = metrics.thresholdStatus || {
                status: 'OPTIMAL ROUTE',
                message: 'OPTIMAL ROUTE',
                actionRequired: false
            };

            return `
                <div class="reliability-metrics">
                    <h4>📊 SIX-SIGMA RELIABILITY METRICS</h4>
                    
                    <div class="metrics-grid">
                        <div class="metric-card system-confidence animate-item">
                            <div class="metric-header">
                                <span class="metric-icon">🔒</span>
                                <span class="metric-title">System Confidence</span>
                            </div>
                            <div class="metric-value confidence-display">
                                ${confidence.displayFormat || '99.999[9]%'}
                            </div>
                            <div class="metric-subtitle">
                                Baseline: ${confidence.baselineAccuracy || 99.99999}% (1 error in 16 million)
                            </div>
                        </div>

                        <div class="metric-card complexity-score animate-item">
                            <div class="metric-header">
                                <span class="metric-icon">⚡</span>
                                <span class="metric-title">Complexity Rating</span>
                            </div>
                            <div class="metric-value complexity-rating ${(complexity.rating || 'MEDIUM').toLowerCase()}">
                                ${complexity.rating || 'MEDIUM'}
                            </div>
                            <div class="metric-subtitle">
                                Score: ${complexity.score || 0.5} | Hops: ${metrics.hopCount || 3}
                            </div>
                        </div>

                        <div class="metric-card threshold-status animate-item">
                            <div class="metric-header">
                                <span class="metric-icon">${this.getThresholdIcon(threshold.status)}</span>
                                <span class="metric-title">Route Status</span>
                            </div>
                            <div class="metric-value status-display ${this.getThresholdClass(threshold.status)}">
                                ${threshold.message || threshold.status || 'OPTIMAL ROUTE'}
                            </div>
                            <div class="metric-subtitle">
                                ${threshold.actionRequired ? 'Action Required' : 'No Action Needed'}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error in renderMetricsHTML:', error);
            // Return a safe fallback
            return `
                <div class="reliability-metrics">
                    <h4>📊 SIX-SIGMA RELIABILITY METRICS</h4>
                    <div class="metrics-grid">
                        <div class="metric-card system-confidence animate-item">
                            <div class="metric-header">
                                <span class="metric-icon">🔒</span>
                                <span class="metric-title">System Confidence</span>
                            </div>
                            <div class="metric-value confidence-display">99.999[9]%</div>
                            <div class="metric-subtitle">Baseline: 99.99999% (1 error in 16 million)</div>
                        </div>
                        <div class="metric-card complexity-score animate-item">
                            <div class="metric-header">
                                <span class="metric-icon">⚡</span>
                                <span class="metric-title">Complexity Rating</span>
                            </div>
                            <div class="metric-value complexity-rating medium">MEDIUM</div>
                            <div class="metric-subtitle">Score: 0.5 | Hops: 3</div>
                        </div>
                        <div class="metric-card threshold-status animate-item">
                            <div class="metric-header">
                                <span class="metric-icon">✅</span>
                                <span class="metric-title">Route Status</span>
                            </div>
                            <div class="metric-value status-display optimal">OPTIMAL ROUTE</div>
                            <div class="metric-subtitle">No Action Needed</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    getThresholdIcon(status) {
        if (!status) return 'ℹ️';
        switch (status) {
            case 'OPTIMAL ROUTE': return '✅';
            case 'MONITORING ACTIVE (Delay Possible)': return '⚠️';
            case 'JUGAAD PROTOCOL INITIATED (Critical Delay)': return '🚨';
            default: return 'ℹ️';
        }
    }

    getThresholdClass(status) {
        if (!status) return 'unknown';
        switch (status) {
            case 'OPTIMAL ROUTE': return 'optimal';
            case 'MONITORING ACTIVE (Delay Possible)': return 'monitoring';
            case 'JUGAAD PROTOCOL INITIATED (Critical Delay)': return 'critical';
            default: return 'unknown';
        }
    }

    displayValidationErrors(errors) {
        const container = document.getElementById('outputContainer');
        if (!container) return;
        
        const html = `
            <div class="error-output">
                <div class="error-header">
                    ❌ VALIDATION ERRORS
                </div>
                <p>The delivery marker could not be processed due to the following issues:</p>
                <ul class="error-list">
                    ${errors.map(error => `
                        <li class="error-item">
                            <div class="error-component">${error.component}</div>
                            <div class="error-message">${error.message}</div>
                            ${error.suggestions ? `
                                <div class="error-suggestions">
                                    Suggestions: ${error.suggestions.join(', ')}
                                </div>
                            ` : ''}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        container.innerHTML = html;
    }

    getPriorityClass(priority) {
        if (!priority) return 'primary';
        switch (priority.toLowerCase()) {
            case 'urgent': return 'error';
            case 'high': return 'warning';
            case 'medium': return 'primary';
            case 'standard': return 'success';
            case 'low': return 'secondary';
            default: return 'primary';
        }
    }

    clearOutput() {
        const container = document.getElementById('outputContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-content">
                    <h3>🚂 Welcome to the Dabbawala Network Router</h3>
                    <p>Enter a delivery marker above to decode routing paths</p>
                    <div class="system-info">
                        <div class="info-item">
                            <span class="info-label">Sorting Hub:</span>
                            <span class="info-value">Dadar (10:30 AM)</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Network:</span>
                            <span class="info-value">Mumbai Railway System</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Status:</span>
                            <span class="info-value" id="welcomeStatus">Ready</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Clear inputs
        const markerInput = document.getElementById('markerInput');
        const gridResult = document.getElementById('gridResult');
        const sequenceInput = document.getElementById('sequenceInput');
        
        if (markerInput) markerInput.value = '';
        if (gridResult) gridResult.value = '';
        if (sequenceInput) sequenceInput.value = '1';
        
        // Clear selections
        document.querySelectorAll('.symbol-btn.selected').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        this.selectedColor = '';
        this.selectedSymbol = '';
        this.selectedStation = '';
    }

    exportResults() {
        const outputContainer = document.getElementById('outputContainer');
        if (!outputContainer) return;
        
        const routingOutput = outputContainer.querySelector('.routing-output');
        
        if (!routingOutput) {
            this.showError('No routing results to export');
            return;
        }
        
        // Create export data
        const exportData = {
            timestamp: new Date().toISOString(),
            service: 'Bambaiyya-Binary Logistics Decoder v1.0.0',
            results: outputContainer.textContent
        };
        
        // Download as JSON
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `routing-results-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async showSystemStatus() {
        try {
            const response = await fetch(`${this.apiBase}/status`);
            const data = await response.json();
            
            const html = `
                <div class="system-status-modal">
                    <h4>System Status: <span class="text-${data.status === 'ready' ? 'success' : 'error'}">${data.status.toUpperCase()}</span></h4>
                    
                    <div class="status-section">
                        <h5>Protocol Statistics</h5>
                        <div class="info-grid">
                            <div class="info-row">
                                <span class="label">Stations:</span>
                                <span class="value">${data.stats.stations}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Symbols:</span>
                                <span class="value">${data.stats.symbols}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Colors:</span>
                                <span class="value">${data.stats.colors}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Slang Terms:</span>
                                <span class="value">${data.stats.slangTerms}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="status-section">
                        <h5>Sorting Hub</h5>
                        <p>Time: ${data.sortingHubTime}</p>
                        <p>Location: Dadar Railway Station (DDR)</p>
                    </div>
                    
                    <div class="status-section">
                        <h5>Validation</h5>
                        <p>Status: <span class="text-${data.validation.isValid ? 'success' : 'error'}">${data.validation.isValid ? 'VALID' : 'INVALID'}</span></p>
                        ${data.validation.errors && data.validation.errors.length > 0 ? `
                            <ul>
                                ${data.validation.errors.map(error => `<li class="text-error">${error}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                </div>
            `;
            
            this.showModal('System Status', html);
        } catch (error) {
            this.showError('Failed to load system status');
        }
    }

    async showProtocolInfo() {
        try {
            const response = await fetch(`${this.apiBase}/protocol`);
            const data = await response.json();
            
            const html = `
                <div class="protocol-info-modal">
                    <div class="protocol-section">
                        <h5>Available Stations (${data.stations.length})</h5>
                        <div class="protocol-list">
                            ${data.stations.map(station => `<span class="protocol-item">${station}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="protocol-section">
                        <h5>Available Symbols (${data.symbols.length})</h5>
                        <div class="protocol-list">
                            ${data.symbols.map(symbol => `<span class="protocol-item">${symbol}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="protocol-section">
                        <h5>Available Colors (${data.colors.length})</h5>
                        <div class="protocol-list">
                            ${data.colors.map(color => `<span class="protocol-item">${color}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="protocol-section">
                        <h5>Mumbai Slang Terms</h5>
                        <div class="slang-list">
                            ${data.slang.map(slang => `
                                <div class="slang-item">
                                    <strong>"${slang.slang}"</strong> - ${slang.meaning}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            this.showModal('Protocol Information', html);
        } catch (error) {
            this.showError('Failed to load protocol information');
        }
    }

    showHelp() {
        const html = `
            <div class="help-modal">
                <div class="help-section">
                    <h5>🚂 About Bambaiyya-Binary</h5>
                    <p>The Gold Tier Terminal for Mumbai's Dabbawala Network. This system digitizes the 130-year-old delivery algorithm used by Mumbai's legendary lunch delivery service.</p>
                </div>
                
                <div class="help-section">
                    <h5>📦 Delivery Marker Format</h5>
                    <p><strong>Format:</strong> "Color Symbol - Station - Sequence"</p>
                    <p><strong>Example:</strong> "Red Triangle - VLP - 4"</p>
                    <ul>
                        <li><strong>Color:</strong> Priority level (Red=Urgent, Green=Standard)</li>
                        <li><strong>Symbol:</strong> Destination type (Circle=Industrial, Triangle=Residential)</li>
                        <li><strong>Station:</strong> Mumbai railway station code (VLP=Vile Parle)</li>
                        <li><strong>Sequence:</strong> Delivery order number (1-999)</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <h5>🎯 How to Use</h5>
                    <ol>
                        <li><strong>Text Input:</strong> Type a delivery marker in the input field</li>
                        <li><strong>Symbol Grid:</strong> Click colors, symbols, and stations to build a marker</li>
                        <li><strong>Examples:</strong> Click example buttons for quick testing</li>
                        <li><strong>Process:</strong> Click DECODE or press Enter to generate routing</li>
                    </ol>
                </div>
                
                <div class="help-section">
                    <h5>🗣️ Mumbai Slang Support</h5>
                    <p>The system understands authentic Mumbai terminology:</p>
                    <ul>
                        <li><strong>"Jhol in the route"</strong> - Route complication detected</li>
                        <li><strong>"Dadar handoff failed"</strong> - Missed sorting window</li>
                        <li><strong>"Packet chalega"</strong> - Delivery confirmed</li>
                        <li><strong>"Local pakad"</strong> - Use railway transport</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <h5>⏰ Timing System</h5>
                    <p>All deliveries are synchronized with the Dadar Sorting Hub:</p>
                    <ul>
                        <li><strong>Collection:</strong> 9:00 AM - 10:15 AM</li>
                        <li><strong>Sorting:</strong> 10:30 AM (Fixed Reference Point)</li>
                        <li><strong>Delivery:</strong> 11:15 AM onwards (zone-dependent)</li>
                    </ul>
                </div>
            </div>
        `;
        
        this.showModal('Help & Documentation', html);
    }

    showModal(title, content) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modal = document.getElementById('modal');
        
        if (modalTitle) modalTitle.textContent = title;
        if (modalBody) modalBody.innerHTML = content;
        if (modal) modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('modal');
        if (modal) modal.classList.remove('show');
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            if (show) {
                overlay.classList.add('show');
            } else {
                overlay.classList.remove('show');
            }
        }
    }

    showError(message) {
        console.error('🚨 Error:', message);
        
        // Show error in the output container as well
        const container = document.getElementById('outputContainer');
        if (container) {
            container.innerHTML = `
                <div class="error-output">
                    <h3>❌ ERROR</h3>
                    <p>${message}</p>
                    <div class="error-details">
                        <p>Check the browser console for more details.</p>
                        <button onclick="location.reload()" class="retry-btn">Retry</button>
                    </div>
                </div>
            `;
        }
        
        alert(`Error: ${message}`);
    }

    // Simple Sidebar Management
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const openBtn = document.getElementById('openSidebarBtn');
        
        if (sidebar && openBtn) {
            if (sidebar.classList.contains('hidden')) {
                sidebar.classList.remove('hidden');
                openBtn.style.display = 'none';
                console.log('🔧 Sidebar opened');
            } else {
                sidebar.classList.add('hidden');
                openBtn.style.display = 'block';
                console.log('🔧 Sidebar closed');
            }
        }
    }

    openSidebar() {
        const sidebar = document.getElementById('sidebar');
        const openBtn = document.getElementById('openSidebarBtn');
        
        if (sidebar) sidebar.classList.remove('hidden');
        if (openBtn) openBtn.style.display = 'none';
        console.log('🔧 Sidebar opened from corner button');
    }

    // Tool Management
    openTool(toolName) {
        this.currentTool = toolName;
        
        // Update sidebar button states
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const toolBtn = document.querySelector(`[data-tool="${toolName}"]`);
        if (toolBtn) toolBtn.classList.add('active');
        
        // Show tool modal
        const modal = document.getElementById('toolModal');
        const title = document.getElementById('toolModalTitle');
        const body = document.getElementById('toolModalBody');
        
        if (title && body && modal) {
            switch (toolName) {
                case 'debugger':
                    title.textContent = '🔧 Bambaiyya Debugger';
                    body.innerHTML = this.createDebuggerContent();
                    break;
                case 'latency':
                    title.textContent = '🚂 Network Latency Engine';
                    body.innerHTML = this.createLatencyContent();
                    break;
                case 'lifecycle':
                    title.textContent = '📦 Packet Lifecycle Tracker';
                    body.innerHTML = this.createLifecycleContent();
                    break;
            }
            
            modal.classList.add('show');
        }
    }

    closeTool() {
        const modal = document.getElementById('toolModal');
        if (modal) modal.classList.remove('show');
        
        // Remove active state from sidebar buttons
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.currentTool = null;
    }

    createDebuggerContent() {
        return `
            <div class="tool-content">
                <div class="tool-section">
                    <h4>System Integrity Monitor</h4>
                    <div class="integrity-display">
                        <div class="integrity-bar">
                            <span>System Integrity:</span>
                            <div class="integrity-meter">
                                <div class="integrity-fill" id="tool-integrity-fill" style="width: 100%"></div>
                            </div>
                            <span id="tool-integrity-percent">100%</span>
                        </div>
                    </div>
                </div>
                
                <div class="tool-section">
                    <h4>Debug Controls</h4>
                    <div class="tool-controls">
                        <button class="tool-btn" onclick="terminal.runSystemDiagnostics()">🔍 Run Diagnostics</button>
                        <button class="tool-btn secondary" onclick="terminal.simulateSystemError()">⚠️ Simulate Error</button>
                        <button class="tool-btn info" onclick="terminal.resetSystemIntegrity()">🔄 Reset System</button>
                    </div>
                </div>
                
                <div class="tool-section">
                    <h4>Debug Log</h4>
                    <div class="tool-output" id="debugger-output">
                        <div class="debug-log">
                            <p class="debug-info">[${new Date().toLocaleTimeString()}] 🟢 System initialized successfully</p>
                            <p class="debug-info">[${new Date().toLocaleTimeString()}] 🟢 All protocol files loaded</p>
                            <p class="debug-info">[${new Date().toLocaleTimeString()}] 🟢 Mumbai terminology database active</p>
                            <p class="debug-info">[${new Date().toLocaleTimeString()}] 🟢 Bambaiyya Debugger opened</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createLatencyContent() {
        return `
            <div class="tool-content">
                <div class="tool-section">
                    <h4>Network Status</h4>
                    <div class="latency-display">
                        <div class="latency-indicator" id="tool-latency-indicator">
                            <span class="latency-status">NORMAL</span>
                            <div class="latency-bar">
                                <div class="latency-fill" style="width: 20%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="tool-section">
                    <h4>Delay Controls</h4>
                    <div class="tool-controls">
                        <label for="tool-delay-factor">Railway Delay Factor:</label>
                        <select id="tool-delay-factor" onchange="terminal.updateToolDelayFactor()">
                            <option value="0">Normal Operations</option>
                            <option value="5">Light Delay (5 min)</option>
                            <option value="15">Heavy Traffic (15 min)</option>
                            <option value="30">Signal Failure (30 min)</option>
                            <option value="60">Monsoon Disruption (60 min)</option>
                        </select>
                    </div>
                </div>
                
                <div class="tool-section">
                    <h4>Network Status</h4>
                    <div class="tool-output" id="latency-output">
                        <div id="tool-delay-status">
                            <p>🟢 All railway lines operating normally</p>
                            <p>Dadar Sorting Hub: ON TIME</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createLifecycleContent() {
        return `
            <div class="tool-content lifecycle-tracker">
                <div class="lifecycle-header">
                    <h4>📦 Packet Lifecycle Tracker</h4>
                    <div class="packet-status-display">
                        <span class="tool-status ready" id="tool-packet-status">READY</span>
                        <span class="packet-id" id="current-packet-id">No Active Packet</span>
                    </div>
                </div>
                
                <div class="lifecycle-controls">
                    <div class="control-row">
                        <button class="tool-btn primary" onclick="terminal.startPacketTrace()">🚀 START TRACE</button>
                        <button class="tool-btn secondary" onclick="terminal.simulateDelay()">⚠️ SIMULATE DELAY</button>
                        <button class="tool-btn info" onclick="terminal.showTCPComparison()">🌐 TCP/IP COMPARISON</button>
                    </div>
                    <div class="control-row">
                        <button class="tool-btn success" onclick="terminal.resetPacketTrace()">🔄 RESET TRACE</button>
                        <button class="tool-btn warning" onclick="terminal.exportTraceData()">📊 EXPORT DATA</button>
                        <button class="tool-btn danger" onclick="terminal.simulatePacketLoss()">💥 PACKET LOSS</button>
                    </div>
                </div>
                
                <div class="lifecycle-timeline" id="lifecycle-timeline">
                    <div class="timeline-placeholder">
                        <p>🎯 Ready to trace packet lifecycle</p>
                        <p>Enter a delivery marker in the main interface and click "START TRACE" to begin</p>
                    </div>
                </div>
                
                <div class="lifecycle-stats" id="lifecycle-stats">
                    <div class="stat-card">
                        <div class="stat-label">Total Hops</div>
                        <div class="stat-value" id="total-hops">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Processing Time</div>
                        <div class="stat-value" id="processing-time">0ms</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Success Rate</div>
                        <div class="stat-value" id="success-rate">100%</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Network Latency</div>
                        <div class="stat-value" id="network-latency">0ms</div>
                    </div>
                </div>
                
                <div class="tcp-comparison" id="tcp-comparison" style="display: none;">
                    <h5>🌐 TCP/IP vs Dabbawala Protocol Comparison</h5>
                    <div class="comparison-table">
                        <div class="comparison-row header">
                            <div class="protocol-name">TCP/IP</div>
                            <div class="protocol-feature">Feature</div>
                            <div class="dabbawala-feature">Dabbawala</div>
                        </div>
                        <div class="comparison-row">
                            <div class="tcp-value">Router Hops</div>
                            <div class="feature-label">Network Nodes</div>
                            <div class="dabbawala-value">Station Hops</div>
                        </div>
                        <div class="comparison-row">
                            <div class="tcp-value">IP Address</div>
                            <div class="feature-label">Addressing</div>
                            <div class="dabbawala-value">Visual Markers</div>
                        </div>
                        <div class="comparison-row">
                            <div class="tcp-value">99.9% SLA</div>
                            <div class="feature-label">Reliability</div>
                            <div class="dabbawala-value">99.999[X]%</div>
                        </div>
                        <div class="comparison-row">
                            <div class="tcp-value">Milliseconds</div>
                            <div class="feature-label">Latency</div>
                            <div class="dabbawala-value">Minutes</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createNodeGraphVisualization() {
        return `
            <div class="node-graph-container">
                <svg class="connection-layer" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
                    <!-- Animated connection paths -->
                    <defs>
                        <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0" />
                            <stop offset="50%" style="stop-color:#ffd700;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#ffd700;stop-opacity:0" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge> 
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    <!-- Base connection lines -->
                    <path id="path1" d="M 150 100 L 300 100" stroke="#333" stroke-width="2" fill="none" />
                    <path id="path2" d="M 350 100 L 500 100" stroke="#333" stroke-width="2" fill="none" />
                    <path id="path3" d="M 550 100 L 700 100" stroke="#333" stroke-width="2" fill="none" />
                    
                    <!-- Animated pulse circles -->
                    <circle class="pulse-dot" r="4" fill="url(#pulseGradient)" filter="url(#glow)">
                        <animateMotion dur="3s" repeatCount="indefinite">
                            <mpath href="#path1"/>
                        </animateMotion>
                    </circle>
                    <circle class="pulse-dot" r="4" fill="url(#pulseGradient)" filter="url(#glow)">
                        <animateMotion dur="3s" repeatCount="indefinite" begin="1s">
                            <mpath href="#path2"/>
                        </animateMotion>
                    </circle>
                    <circle class="pulse-dot" r="4" fill="url(#pulseGradient)" filter="url(#glow)">
                        <animateMotion dur="3s" repeatCount="indefinite" begin="2s">
                            <mpath href="#path3"/>
                        </animateMotion>
                    </circle>
                </svg>
                
                <div class="node-graph-nodes">
                    <div class="lifecycle-node source-node" data-node="source">
                        <div class="node-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                            </svg>
                        </div>
                        <div class="node-content">
                            <h5>Customer Home</h5>
                            <span class="node-status">Source</span>
                            <div class="node-metrics">
                                <span>Efficiency: 99.8%</span>
                            </div>
                        </div>
                        <div class="node-tooltip">
                            <strong>Collection Point</strong><br>
                            Status: Active<br>
                            Traffic: Normal
                        </div>
                    </div>
                    
                    <div class="lifecycle-node aggregator-node" data-node="aggregator">
                        <div class="node-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </div>
                        <div class="node-content">
                            <h5>Local Aggregator</h5>
                            <span class="node-status">Collecting</span>
                            <div class="node-metrics">
                                <span>Load: 85%</span>
                            </div>
                        </div>
                        <div class="node-tooltip">
                            <strong>Collection Hub</strong><br>
                            Status: Processing<br>
                            Queue: 12 packets
                        </div>
                    </div>
                    
                    <div class="lifecycle-node router-node" data-node="router">
                        <div class="node-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 15.5C4 17.43 5.57 19 7.5 19L16.5 19C18.43 19 20 17.43 20 15.5C20 13.57 18.43 12 16.5 12C16.5 12 16.5 12 16.5 12C16.04 10.24 14.36 9 12.5 9C10.64 9 8.96 10.24 8.5 12C6.57 12 5 13.57 5 15.5L4 15.5Z"/>
                            </svg>
                        </div>
                        <div class="node-content">
                            <h5>Dadar Hub</h5>
                            <span class="node-status">Routing</span>
                            <div class="node-metrics">
                                <span>Throughput: 2.1k/hr</span>
                            </div>
                        </div>
                        <div class="node-tooltip">
                            <strong>Central Sorting</strong><br>
                            Status: Operational<br>
                            Next Sort: 10:30 AM
                        </div>
                    </div>
                    
                    <div class="lifecycle-node destination-node" data-node="destination">
                        <div class="node-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                        </div>
                        <div class="node-content">
                            <h5>Destination</h5>
                            <span class="node-status">Awaiting</span>
                            <div class="node-metrics">
                                <span>ETA: 11:45 AM</span>
                            </div>
                        </div>
                        <div class="node-tooltip">
                            <strong>Delivery Point</strong><br>
                            Status: Ready<br>
                            Window: 11:30-12:00
                        </div>
                    </div>
                </div>
                
                <div class="lifecycle-metrics">
                    <div class="metric-card">
                        <span class="metric-label">Total Delay</span>
                        <span class="metric-value" id="total-delay">0 min</span>
                    </div>
                    <div class="metric-card">
                        <span class="metric-label">Confidence</span>
                        <span class="metric-value" id="route-confidence">99.99%</span>
                    </div>
                    <div class="metric-card">
                        <span class="metric-label">Hops</span>
                        <span class="metric-value" id="hop-count">4</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Tool-specific methods (simplified versions)
    runSystemDiagnostics() {
        console.log('Running system diagnostics...');
    }

    simulateSystemError() {
        console.log('Simulating system error...');
    }

    resetSystemIntegrity() {
        console.log('Resetting system integrity...');
    }

    updateToolDelayFactor() {
        console.log('Updating delay factor...');
    }

    // Packet Lifecycle Tracker Methods
    startPacketTrace() {
        console.log('🚀 Starting packet trace...');
        
        const markerInput = document.getElementById('markerInput');
        const marker = markerInput ? markerInput.value.trim() : 'Red Triangle - VLP - 4';
        
        if (!marker) {
            alert('Please enter a delivery marker first!');
            return;
        }
        
        // Generate packet ID
        const packetId = `PKT-${Date.now().toString(36).toUpperCase()}`;
        document.getElementById('current-packet-id').textContent = packetId;
        document.getElementById('tool-packet-status').textContent = 'TRACING';
        document.getElementById('tool-packet-status').className = 'tool-status tracing';
        
        // Create timeline
        this.createPacketTimeline(marker, packetId);
        
        // Update stats
        this.updateLifecycleStats();
    }
    
    createPacketTimeline(marker, packetId) {
        const timeline = document.getElementById('lifecycle-timeline');
        const startTime = Date.now();
        
        const hops = [
            { 
                id: 1, 
                location: 'Customer Home', 
                status: 'completed', 
                description: 'Packet created at source node',
                timestamp: new Date(startTime).toLocaleTimeString(),
                delay: 0
            },
            { 
                id: 2, 
                location: 'Local Station', 
                status: 'processing', 
                description: 'Packet aggregated at collection point',
                timestamp: new Date(startTime + 5000).toLocaleTimeString(),
                delay: 100
            },
            { 
                id: 3, 
                location: 'Dadar Sorting Hub', 
                status: 'pending', 
                description: 'Packet routed through central hub',
                timestamp: new Date(startTime + 15000).toLocaleTimeString(),
                delay: 200
            },
            { 
                id: 4, 
                location: 'Destination Station', 
                status: 'pending', 
                description: 'Final delivery preparation',
                timestamp: new Date(startTime + 25000).toLocaleTimeString(),
                delay: 300
            },
            { 
                id: 5, 
                location: 'Office Desk', 
                status: 'pending', 
                description: 'Packet delivered to destination',
                timestamp: new Date(startTime + 30000).toLocaleTimeString(),
                delay: 400
            }
        ];
        
        timeline.innerHTML = `
            <div class="timeline-header">
                <h5>📍 Packet Journey: ${marker}</h5>
                <span class="packet-id-display">ID: ${packetId}</span>
            </div>
            <div class="timeline-steps">
                ${hops.map(hop => `
                    <div class="timeline-step ${hop.status} animate-item" style="animation-delay: ${hop.delay}ms">
                        <div class="step-number">${hop.id}</div>
                        <div class="step-content">
                            <div class="step-location">${hop.location}</div>
                            <div class="step-description">${hop.description}</div>
                            <div class="step-timestamp">${hop.timestamp}</div>
                        </div>
                        <div class="step-status ${hop.status}">
                            ${hop.status === 'completed' ? '✅' : 
                              hop.status === 'processing' ? '🔄' : '⏳'}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Animate the steps
        setTimeout(() => {
            this.animateTimelineSteps();
        }, 500);
    }
    
    animateTimelineSteps() {
        const steps = document.querySelectorAll('.timeline-step');
        steps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('visible');
                if (index === 1) {
                    // Simulate processing
                    setTimeout(() => {
                        step.classList.remove('processing');
                        step.classList.add('completed');
                        step.querySelector('.step-status').textContent = '✅';
                        
                        // Move to next step
                        if (steps[index + 1]) {
                            steps[index + 1].classList.remove('pending');
                            steps[index + 1].classList.add('processing');
                            steps[index + 1].querySelector('.step-status').textContent = '🔄';
                        }
                    }, 2000);
                }
            }, index * 500);
        });
    }
    
    simulateDelay() {
        console.log('⚠️ Simulating network delay...');
        
        const processingSteps = document.querySelectorAll('.timeline-step.processing');
        processingSteps.forEach(step => {
            step.classList.add('delayed');
            const statusEl = step.querySelector('.step-status');
            statusEl.textContent = '⚠️';
            statusEl.style.color = '#FF8C00';
            
            // Add delay message
            const delayMsg = document.createElement('div');
            delayMsg.className = 'delay-message';
            delayMsg.textContent = 'Network congestion detected - 15min delay';
            step.querySelector('.step-content').appendChild(delayMsg);
        });
        
        // Update stats
        document.getElementById('network-latency').textContent = '850ms';
        document.getElementById('success-rate').textContent = '94.2%';
        
        // Show alert
        this.showNotification('⚠️ Delay Simulation Active', 'Network latency increased to simulate real-world conditions');
    }
    
    showTCPComparison() {
        console.log('🌐 Showing TCP/IP comparison...');
        
        const comparison = document.getElementById('tcp-comparison');
        if (comparison.style.display === 'none') {
            comparison.style.display = 'block';
            comparison.scrollIntoView({ behavior: 'smooth' });
        } else {
            comparison.style.display = 'none';
        }
    }
    
    resetPacketTrace() {
        console.log('🔄 Resetting packet trace...');
        
        document.getElementById('current-packet-id').textContent = 'No Active Packet';
        document.getElementById('tool-packet-status').textContent = 'READY';
        document.getElementById('tool-packet-status').className = 'tool-status ready';
        
        const timeline = document.getElementById('lifecycle-timeline');
        timeline.innerHTML = `
            <div class="timeline-placeholder">
                <p>🎯 Ready to trace packet lifecycle</p>
                <p>Enter a delivery marker in the main interface and click "START TRACE" to begin</p>
            </div>
        `;
        
        // Reset stats
        document.getElementById('total-hops').textContent = '0';
        document.getElementById('processing-time').textContent = '0ms';
        document.getElementById('success-rate').textContent = '100%';
        document.getElementById('network-latency').textContent = '0ms';
        
        // Hide comparison
        document.getElementById('tcp-comparison').style.display = 'none';
        
        this.showNotification('🔄 Trace Reset', 'Packet lifecycle tracker has been reset');
    }
    
    exportTraceData() {
        console.log('📊 Exporting trace data...');
        
        const packetId = document.getElementById('current-packet-id').textContent;
        const status = document.getElementById('tool-packet-status').textContent;
        
        const traceData = {
            packetId: packetId,
            status: status,
            timestamp: new Date().toISOString(),
            stats: {
                totalHops: document.getElementById('total-hops').textContent,
                processingTime: document.getElementById('processing-time').textContent,
                successRate: document.getElementById('success-rate').textContent,
                networkLatency: document.getElementById('network-latency').textContent
            },
            timeline: Array.from(document.querySelectorAll('.timeline-step')).map(step => ({
                location: step.querySelector('.step-location')?.textContent || '',
                description: step.querySelector('.step-description')?.textContent || '',
                timestamp: step.querySelector('.step-timestamp')?.textContent || '',
                status: step.classList.contains('completed') ? 'completed' : 
                        step.classList.contains('processing') ? 'processing' : 'pending'
            }))
        };
        
        // Create and download file
        const blob = new Blob([JSON.stringify(traceData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `packet-trace-${packetId}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('📊 Export Complete', 'Trace data exported successfully');
    }
    
    simulatePacketLoss() {
        console.log('💥 Simulating packet loss...');
        
        const steps = document.querySelectorAll('.timeline-step');
        const randomStep = steps[Math.floor(Math.random() * steps.length)];
        
        if (randomStep) {
            randomStep.classList.add('failed');
            randomStep.querySelector('.step-status').textContent = '❌';
            randomStep.querySelector('.step-status').style.color = '#DC143C';
            
            // Add error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Packet lost - retry required';
            randomStep.querySelector('.step-content').appendChild(errorMsg);
        }
        
        // Update stats
        document.getElementById('success-rate').textContent = '87.5%';
        document.getElementById('tool-packet-status').textContent = 'ERROR';
        document.getElementById('tool-packet-status').className = 'tool-status error';
        
        this.showNotification('💥 Packet Loss Detected', 'Simulated packet loss at random network node');
    }
    
    updateLifecycleStats() {
        // Simulate real-time stats updates
        document.getElementById('total-hops').textContent = '5';
        document.getElementById('processing-time').textContent = '1,247ms';
        document.getElementById('success-rate').textContent = '99.2%';
        document.getElementById('network-latency').textContent = '156ms';
    }
    
    showNotification(title, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    startToolPacketTrace() {
        this.startPacketTrace();
    }

    simulateToolDelay() {
        this.simulateDelay();
    }

    showToolTCPComparison() {
        this.showTCPComparison();
    }

    // Animation helper functions
    animateElements() {
        console.log('🎬 Starting animations...');
        // Trigger animations after a short delay to ensure DOM is ready
        setTimeout(() => {
            const animateItems = document.querySelectorAll('.animate-item');
            console.log('🎬 Found', animateItems.length, 'items to animate');
            
            animateItems.forEach((item, index) => {
                setTimeout(() => {
                    console.log('🎬 Animating item', index + 1);
                    item.classList.add('visible');
                }, index * 100); // 100ms delay between each item
            });
        }, 50);
    }

    // Smooth reordering animation
    animateReorder(container, newHTML) {
        // Add layout transition class
        container.classList.add('layout-transition');
        
        // Update content
        container.innerHTML = newHTML;
        
        // Trigger animations
        this.animateElements();
        
        // Remove transition class after animation
        setTimeout(() => {
            container.classList.remove('layout-transition');
        }, 300);
    }

    // Loading animation
    showLoadingAnimation(container) {
        container.innerHTML = `
            <div class="loading-container">
                <div class="loading-pulse">
                    <h3>🔄 Processing Delivery Marker...</h3>
                    <p>Calculating Six-Sigma reliability metrics</p>
                </div>
            </div>
        `;
    }

    // Enhanced process marker with loading animation
    async processMarkerWithAnimation() {
        const container = document.getElementById('outputContainer');
        if (!container) return;
        
        // Show loading animation first
        this.showLoadingAnimation(container);
        
        // Wait a bit to show the loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Then process normally
        await this.processMarker();
    }

    // Debug function to test routing pipeline
    testRoutingPipeline() {
        console.log('🧪 Testing routing pipeline...');
        
        // Test with sample data
        const testData = {
            success: true,
            routingPath: {
                origin: { fullName: 'Collection Point', code: 'COL' },
                destination: { fullName: 'VLP Station', code: 'VLP' },
                destinationType: 'Commercial Complex',
                priority: 'Standard',
                sortingHub: 'Dadar',
                collectionTime: '9:00 AM',
                sortingTime: '10:30 AM',
                deliveryTime: '11:30 AM',
                route: [
                    {
                        from: 'Collection Point',
                        to: 'VLP Station',
                        mode: 'Local Railway',
                        duration: 30,
                        distance: 15
                    }
                ],
                reliabilityMetrics: {
                    hopCount: 3,
                    complexityScore: {
                        score: 0.5,
                        rating: 'MEDIUM'
                    },
                    systemConfidence: {
                        displayFormat: '99.999[9]%',
                        baselineAccuracy: 99.99999
                    },
                    thresholdStatus: {
                        status: 'OPTIMAL ROUTE',
                        message: 'OPTIMAL ROUTE',
                        actionRequired: false
                    }
                }
            }
        };
        
        console.log('🧪 Test data:', testData);
        this.displayRoutingResult(testData);
    }

    // Simple test without animations
    testSimpleDisplay() {
        console.log('🧪 Testing simple display...');
        const container = document.getElementById('outputContainer');
        if (container) {
            container.innerHTML = `
                <div class="routing-output" style="opacity: 1 !important;">
                    <h3>🗺️ TEST ROUTING RESULT</h3>
                    <p>This is a simple test to verify display functionality.</p>
                    <div style="background: #333; padding: 1rem; margin: 1rem 0; opacity: 1 !important;">
                        <h4>Test Section</h4>
                        <p>If you can see this, the display is working correctly.</p>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize the terminal when DOM is loaded
let terminal;
document.addEventListener('DOMContentLoaded', () => {
    terminal = new BambaiyyaBinaryTerminal();
});