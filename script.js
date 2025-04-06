// Utility functions for UI interactions and navigation
let actionMenuVisible = false;

// Mock data for business metrics
const businessData = {
    'Engineering': {
        projectCompletion: 72,
        resourceUtilization: 85,
        activeProjects: 7,
        teamMembers: 28,
        budgetUsed: 65,
        timeline: [
            { month: 'Jan', value: 42 },
            { month: 'Feb', value: 48 },
            { month: 'Mar', value: 55 },
            { month: 'Apr', value: 61 },
            { month: 'May', value: 68 },
            { month: 'Jun', value: 72 }
        ],
        issues: [
            { id: 'ENG-1', title: 'Server capacity optimization', priority: 'High', assignee: 'Mia Chen' },
            { id: 'ENG-2', title: 'Network latency issues', priority: 'Medium', assignee: 'Robert Kim' },
            { id: 'ENG-3', title: 'Database performance tuning', priority: 'High', assignee: 'David Smith' }
        ],
        projects: [
            { name: 'Cloud Migration', progress: 65, team: 8 },
            { name: 'UI Redesign', progress: 90, team: 4 },
            { name: 'API Gateway', progress: 40, team: 6 },
            { name: 'Mobile App', progress: 85, team: 5 }
        ]
    },
    'Finance': {
        quarterlyRevenue: 2.8,
        profitMargin: 18.5,
        operationalCosts: 1.4,
        forecastAccuracy: 91,
        investmentAllocation: 2.2,
        timeline: [
            { month: 'Jan', value: 2.1 },
            { month: 'Feb', value: 2.3 },
            { month: 'Mar', value: 2.5 },
            { month: 'Apr', value: 2.4 },
            { month: 'May', value: 2.6 },
            { month: 'Jun', value: 2.8 }
        ],
        topExpenses: [
            { category: 'Personnel', amount: 0.8 },
            { category: 'Infrastructure', amount: 0.3 },
            { category: 'Marketing', amount: 0.2 },
            { category: 'Research', amount: 0.1 }
        ]
    },
    'Operations': {
        efficiencyRating: 88,
        bottlenecks: 3,
        processAutomation: 65,
        resourceAllocation: 78,
        supplyChainHealth: 92,
        timeline: [
            { month: 'Jan', value: 75 },
            { month: 'Feb', value: 78 },
            { month: 'Mar', value: 80 },
            { month: 'Apr', value: 83 },
            { month: 'May', value: 86 },
            { month: 'Jun', value: 88 }
        ],
        processImprovements: [
            { process: 'Order Fulfillment', improvement: 12 },
            { process: 'Logistics', improvement: 8 },
            { process: 'Inventory Management', improvement: 15 }
        ]
    },
    'HR': {
        employeeSatisfaction: 87,
        turnoverRate: 4.2,
        openPositions: 5,
        talentAcquisition: 92,
        trainingCompletion: 78,
        timeline: [
            { month: 'Jan', value: 82 },
            { month: 'Feb', value: 83 },
            { month: 'Mar', value: 85 },
            { month: 'Apr', value: 84 },
            { month: 'May', value: 86 },
            { month: 'Jun', value: 87 }
        ],
        departmentDistribution: [
            { dept: 'Engineering', count: 28 },
            { dept: 'Sales', count: 15 },
            { dept: 'Marketing', count: 8 },
            { dept: 'Operations', count: 12 },
            { dept: 'Admin', count: 5 }
        ],
        openRoles: [
            { title: 'Senior Software Engineer', department: 'Engineering', applications: 12 },
            { title: 'UX Designer', department: 'Product', applications: 8 },
            { title: 'Sales Manager', department: 'Sales', applications: 15 },
            { title: 'Data Analyst', department: 'Analytics', applications: 6 },
            { title: 'DevOps Engineer', department: 'Engineering', applications: 4 }
        ]
    },
    'Analytics': {
        dataProcessed: 18.5,
        insightsGenerated: 245,
        predictionAccuracy: 92,
        dashboardEngagement: 78,
        reportAutomation: 85,
        timeline: [
            { month: 'Jan', value: 12.2 },
            { month: 'Feb', value: 13.8 },
            { month: 'Mar', value: 15.1 },
            { month: 'Apr', value: 16.5 },
            { month: 'May', value: 17.8 },
            { month: 'Jun', value: 18.5 }
        ],
        topInsights: [
            { category: 'Customer Behavior', count: 58 },
            { category: 'Market Trends', count: 43 },
            { category: 'Operational Efficiency', count: 72 },
            { category: 'Financial Patterns', count: 62 }
        ]
    }
};

// Create UI elements
function createUI() {
    // Create menu button
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn';
    menuBtn.innerHTML = '+';
    menuBtn.addEventListener('click', toggleActionMenu);
    document.body.appendChild(menuBtn);
    
    // Create action menu
    const actionMenu = document.createElement('div');
    actionMenu.className = 'action-menu';
    actionMenu.style.opacity = '0';
    actionMenu.style.transform = 'translateY(20px)';
    document.body.appendChild(actionMenu);
    
    // Add action buttons
    const actions = [
        { name: 'Engineering', icon: '🔧' },
        { name: 'Finance', icon: '💰' },
        { name: 'Operations', icon: '⚙️' },
        { name: 'HR', icon: '👥' },
        { name: 'Analytics', icon: '📊' }
    ];
    
    actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.innerHTML = `${action.icon} ${action.name}`;
        btn.addEventListener('click', () => navigate(action.name));
        actionMenu.appendChild(btn);
    });
    
    // Create global data overview panel
    createDataOverview();
}

// Create global data overview panel
function createDataOverview() {
    const overviewPanel = document.createElement('div');
    overviewPanel.id = 'data-overview';
    overviewPanel.className = 'panel overview-panel';
    
    overviewPanel.innerHTML = `
        <div class="panel-header">
            <div class="panel-title">Conglomerate Overview</div>
            <button class="minimize-btn">_</button>
        </div>
        <div class="panel-content">
            <div class="metric-grid">
                <div class="metric">
                    <div class="metric-title">Projects</div>
                    <div class="metric-value">27</div>
                </div>
                <div class="metric">
                    <div class="metric-title">Revenue</div>
                    <div class="metric-value">$2.8M</div>
                </div>
                <div class="metric">
                    <div class="metric-title">Efficiency</div>
                    <div class="metric-value">88%</div>
                </div>
                <div class="metric">
                    <div class="metric-title">Team</div>
                    <div class="metric-value">68</div>
                </div>
            </div>
            <div class="quick-actions">
                <button class="quick-action-btn" onclick="showAlertPanel('Status Report', 'All systems operational. No critical issues detected.')">Status Report</button>
                <button class="quick-action-btn" onclick="showAlertPanel('Alerts', '2 new alerts requiring attention in Operations.')">Alerts</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overviewPanel);
    
    // Add minimize functionality
    const minimizeBtn = overviewPanel.querySelector('.minimize-btn');
    minimizeBtn.addEventListener('click', () => {
        const content = overviewPanel.querySelector('.panel-content');
        if (content.style.display === 'none') {
            content.style.display = 'block';
            minimizeBtn.textContent = '_';
            overviewPanel.style.height = 'auto';
        } else {
            content.style.display = 'none';
            minimizeBtn.textContent = '+';
            overviewPanel.style.height = 'auto';
        }
    });
}

// Show alert or notification panel
function showAlertPanel(title, message) {
    const alertPanel = document.createElement('div');
    alertPanel.className = 'panel alert-panel';
    
    alertPanel.innerHTML = `
        <div class="panel-header">
            <div class="panel-title">${title}</div>
            <button class="close-btn">×</button>
        </div>
        <div class="panel-content">
            <p>${message}</p>
            <button class="action-btn">Acknowledge</button>
        </div>
    `;
    
    document.body.appendChild(alertPanel);
    
    // Add close button functionality
    const closeBtn = alertPanel.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(alertPanel);
    });
    
    // Add acknowledge button functionality
    const ackBtn = alertPanel.querySelector('.action-btn');
    ackBtn.addEventListener('click', () => {
        document.body.removeChild(alertPanel);
    });
}

// Toggle action menu visibility
function toggleActionMenu() {
    const actionMenu = document.querySelector('.action-menu');
    const menuBtn = document.querySelector('.menu-btn');
    
    if (actionMenuVisible) {
        actionMenu.style.opacity = '0';
        actionMenu.style.transform = 'translateY(20px)';
        menuBtn.innerHTML = '+';
    } else {
        actionMenu.style.opacity = '1';
        actionMenu.style.transform = 'translateY(0)';
        menuBtn.innerHTML = '×';
    }
    
    actionMenuVisible = !actionMenuVisible;
}

// Navigate to different sections
function navigate(section) {
    console.log(`Navigating to ${section}...`);
    
    // Find the appropriate section node in the 3D space
    const targetPosition = getPositionForSection(section);
    
    // Animate camera movement
    moveCamera(targetPosition);
    
    // Show section-specific info
    showSectionDashboard(section);
}

// Get position for specific section
function getPositionForSection(section) {
    const positions = {
        'Engineering': { x: -5, y: 2, z: -10 },
        'Finance': { x: 5, y: 2, z: -10 },
        'Operations': { x: 0, y: 5, z: -15 },
        'HR': { x: -5, y: -2, z: -10 },
        'Analytics': { x: 5, y: -2, z: -10 }
    };
    
    return positions[section] || { x: 0, y: 0, z: 20 };
}

// Move camera to target position
function moveCamera(position) {
    // This function will be called from app.js
    if (window.cameraNavigation) {
        window.cameraNavigation(position);
    }
}

// Show section-specific dashboard
function showSectionDashboard(section) {
    // Remove any existing section dashboard
    const existingDashboard = document.getElementById('section-dashboard');
    if (existingDashboard) {
        document.body.removeChild(existingDashboard);
    }
    
    // Get section data
    const data = businessData[section];
    if (!data) return;
    
    // Create dashboard
    const dashboard = document.createElement('div');
    dashboard.id = 'section-dashboard';
    dashboard.className = 'panel dashboard-panel';
    
    // Generate metrics HTML
    let metricsHTML = '';
    Object.entries(data).forEach(([key, value]) => {
        if (!Array.isArray(value) && typeof value !== 'object') {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            let formattedValue = value;
            
            // Format values appropriately
            if (key.includes('percentage') || key.includes('rate') || key.includes('accuracy') || 
                key.includes('completion') || key.includes('utilization') || key.includes('efficiency')) {
                formattedValue = `${value}%`;
            } else if (key.includes('revenue') || key.includes('costs') || key.includes('budget')) {
                formattedValue = `$${value}M`;
            }
            
            metricsHTML += `
                <div class="metric-card">
                    <div class="metric-title">${formattedKey}</div>
                    <div class="metric-value">${formattedValue}</div>
                    ${value <= 100 && value >= 0 ? 
                        `<div class="progress-bar">
                            <div class="progress" style="width: ${value}%"></div>
                        </div>` : ''}
                </div>
            `;
        }
    });
    
    // Add timeline chart if available
    let timelineHTML = '';
    if (data.timeline) {
        timelineHTML = `
            <div class="dashboard-section">
                <h3>Trend Analysis</h3>
                <div class="chart-container">
                    <div class="chart-placeholder">
                        <div class="chart-title">${section} Performance</div>
                        <div class="bar-chart">
                            ${data.timeline.map(point => 
                                `<div class="bar-container">
                                    <div class="bar" style="height: ${point.value}%"></div>
                                    <div class="bar-label">${point.month}</div>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Add section-specific content
    let specialContentHTML = '';
    
    if (section === 'Engineering' && data.projects) {
        const projectsHTML = data.projects.map(project => 
            `<tr>
                <td>${project.name}</td>
                <td>${project.progress}%</td>
                <td>${project.team}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${project.progress}%"></div>
                    </div>
                </td>
            </tr>`
        ).join('');
        
        specialContentHTML += `
            <div class="dashboard-section">
                <h3>Active Projects</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Progress</th>
                            <th>Team Size</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${projectsHTML}
                    </tbody>
                </table>
            </div>
        `;
        
        if (data.issues) {
            const issuesHTML = data.issues.map(issue => 
                `<tr>
                    <td>${issue.id}</td>
                    <td>${issue.title}</td>
                    <td class="priority-${issue.priority.toLowerCase()}">${issue.priority}</td>
                    <td>${issue.assignee}</td>
                </tr>`
            ).join('');
            
            specialContentHTML += `
                <div class="dashboard-section">
                    <h3>Current Issues</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Priority</th>
                                <th>Assignee</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${issuesHTML}
                        </tbody>
                    </table>
                </div>
            `;
        }
    } else if (section === 'HR') {
        if (data.departmentDistribution) {
            const deptHTML = data.departmentDistribution.map(dept => 
                `<tr>
                    <td>${dept.dept}</td>
                    <td>${dept.count}</td>
                    <td>${Math.round((dept.count / data.teamMembers) * 100)}%</td>
                </tr>`
            ).join('');
            
            specialContentHTML += `
                <div class="dashboard-section">
                    <h3>Department Distribution</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Department</th>
                                <th>Headcount</th>
                                <th>% of Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${deptHTML}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        if (data.openRoles) {
            const rolesHTML = data.openRoles.map(role => 
                `<tr>
                    <td>${role.title}</td>
                    <td>${role.department}</td>
                    <td>${role.applications}</td>
                </tr>`
            ).join('');
            
            specialContentHTML += `
                <div class="dashboard-section">
                    <h3>Open Positions</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Position</th>
                                <th>Department</th>
                                <th>Applications</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rolesHTML}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }
    
    // Create action buttons based on section
    let actionButtonsHTML = '';
    switch(section) {
        case 'Engineering':
            actionButtonsHTML = `
                <button class="action-btn" onclick="showAlertPanel('Project Report', 'Generating detailed project report...')">Generate Report</button>
                <button class="action-btn" onclick="showAlertPanel('Resource Allocation', 'Optimizing resource allocation across projects...')">Optimize Resources</button>
            `;
            break;
        case 'Finance':
            actionButtonsHTML = `
                <button class="action-btn" onclick="showAlertPanel('Financial Report', 'Generating Q2 financial report...')">Generate Report</button>
                <button class="action-btn" onclick="showAlertPanel('Budget Analysis', 'Analyzing budget allocation and efficiency...')">Budget Analysis</button>
            `;
            break;
        case 'Operations':
            actionButtonsHTML = `
                <button class="action-btn" onclick="showAlertPanel('Process Optimization', 'Analyzing processes for optimization opportunities...')">Optimize Processes</button>
                <button class="action-btn" onclick="showAlertPanel('Supply Chain', 'Monitoring supply chain health and resilience...')">Supply Chain Monitor</button>
            `;
            break;
        case 'HR':
            actionButtonsHTML = `
                <button class="action-btn" onclick="showAlertPanel('Recruitment', 'Starting targeted recruitment for open positions...')">Start Recruitment</button>
                <button class="action-btn" onclick="showAlertPanel('Employee Survey', 'Preparing employee satisfaction survey...')">Employee Survey</button>
            `;
            break;
        case 'Analytics':
            actionButtonsHTML = `
                <button class="action-btn" onclick="showAlertPanel('Data Analysis', 'Running comprehensive data analysis...')">Analyze Data</button>
                <button class="action-btn" onclick="showAlertPanel('Predictive Model', 'Building predictive models based on current data...')">Build Model</button>
            `;
            break;
        default:
            actionButtonsHTML = `
                <button class="action-btn" onclick="showAlertPanel('${section} Report', 'Generating detailed ${section.toLowerCase()} report...')">Generate Report</button>
                <button class="action-btn" onclick="showAlertPanel('${section} Analysis', 'Running in-depth analysis of ${section.toLowerCase()} data...')">Run Analysis</button>
            `;
    }
    
    dashboard.innerHTML = `
        <div class="panel-header">
            <div class="panel-title">${section} Dashboard</div>
            <div class="panel-controls">
                <button class="refresh-btn">↻</button>
                <button class="close-btn">×</button>
            </div>
        </div>
        <div class="panel-content">
            <div class="metrics-row">
                ${metricsHTML}
            </div>
            ${timelineHTML}
            ${specialContentHTML}
            <div class="action-buttons">
                ${actionButtonsHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(dashboard);
    
    // Add close button functionality
    const closeBtn = dashboard.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(dashboard);
    });
    
    // Add refresh button functionality
    const refreshBtn = dashboard.querySelector('.refresh-btn');
    refreshBtn.addEventListener('click', () => {
        showSectionDashboard(section);
    });
}

// Initialize UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createUI();
    
    // Start real-time data simulation
    startDataSimulation();
});

// Simulate real-time data updates
function startDataSimulation() {
    console.log('Starting real-time data simulation');
    
    // Update data every 5 seconds
    setInterval(() => {
        // Update random metrics in the business data
        Object.keys(businessData).forEach(section => {
            const data = businessData[section];
            
            // Update some metrics with small random changes
            Object.keys(data).forEach(metric => {
                if (metric !== 'timeline') {
                    const value = data[metric];
                    
                    // Different update logic based on metric type
                    if (typeof value === 'number') {
                        if (metric.includes('percentage') || metric.includes('rate') || 
                            metric.includes('accuracy') || metric.includes('completion') || 
                            metric.includes('utilization') || metric.includes('efficiency')) {
                            // For percentages, keep within 0-100 range with small changes
                            data[metric] = Math.min(100, Math.max(0, value + (Math.random() * 2 - 1)));
                        } else if (value > 10) {
                            // For larger numbers, make slightly bigger changes
                            data[metric] = Math.max(0, value + (Math.random() * 4 - 2));
                        } else {
                            // For smaller numbers, make smaller changes
                            data[metric] = Math.max(0, value + (Math.random() * 0.4 - 0.2));
                        }
                        
                        // Round to reasonable precision
                        data[metric] = Math.round(data[metric] * 10) / 10;
                    }
                }
            });
            
            // Update timeline data if it exists
            if (data.timeline && data.timeline.length > 0) {
                // Update last timeline value with a small random change
                const lastPoint = data.timeline[data.timeline.length - 1];
                lastPoint.value = Math.max(0, lastPoint.value + (Math.random() * 2 - 1));
                lastPoint.value = Math.round(lastPoint.value * 10) / 10;
            }
        });
        
        // If a dashboard is currently visible, update it
        const dashboard = document.getElementById('section-dashboard');
        if (dashboard) {
            const title = dashboard.querySelector('.panel-title').textContent;
            const section = title.replace(' Dashboard', '');
            showSectionDashboard(section);
        }
        
        // Update overview panel if visible
        updateDataOverview();
        
    }, 5000);
    
    // Occasionally show alerts
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance of alert
            const alerts = [
                { title: 'System Alert', message: 'Server load has increased by 15%. Monitoring required.' },
                { title: 'Critical Update', message: 'Database maintenance scheduled in 30 minutes.' },
                { title: 'New Data Available', message: 'Q2 financial reports are ready for review.' },
                { title: 'Security Notice', message: 'New security patches available for deployment.' },
                { title: 'Performance Warning', message: 'Network latency detected in Asia region servers.' }
            ];
            
            const alert = alerts[Math.floor(Math.random() * alerts.length)];
            showAlertPanel(alert.title, alert.message);
        }
    }, 45000); // Every 45 seconds with 30% chance
}

// Update the global data overview panel
function updateDataOverview() {
    const overviewPanel = document.getElementById('data-overview');
    if (!overviewPanel) return;
    
    // Update the metric values
    const metricElements = overviewPanel.querySelectorAll('.metric-value');
    
    // Example updates
    const metrics = [
        businessData.Engineering.activeProjects + businessData.Engineering.teamMembers,
        '$' + businessData.Finance.quarterlyRevenue.toFixed(1) + 'M',
        businessData.Operations.efficiencyRating + '%',
        Math.round(businessData.HR.teamMembers + businessData.Analytics.teamMembers)
    ];
    
    metricElements.forEach((element, index) => {
        if (metrics[index]) {
            element.textContent = metrics[index];
            
            // Add animation effect
            element.classList.add('value-updated');
            setTimeout(() => {
                element.classList.remove('value-updated');
            }, 1000);
        }
    });
}

// Export functions for app.js to use
window.navigate = navigate;
window.showAlertPanel = showAlertPanel;
