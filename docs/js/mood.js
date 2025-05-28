document.addEventListener('DOMContentLoaded', function() {
    // Mood Selection
    const moodOptions = document.querySelectorAll('.mood-option');
    let selectedMood = null;
    
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            moodOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            selectedMood = this.getAttribute('data-mood');
            
            // Add pulse animation
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 500);
        });
    });
    
    // Submit Mood
    const submitBtn = document.getElementById('submit-mood');
    const moodText = document.getElementById('mood-text');
    const recommendationsContainer = document.querySelector('.recommendations-container');
    const recommendationsGrid = document.querySelector('.recommendations-grid');
    
    submitBtn.addEventListener('click', function() {
        if (!selectedMood) {
            showNotification('Select Your Mood', 'Please select how you\'re feeling today');
            return;
        }
        
        const description = moodText.value.trim();
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = 'Submit Mood';
            showRecommendations(selectedMood, description);
            recommendationsContainer.classList.remove('hidden');
            
            // Scroll to recommendations
            recommendationsContainer.scrollIntoView({ behavior: 'smooth' });
            
            // Track mood in history
            trackMood(selectedMood, description);
            
            // Update mood chart
            updateMoodChart();
        }, 1500);
    });
    
    // Mood recommendations data
    const moodRecommendations = {
        excited: [
            {
                icon: 'fas fa-bolt',
                title: 'Channel Your Energy',
                description: 'Use your high energy to tackle challenging tasks first',
                action: 'Start Difficult Task'
            },
            {
                icon: 'fas fa-brain',
                title: 'Creative Work',
                description: 'Your excitement is perfect for brainstorming and creative projects',
                action: 'Start Brainstorming'
            },
            {
                icon: 'fas fa-users',
                title: 'Team Collaboration',
                description: 'Your positive energy can motivate others - schedule team meetings',
                action: 'Schedule Meeting'
            }
        ],
        happy: [
            {
                icon: 'fas fa-list-check',
                title: 'Productive Tasks',
                description: 'Your positive mood is ideal for checking off items on your to-do list',
                action: 'View To-Do List'
            },
            {
                icon: 'fas fa-pen-fancy',
                title: 'Detailed Work',
                description: 'Happiness increases attention to detail - work on tasks requiring precision',
                action: 'Start Detailed Task'
            },
            {
                icon: 'fas fa-lightbulb',
                title: 'Learn Something New',
                description: 'Positive moods enhance learning - take time to learn a new skill',
                action: 'Browse Courses'
            }
        ],
        neutral: [
            {
                icon: 'fas fa-calendar',
                title: 'Plan Your Week',
                description: 'Your balanced mood is perfect for planning and organization',
                action: 'Open Planner'
            },
            {
                icon: 'fas fa-inbox',
                title: 'Email Management',
                description: 'Neutral moods are great for processing emails and admin tasks',
                action: 'Check Email'
            },
            {
                icon: 'fas fa-chart-line',
                title: 'Review Progress',
                description: 'Take time to review your goals and progress objectively',
                action: 'View Dashboard'
            }
        ],
        tired: [
            {
                icon: 'fas fa-mug-hot',
                title: 'Take a Break',
                description: 'Try a 15-minute power break with some light stretching',
                action: 'Start Break Timer'
            },
            {
                icon: 'fas fa-music',
                title: 'Focus Music',
                description: 'Listen to focus-enhancing music to combat fatigue',
                action: 'Play Music'
            },
            {
                icon: 'fas fa-tasks',
                title: 'Simple Tasks',
                description: 'Focus on routine, low-energy tasks until you recharge',
                action: 'View Simple Tasks'
            }
        ],
        stressed: [
            {
                icon: 'fas fa-spa',
                title: 'Breathing Exercise',
                description: 'Try a 5-minute breathing exercise to reduce stress',
                action: 'Start Exercise'
            },
            {
                icon: 'fas fa-list-ol',
                title: 'Prioritize Tasks',
                description: 'Make a priority list to reduce feeling overwhelmed',
                action: 'Create Priority List'
            },
            {
                icon: 'fas fa-walking',
                title: 'Short Walk',
                description: 'A 10-minute walk can significantly reduce stress levels',
                action: 'Set Walk Reminder'
            }
        ],
        sad: [
            {
                icon: 'fas fa-heart',
                title: 'Self-Care',
                description: 'Be kind to yourself and engage in comforting activities',
                action: 'Self-Care Ideas'
            },
            {
                icon: 'fas fa-comments',
                title: 'Reach Out',
                description: 'Connect with a friend or colleague for support',
                action: 'Message Someone'
            },
            {
                icon: 'fas fa-book',
                title: 'Positive Content',
                description: 'Read or watch something uplifting to improve your mood',
                action: 'View Recommendations'
            }
        ]
    };
    
    // Additional recommendations based on description keywords
    const keywordRecommendations = {
        work: {
            icon: 'fas fa-briefcase',
            title: 'Work-Life Balance',
            description: 'Consider setting boundaries between work and personal time',
            action: 'Set Boundaries'
        },
        sleep: {
            icon: 'fas fa-bed',
            title: 'Sleep Quality',
            description: 'Poor sleep affects mood and productivity - consider a sleep routine',
            action: 'Sleep Tips'
        },
        family: {
            icon: 'fas fa-home',
            title: 'Family Time',
            description: 'Quality time with loved ones can improve overall well-being',
            action: 'Schedule Family Time'
        },
        exercise: {
            icon: 'fas fa-running',
            title: 'Physical Activity',
            description: 'Regular exercise boosts mood and energy levels',
            action: 'Workout Ideas'
        }
    };
    
    // Show recommendations based on mood
    function showRecommendations(mood, description) {
        // Clear previous recommendations
        recommendationsGrid.innerHTML = '';
        
        // Add mood-specific recommendations
        moodRecommendations[mood].forEach(rec => {
            addRecommendationCard(rec);
        });
        
        // Check description for keywords and add additional recommendations
        if (description) {
            const lowerDesc = description.toLowerCase();
            
            Object.keys(keywordRecommendations).forEach(keyword => {
                if (lowerDesc.includes(keyword)) {
                    addRecommendationCard(keywordRecommendations[keyword]);
                }
            });
        }
        
        // Add general wellness recommendation
        addRecommendationCard({
            icon: 'fas fa-seedling',
            title: 'General Wellness',
            description: 'Remember to drink water, eat nutritious meals, and take breaks throughout the day',
            action: 'Wellness Tips'
        });
    }
    
    // Add recommendation card to grid
    function addRecommendationCard(rec) {
        const card = document.createElement('div');
        card.className = 'recommendation-card slide-in';
        card.innerHTML = `
            <div class="rec-icon">
                <i class="${rec.icon}"></i>
            </div>
            <h3>${rec.title}</h3>
            <p>${rec.description}</p>
            <a href="#" class="rec-action">${rec.action} <i class="fas fa-arrow-right"></i></a>
        `;
        recommendationsGrid.appendChild(card);
    }
    
    // Mood history tracking
    let moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
    
    function trackMood(mood, description) {
        const entry = {
            date: new Date().toISOString(),
            mood: mood,
            description: description
        };
        
        moodHistory.push(entry);
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
    }
    
    // Mood chart
    let moodChart = null;
    
    function updateMoodChart() {
        const ctx = document.getElementById('mood-chart').getContext('2d');
        
        // Process mood history data
        const last7Days = moodHistory.slice(-7).reverse();
        const dates = last7Days.map(entry => {
            const date = new Date(entry.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        });
        
        const moodValues = last7Days.map(entry => {
            const moodMap = { excited: 5, happy: 4, neutral: 3, tired: 2, stressed: 1, sad: 0 };
            return moodMap[entry.mood];
        });
        
        // If chart exists, destroy it first
        if (moodChart) {
            moodChart.destroy();
        }
        
        moodChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Mood Level',
                    data: moodValues,
                    backgroundColor: 'rgba(108, 92, 231, 0.2)',
                    borderColor: 'rgba(108, 92, 231, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                const valueMap = { 0: 'Sad', 1: 'Stressed', 2: 'Tired', 3: 'Neutral', 4: 'Happy', 5: 'Excited' };
                                return valueMap[value];
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const valueMap = { 0: 'Sad', 1: 'Stressed', 2: 'Tired', 3: 'Neutral', 4: 'Happy', 5: 'Excited' };
                                return `Mood: ${valueMap[context.raw]}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Initialize chart if there's history
    if (moodHistory.length > 0) {
        updateMoodChart();
    }
    
    // Notification function
    function showNotification(title, message) {
        // In a real app, you would use the Notifications API
        console.log(`${title}: ${message}`);
        // Or create a custom notification element
        const notification = document.createElement('div');
        notification.className = 'custom-notification slide-in';
        notification.innerHTML = `
            <h4>${title}</h4>
            <p>${message}</p>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});