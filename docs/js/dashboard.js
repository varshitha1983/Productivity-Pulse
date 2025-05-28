document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const periodButtons = document.querySelectorAll('.period-btn');
    const focusChartCtx = document.getElementById('focus-chart').getContext('2d');
    const productivityChartCtx = document.getElementById('productivity-chart').getContext('2d');
    const moodChartCtx = document.getElementById('mood-chart').getContext('2d');
    const activityChartCtx = document.getElementById('activity-chart').getContext('2d');
    
    // Chart instances
    let focusChart, productivityChart, moodChart, activityChart;
    
    // Current period
    let currentPeriod = 'week';
    
    // Sample data (in a real app, this would come from an API or localStorage)
    const dashboardData = {
        week: {
            focusTime: 12.5,
            tasksCompleted: 24,
            streak: 7,
            productivityScore: 78,
            focusData: [1.2, 1.8, 2.1, 1.5, 2.4, 1.9, 1.6],
            productivityData: {
                work: 35,
                breaks: 15,
                learning: 20,
                planning: 15,
                other: 15
            },
            moodData: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                moods: [3, 4, 3, 5, 4, 3, 2], // 1-5 scale
                productivity: [65, 78, 72, 85, 80, 70, 60] // percentages
            },
            activityData: {
                work: 6.5,
                leisure: 3.2,
                fitness: 1.5,
                learning: 2.3,
                other: 2.5
            }
        },
        month: {
            focusTime: 48,
            tasksCompleted: 96,
            streak: 7,
            productivityScore: 75,
            focusData: [10, 12, 14, 12, 16, 14, 12, 10, 12, 14, 12, 16, 14, 12, 10, 12, 14, 12, 16, 14, 12, 10, 12, 14, 12, 16, 14, 12],
            productivityData: {
                work: 40,
                breaks: 10,
                learning: 25,
                planning: 15,
                other: 10
            },
            moodData: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                moods: [3.2, 3.8, 4.1, 3.5], // averages
                productivity: [70, 78, 82, 75] // averages
            },
            activityData: {
                work: 28,
                leisure: 14,
                fitness: 6,
                learning: 10,
                other: 12
            }
        },
        year: {
            focusTime: 624,
            tasksCompleted: 1248,
            streak: 7,
            productivityScore: 72,
            focusData: [40, 45, 50, 48, 52, 55, 60, 58, 55, 50, 48, 45],
            productivityData: {
                work: 45,
                breaks: 10,
                learning: 20,
                planning: 15,
                other: 10
            },
            moodData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                moods: [3.5, 3.8, 4.0, 3.7, 4.2, 4.0, 3.8, 4.1, 4.3, 4.0, 3.7, 3.5],
                productivity: [70, 72, 75, 73, 78, 77, 75, 79, 80, 78, 75, 72]
            },
            activityData: {
                work: 365,
                leisure: 182,
                fitness: 78,
                learning: 130,
                other: 156
            }
        }
    };
    
    // Initialize
    updateStats();
    createFocusChart();
    createProductivityChart();
    createMoodChart();
    createActivityChart();
    
    // Period buttons
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentPeriod = this.getAttribute('data-period');
            
            // Update active button
            periodButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update data
            updateStats();
            updateFocusChart();
            updateProductivityChart();
            updateMoodChart();
            updateActivityChart();
        });
    });
    
    // Update stats
    function updateStats() {
        const data = dashboardData[currentPeriod];
        
        document.getElementById('focus-time').textContent = `${data.focusTime}h`;
        document.getElementById('tasks-completed').textContent = data.tasksCompleted;
        document.getElementById('streak').textContent = data.streak;
        document.getElementById('productivity-score').textContent = `${data.productivityScore}%`;
    }
    
    // Create focus chart
    function createFocusChart() {
        const data = dashboardData[currentPeriod];
        const labels = currentPeriod === 'week' ? 
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            currentPeriod === 'month' ?
            Array.from({ length: 28 }, (_, i) => i + 1) :
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Goal data (for demo purposes)
        const goalData = labels.map((_, i) => 2 + (i * 0.1));
        
        focusChart = new Chart(focusChartCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Focus Time',
                        data: data.focusData,
                        borderColor: '#6c5ce7',
                        backgroundColor: 'rgba(108, 92, 231, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Goal',
                        data: goalData,
                        borderColor: '#fd79a8',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.1
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
                                return `${context.dataset.label}: ${context.raw}h`;
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
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    }
                }
            }
        });
    }
    
    // Create productivity chart
    function createProductivityChart() {
        const data = dashboardData[currentPeriod].productivityData;
        
        productivityChart = new Chart(productivityChartCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: [
                        '#6c5ce7',
                        '#a29bfe',
                        '#00cec9',
                        '#55efc4',
                        '#fd79a8'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }
    
    // Create mood chart
    function createMoodChart() {
        const data = dashboardData[currentPeriod].moodData;
        
        moodChart = new Chart(moodChartCtx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Mood (1-5)',
                        data: data.moods,
                        backgroundColor: '#fdcb6e',
                        borderRadius: 6,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Productivity (%)',
                        data: data.productivity,
                        backgroundColor: '#00b894',
                        borderRadius: 6,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Mood (1-5)'
                        },
                        min: 1,
                        max: 5
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Productivity (%)'
                        },
                        min: 50,
                        max: 100,
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }
    
    // Create activity chart
    function createActivityChart() {
        const data = dashboardData[currentPeriod].activityData;
        
        activityChart = new Chart(activityChartCtx, {
            type: 'polarArea',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: [
                        'rgba(108, 92, 231, 0.7)',
                        'rgba(253, 121, 168, 0.7)',
                        'rgba(0, 184, 148, 0.7)',
                        'rgba(253, 203, 110, 0.7)',
                        'rgba(157, 178, 191, 0.7)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}h`;
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        pointLabels: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Update focus chart
    function updateFocusChart() {
        const data = dashboardData[currentPeriod];
        const labels = currentPeriod === 'week' ? 
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            currentPeriod === 'month' ?
            Array.from({ length: 28 }, (_, i) => i + 1) :
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Goal data (for demo purposes)
        const goalData = labels.map((_, i) => 2 + (i * 0.1));
        
        focusChart.data.labels = labels;
        focusChart.data.datasets[0].data = data.focusData;
        focusChart.data.datasets[1].data = goalData;
        focusChart.update();
    }
    
    // Update productivity chart
    function updateProductivityChart() {
        const data = dashboardData[currentPeriod].productivityData;
        
        productivityChart.data.datasets[0].data = Object.values(data);
        productivityChart.update();
    }
    
    // Update mood chart
    function updateMoodChart() {
        const data = dashboardData[currentPeriod].moodData;
        
        moodChart.data.labels = data.labels;
        moodChart.data.datasets[0].data = data.moods;
        moodChart.data.datasets[1].data = data.productivity;
        moodChart.update();
    }
    
    // Update activity chart
    function updateActivityChart() {
        const data = dashboardData[currentPeriod].activityData;
        
        activityChart.data.datasets[0].data = Object.values(data);
        activityChart.update();
    }
    
    // Add animation to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});