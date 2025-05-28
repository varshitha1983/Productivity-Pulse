document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const periodButtons = document.querySelectorAll('.period-btn');
    const timeChartCtx = document.getElementById('time-chart').getContext('2d');
    const trendChartCtx = document.getElementById('trend-chart').getContext('2d');
    const appList = document.getElementById('app-list');
    
    // Chart instances
    let timeChart, trendChart;
    
    // Current period
    let currentPeriod = 'day';
    
    // Sample data (in a real app, this would come from an API or localStorage)
    const screenTimeData = {
        day: {
            totalTime: 222, // in minutes
            pickups: 48,
            avgSession: 4.2,
            productiveTime: 78,
            dailyData: [45, 52, 38, 24, 33, 30], // Last 6 days + today
            productiveData: [18, 22, 15, 12, 20, 25],
            appUsage: [
                { name: 'Social Media', icon: 'fas fa-comment-dots', color: '#e17055', time: 84, percentage: 38 },
                { name: 'Productivity', icon: 'fas fa-check-circle', color: '#00b894', time: 78, percentage: 35 },
                { name: 'Entertainment', icon: 'fas fa-film', color: '#0984e3', time: 36, percentage: 16 },
                { name: 'Browsing', icon: 'fas fa-globe', color: '#fdcb6e', time: 18, percentage: 8 },
                { name: 'Other', icon: 'fas fa-ellipsis-h', color: '#a29bfe', time: 6, percentage: 3 }
            ]
        },
        week: {
            totalTime: 1560,
            pickups: 320,
            avgSession: 4.5,
            productiveTime: 540,
            dailyData: [180, 210, 195, 240, 225, 210, 300],
            productiveData: [60, 75, 90, 80, 85, 70, 80],
            appUsage: [
                { name: 'Productivity', icon: 'fas fa-check-circle', color: '#00b894', time: 540, percentage: 35 },
                { name: 'Social Media', icon: 'fas fa-comment-dots', color: '#e17055', time: 480, percentage: 31 },
                { name: 'Entertainment', icon: 'fas fa-film', color: '#0984e3', time: 300, percentage: 19 },
                { name: 'Browsing', icon: 'fas fa-globe', color: '#fdcb6e', time: 180, percentage: 12 },
                { name: 'Other', icon: 'fas fa-ellipsis-h', color: '#a29bfe', time: 60, percentage: 4 }
            ]
        },
        month: {
            totalTime: 6840,
            pickups: 1320,
            avgSession: 4.8,
            productiveTime: 2520,
            dailyData: [180, 210, 195, 240, 225, 210, 300, 180, 210, 195, 240, 225, 210, 300, 180, 210, 195, 240, 225, 210, 300, 180, 210, 195, 240, 225, 210, 300, 180, 210],
            productiveData: [60, 75, 90, 80, 85, 70, 80, 60, 75, 90, 80, 85, 70, 80, 60, 75, 90, 80, 85, 70, 80, 60, 75, 90, 80, 85, 70, 80, 60, 75],
            appUsage: [
                { name: 'Productivity', icon: 'fas fa-check-circle', color: '#00b894', time: 2520, percentage: 37 },
                { name: 'Social Media', icon: 'fas fa-comment-dots', color: '#e17055', time: 1980, percentage: 29 },
                { name: 'Entertainment', icon: 'fas fa-film', color: '#0984e3', time: 1260, percentage: 18 },
                { name: 'Browsing', icon: 'fas fa-globe', color: '#fdcb6e', time: 720, percentage: 11 },
                { name: 'Other', icon: 'fas fa-ellipsis-h', color: '#a29bfe', time: 360, percentage: 5 }
            ]
        }
    };
    
    // Initialize
    updateStats();
    createTimeChart();
    createTrendChart();
    renderAppList();
    
    // Period buttons
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentPeriod = this.getAttribute('data-period');
            
            // Update active button
            periodButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update data
            updateStats();
            updateTimeChart();
            updateTrendChart();
            renderAppList();
        });
    });
    
    // Update stats
    function updateStats() {
        const data = screenTimeData[currentPeriod];
        
        document.getElementById('total-time').textContent = formatTime(data.totalTime);
        document.getElementById('pickups').textContent = data.pickups;
        document.getElementById('avg-session').textContent = `${data.avgSession}m`;
        document.getElementById('productive-time').textContent = formatTime(data.productiveTime);
    }
    
    // Format time (minutes to hours and minutes)
    function formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }
    
    // Create time chart
    function createTimeChart() {
        const data = screenTimeData[currentPeriod];
        const labels = currentPeriod === 'day' ? 
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            currentPeriod === 'week' ?
            Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`) :
            Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
        
        timeChart = new Chart(timeChartCtx, {
            type: 'bar',
            data: {
                labels: labels.slice(-7), // Show last 7 days
                datasets: [
                    {
                        label: 'Total Time',
                        data: data.dailyData.slice(-7),
                        backgroundColor: '#6c5ce7',
                        borderRadius: 6
                    },
                    {
                        label: 'Productive Time',
                        data: data.productiveData.slice(-7),
                        backgroundColor: '#00b894',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${formatTime(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatTime(value);
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Create trend chart
    function createTrendChart() {
        const data = screenTimeData[currentPeriod];
        const labels = currentPeriod === 'day' ? 
            ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'] :
            currentPeriod === 'week' ?
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        
        // For demo purposes, we'll generate some trend data
        const trendData = currentPeriod === 'day' ? 
            [5, 2, 10, 45, 60, 55, 40, 25] :
            currentPeriod === 'week' ?
            [180, 210, 195, 240, 225, 210, 300] :
            [1500, 1680, 1740, 1920];
        
        trendChart = new Chart(trendChartCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Screen Time',
                        data: trendData,
                        borderColor: '#fd79a8',
                        backgroundColor: 'rgba(253, 121, 168, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Screen Time: ${formatTime(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatTime(value);
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Update time chart
    function updateTimeChart() {
        const data = screenTimeData[currentPeriod];
        const labels = currentPeriod === 'day' ? 
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            currentPeriod === 'week' ?
            Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`) :
            Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
        
        timeChart.data.labels = labels.slice(-7);
        timeChart.data.datasets[0].data = data.dailyData.slice(-7);
        timeChart.data.datasets[1].data = data.productiveData.slice(-7);
        timeChart.update();
    }
    
    // Update trend chart
    function updateTrendChart() {
        // For demo purposes, we'll generate some trend data
        const trendData = currentPeriod === 'day' ? 
            [5, 2, 10, 45, 60, 55, 40, 25] :
            currentPeriod === 'week' ?
            [180, 210, 195, 240, 225, 210, 300] :
            [1500, 1680, 1740, 1920];
        
        trendChart.data.datasets[0].data = trendData;
        trendChart.update();
    }
    
    // Render app list
    function renderAppList() {
        const data = screenTimeData[currentPeriod];
        
        appList.innerHTML = '';
        
        if (data.appUsage.length === 0) {
            appList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-mobile-alt"></i>
                    <h3>No app data available</h3>
                    <p>Usage data will appear here when available</p>
                </div>
            `;
            return;
        }
        
        data.appUsage.forEach(app => {
            const appItem = document.createElement('div');
            appItem.className = 'app-item';
            appItem.innerHTML = `
                <div class="app-icon" style="background: ${app.color}">
                    <i class="${app.icon}"></i>
                </div>
                <div class="app-info">
                    <div class="app-name">${app.name}</div>
                    <div class="app-time">
                        <span class="app-percentage">${app.percentage}%</span> • ${formatTime(app.time)}
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${app.percentage}%"></div>
                    </div>
                </div>
            `;
            appList.appendChild(appItem);
        });
    }
    
    // Animation for progress bars
    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0';
            setTimeout(() => {
                fill.style.width = width;
            }, 100);
        });
    }, 500);
});