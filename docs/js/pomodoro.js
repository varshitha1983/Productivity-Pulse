document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const timeLeft = document.getElementById('time-left');
    const timerState = document.getElementById('timer-state');
    const timerCircle = document.getElementById('timer-circle');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    // Timer settings elements
    const workDuration = document.getElementById('work-duration');
    const shortBreak = document.getElementById('short-break');
    const longBreak = document.getElementById('long-break');
    const pomoCount = document.getElementById('pomo-count');
    
    // Stats elements
    const completedPomos = document.getElementById('completed-pomos');
    const totalFocus = document.getElementById('total-focus');
    const streakDays = document.getElementById('streak-days');
    
    // Timer variables
    let timer;
    let timeRemaining;
    let isRunning = false;
    let isPaused = false;
    let currentMode = 'work'; // 'work', 'shortBreak', 'longBreak'
    let pomodorosCompleted = 0;
    let totalFocusTime = 0;
    let currentStreak = 0;
    
    // Load saved data
    loadData();
    
    // Initialize timer display
    updateTimerDisplay(parseInt(workDuration.value) * 60);
    
    // Event listeners for timer controls
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    // Event listeners for settings
    document.getElementById('work-plus').addEventListener('click', () => adjustSetting(workDuration, 1));
    document.getElementById('work-minus').addEventListener('click', () => adjustSetting(workDuration, -1));
    document.getElementById('short-plus').addEventListener('click', () => adjustSetting(shortBreak, 1));
    document.getElementById('short-minus').addEventListener('click', () => adjustSetting(shortBreak, -1));
    document.getElementById('long-plus').addEventListener('click', () => adjustSetting(longBreak, 1));
    document.getElementById('long-minus').addEventListener('click', () => adjustSetting(longBreak, -1));
    document.getElementById('pomo-plus').addEventListener('click', () => adjustSetting(pomoCount, 1));
    document.getElementById('pomo-minus').addEventListener('click', () => adjustSetting(pomoCount, -1));
    
    // Input validation for settings
    [workDuration, shortBreak, longBreak, pomoCount].forEach(input => {
        input.addEventListener('change', function() {
            const min = parseInt(this.min);
            const max = parseInt(this.max);
            let value = parseInt(this.value);
            
            if (isNaN(value)) value = min;
            if (value < min) value = min;
            if (value > max) value = max;
            
            this.value = value;
            
            if (!isRunning) {
                if (this === workDuration) {
                    updateTimerDisplay(value * 60);
                }
            }
        });
    });
    
    // Timer functions
    function startTimer() {
        if (!isRunning) {
            // Starting fresh
            const duration = currentMode === 'work' ? parseInt(workDuration.value) : 
                           currentMode === 'shortBreak' ? parseInt(shortBreak.value) : 
                           parseInt(longBreak.value);
            timeRemaining = duration * 60;
            
            isRunning = true;
            isPaused = false;
            
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            resetBtn.disabled = false;
            
            timerState.textContent = currentMode === 'work' ? 'Focusing' : 'Break Time';
            
            // Update UI for current mode
            updateModeUI();
        } else if (isPaused) {
            // Resuming from pause
            isPaused = false;
            
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            resetBtn.disabled = false;
            
            timerState.textContent = currentMode === 'work' ? 'Focusing' : 'Break Time';
        }
        
        timer = setInterval(updateTimer, 1000);
    }
    
    function pauseTimer() {
        isPaused = true;
        clearInterval(timer);
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        timerState.textContent = 'Paused';
    }
    
    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        isPaused = false;
        
        const duration = currentMode === 'work' ? parseInt(workDuration.value) : 
                       currentMode === 'shortBreak' ? parseInt(shortBreak.value) : 
                       parseInt(longBreak.value);
        timeRemaining = duration * 60;
        
        updateTimerDisplay(timeRemaining);
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
        
        timerState.textContent = 'Ready';
        timerCircle.style.background = `conic-gradient(var(--primary) 0%, transparent 0%)`;
    }
    
    function updateTimer() {
        if (!isPaused) {
            timeRemaining--;
            
            updateTimerDisplay(timeRemaining);
            
            // Update circle progress
            const duration = currentMode === 'work' ? parseInt(workDuration.value) * 60 : 
                           currentMode === 'shortBreak' ? parseInt(shortBreak.value) * 60 : 
                           parseInt(longBreak.value) * 60;
            const percentage = 100 - (timeRemaining / duration) * 100;
            timerCircle.style.background = `conic-gradient(var(--primary) ${percentage}%, transparent ${percentage}%)`;
            
            if (timeRemaining <= 0) {
                clearInterval(timer);
                timerComplete();
            }
        }
    }
    
    function updateTimerDisplay(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timeLeft.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    function timerComplete() {
        // Play sound
        playTimerSound();
        
        if (currentMode === 'work') {
            pomodorosCompleted++;
            totalFocusTime += parseInt(workDuration.value);
            completedPomos.textContent = pomodorosCompleted;
            updateTotalFocusTime();
            
            // Check if it's time for a long break
            if (pomodorosCompleted % parseInt(pomoCount.value) === 0) {
                currentMode = 'longBreak';
                timeRemaining = parseInt(longBreak.value) * 60;
                showNotification('Great work!', 'Time for a well-deserved long break');
            } else {
                currentMode = 'shortBreak';
                timeRemaining = parseInt(shortBreak.value) * 60;
                showNotification('Pomodoro completed!', 'Take a short break');
            }
        } else {
            // Break completed, back to work
            currentMode = 'work';
            timeRemaining = parseInt(workDuration.value) * 60;
            showNotification('Break over!', 'Time to focus again');
        }
        
        // Update UI for new mode
        updateModeUI();
        
        // Start next timer automatically
        startTimer();
        
        // Save data
        saveData();
    }
    
    function updateModeUI() {
        // Change colors based on mode
        if (currentMode === 'work') {
            document.documentElement.style.setProperty('--primary', '#6c5ce7');
            document.documentElement.style.setProperty('--accent', '#fd79a8');
        } else if (currentMode === 'shortBreak') {
            document.documentElement.style.setProperty('--primary', '#00b894');
            document.documentElement.style.setProperty('--accent', '#55efc4');
        } else {
            document.documentElement.style.setProperty('--primary', '#0984e3');
            document.documentElement.style.setProperty('--accent', '#74b9ff');
        }
        
        // Update timer display
        updateTimerDisplay(timeRemaining);
        timerCircle.style.background = `conic-gradient(var(--primary) 0%, transparent 0%)`;
    }
    
    function playTimerSound() {
        const audio = new Audio('assets/sounds/notification.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
    
    function adjustSetting(input, change) {
        let value = parseInt(input.value) + change;
        const min = parseInt(input.min);
        const max = parseInt(input.max);
        
        if (value < min) value = min;
        if (value > max) value = max;
        
        input.value = value;
        
        if (!isRunning && input === workDuration) {
            updateTimerDisplay(value * 60);
        }
    }
    
    function updateTotalFocusTime() {
        const hours = Math.floor(totalFocusTime / 60);
        const minutes = totalFocusTime % 60;
        totalFocus.textContent = `${hours}h ${minutes}m`;
    }
    
    function loadData() {
        const data = JSON.parse(localStorage.getItem('pomodoroData')) || {};
        
        pomodorosCompleted = data.pomodorosCompleted || 0;
        totalFocusTime = data.totalFocusTime || 0;
        currentStreak = data.currentStreak || 0;
        
        // Update UI
        completedPomos.textContent = pomodorosCompleted;
        updateTotalFocusTime();
        streakDays.textContent = currentStreak;
        
        // Load settings if they exist
        if (data.settings) {
            workDuration.value = data.settings.workDuration || 25;
            shortBreak.value = data.settings.shortBreak || 5;
            longBreak.value = data.settings.longBreak || 15;
            pomoCount.value = data.settings.pomoCount || 4;
        }
    }
    
    function saveData() {
        const data = {
            pomodorosCompleted,
            totalFocusTime,
            currentStreak,
            settings: {
                workDuration: parseInt(workDuration.value),
                shortBreak: parseInt(shortBreak.value),
                longBreak: parseInt(longBreak.value),
                pomoCount: parseInt(pomoCount.value)
            },
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('pomodoroData', JSON.stringify(data));
    }
    
    // Check and update streak
    function checkStreak() {
        const data = JSON.parse(localStorage.getItem('pomodoroData')) || {};
        const lastUpdated = data.lastUpdated ? new Date(data.lastUpdated) : null;
        const today = new Date();
        
        if (lastUpdated) {
            // Check if last updated was yesterday
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastUpdated.toDateString() === yesterday.toDateString()) {
                // Increment streak
                currentStreak = (data.currentStreak || 0) + 1;
            } else if (lastUpdated.toDateString() !== today.toDateString()) {
                // Reset streak if not consecutive
                currentStreak = 0;
            }
        }
        
        streakDays.textContent = currentStreak;
    }
    
    // Initialize streak check
    checkStreak();
    
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