document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    body.setAttribute('data-theme', savedTheme);
    
    // Update icon based on theme
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // Settings Modal
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModal = document.querySelector('.close-modal');
    
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    closeModal.addEventListener('click', () => {
        settingsModal.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Theme Selection
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            // Update active state
            themeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            updateThemeIcon(theme);
        });
        
        // Set active button based on current theme
        if (button.getAttribute('data-theme') === savedTheme) {
            button.classList.add('active');
        }
    });
    
    // Font Size Adjustment
    const fontSizeSlider = document.getElementById('font-size');
    const savedFontSize = localStorage.getItem('fontSize') || 16;
    document.documentElement.style.fontSize = `${savedFontSize}px`;
    fontSizeSlider.value = savedFontSize;
    
    fontSizeSlider.addEventListener('input', () => {
        const size = fontSizeSlider.value;
        document.documentElement.style.fontSize = `${size}px`;
        localStorage.setItem('fontSize', size);
    });
    
    // Search Functionality
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.querySelector('.search-suggestions');
    
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length > 0) {
            const suggestions = getSuggestions(query);
            displaySuggestions(suggestions);
            searchSuggestions.classList.add('show');
        } else {
            searchSuggestions.classList.remove('show');
        }
    });
    
    function getSuggestions(query) {
        const features = [
            'Mood Tracker', 'Pomodoro Timer', 'Task Manager', 
            'To-Do List', 'Screen Time', 'Dashboard',
            'Settings', 'Focus Mode', 'Productivity Tips'
        ];
        
        return features.filter(feature => 
            feature.toLowerCase().includes(query)
        );
    }
    
    function displaySuggestions(suggestions) {
        if (suggestions.length > 0) {
            searchSuggestions.innerHTML = suggestions.map(suggestion => 
                `<div class="suggestion-item">${suggestion}</div>`
            ).join('');
        } else {
            searchSuggestions.innerHTML = '<div class="suggestion-item">No results found</div>';
        }
        
        // Add click event to suggestion items
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                searchInput.value = item.textContent;
                searchSuggestions.classList.remove('show');
                // Here you would typically navigate to the selected feature
                console.log(`Navigating to ${item.textContent}`);
            });
        });
    }
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.classList.remove('show');
        }
    });
    
    // Focus Mode
    const focusModeBtn = document.getElementById('focus-mode');
    let focusMode = false;
    
    focusModeBtn.addEventListener('click', () => {
        focusMode = !focusMode;
        
        if (focusMode) {
            body.classList.add('focus-mode');
            focusModeBtn.innerHTML = '<i class="fas fa-spa"></i>';
            focusModeBtn.style.color = 'var(--success)';
            showNotification('Focus Mode Activated', 'All notifications are now muted.');
            
            // Start focus timer (you would implement this)
            startFocusTimer();
        } else {
            body.classList.remove('focus-mode');
            focusModeBtn.innerHTML = '<i class="fas fa-spa"></i>';
            focusModeBtn.style.color = '';
            showNotification('Focus Mode Deactivated', 'Notifications are now enabled.');
            
            // Stop focus timer
            stopFocusTimer();
        }
    });
    
    function startFocusTimer() {
        console.log('Focus timer started');
        // Implement focus timer logic
    }
    
    function stopFocusTimer() {
        console.log('Focus timer stopped');
        // Implement focus timer stop logic
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
    
    // Motivational Quotes
    const quotes = [
        {
            text: "The secret of getting ahead is getting started.",
            author: "Mark Twain"
        },
        {
            text: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.",
            author: "Paul J. Meyer"
        },
        {
            text: "You don't have to see the whole staircase, just take the first step.",
            author: "Martin Luther King Jr."
        },
        {
            text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
            author: "Stephen Covey"
        },
        {
            text: "Focus on being productive instead of busy.",
            author: "Tim Ferriss"
        },
        {
            text: "Your time is limited, don't waste it living someone else's life.",
            author: "Steve Jobs"
        },
        {
            text: "The way to get started is to quit talking and begin doing.",
            author: "Walt Disney"
        },
        {
            text: "Small daily improvements are the key to staggering long-term results.",
            author: "Robin Sharma"
        }
    ];
    
    const quoteReminder = document.querySelector('.quote-reminder');
    const quoteText = document.querySelector('.quote-text');
    const closeQuoteBtn = document.querySelector('.close-quote');
    
    // Show random quote
    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteText.textContent = `"${quote.text}" — ${quote.author}`;
        
        // Show the quote reminder
        setTimeout(() => {
            quoteReminder.classList.add('show');
        }, 5000);
    }
    
    // Close quote button
    closeQuoteBtn.addEventListener('click', () => {
        quoteReminder.classList.remove('show');
        
        // Show another quote after some time
        setTimeout(showRandomQuote, 300000); // 5 minutes
    });
    
    // Initial quote
    showRandomQuote();
    
    // Typing animation for hero text
    const typingElement = document.querySelector('.typing');
    const words = ["Productivity", "Focus", "Efficiency", "Success", "Goals"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(type, 1500);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
        } else {
            const typingSpeed = isDeleting ? 50 : 150;
            setTimeout(type, typingSpeed);
        }
    }
    
    // Start typing animation
    setTimeout(type, 1000);
    
    // Feature card animations
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        // Staggered animation
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Hover effect
        card.addEventListener('mouseenter', () => {
            card.classList.add('grow-on-hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('grow-on-hover');
        });
    });
    
    // Productivity tip animation
    const productivityTip = document.querySelector('.productivity-tip');
    setTimeout(() => {
        productivityTip.classList.add('slide-in');
    }, 2000);
});