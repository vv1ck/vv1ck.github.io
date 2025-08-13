// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const mainWebsite = document.getElementById('main-website');
const backgroundMusic = document.getElementById('background-music');

// Compute header offset for safe area and fixed header
function updateHeaderOffset() {
    const header = document.querySelector('.header');
    if (!header) return;
    const headerHeight = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-offset', `${Math.ceil(headerHeight)}px`);
}

window.addEventListener('resize', updateHeaderOffset);
window.addEventListener('orientationchange', updateHeaderOffset);

// Start background music immediately when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Try to start music immediately
    playBackgroundMusic();
    
    // Add click listener for browsers that block autoplay
    document.addEventListener('click', () => {
        playBackgroundMusic();
    }, { once: true });
});

// Loading Screen Animation
window.addEventListener('load', () => {
    // Ensure music is playing during loading
    playBackgroundMusic();
    
    // Start loading animation
    setTimeout(() => {
        // Hide loading screen and show main website
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 1s ease-out';
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            mainWebsite.classList.remove('hidden');
            
            // Update header offset after content is visible
            updateHeaderOffset();
            
            // Start main website animations
            initMainWebsite();
        }, 1000);
    }, 3000); // 3 seconds loading time
});

// Enhanced Background Music Control
function playBackgroundMusic() {
    // Create atmospheric sound using Web Audio API
    createAtmosphericSound();
    
    // Set volume and try to play
    backgroundMusic.volume = 0.2;
    backgroundMusic.loop = true;
    
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('Background music started successfully');
        }).catch(error => {
            console.log('Audio autoplay prevented:', error);
            // Show a subtle indicator that music can be enabled
            showMusicIndicator();
        });
    }
}

// Show music indicator for user interaction
function showMusicIndicator() {
    const indicator = document.createElement('div');
    indicator.innerHTML = '<i class="fas fa-volume-mute"></i> Click to enable sound';
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(220, 38, 38, 0.9);
        color: white;
        padding: 10px 15px;
        border-radius: 25px;
        font-size: 0.9rem;
        z-index: 10001;
        cursor: pointer;
        animation: pulse 2s infinite;
    `;
    
    indicator.addEventListener('click', () => {
        backgroundMusic.play().then(() => {
            indicator.remove();
        });
    });
    
    document.body.appendChild(indicator);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.remove();
        }
    }, 10000);
}

// Enhanced atmospheric sound using Web Audio API
function createAtmosphericSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        
        // Create multiple oscillators for richer sound
        const oscillators = [];
        const gainNodes = [];
        
        // Low frequency bass
        const bass = audioContext.createOscillator();
        const bassGain = audioContext.createGain();
        bass.connect(bassGain);
        bassGain.connect(audioContext.destination);
        bass.type = 'sine';
        bass.frequency.setValueAtTime(40, audioContext.currentTime);
        bassGain.gain.setValueAtTime(0.03, audioContext.currentTime);
        
        // Mid frequency atmosphere
        const mid = audioContext.createOscillator();
        const midGain = audioContext.createGain();
        mid.connect(midGain);
        midGain.connect(audioContext.destination);
        mid.type = 'triangle';
        mid.frequency.setValueAtTime(80, audioContext.currentTime);
        midGain.gain.setValueAtTime(0.02, audioContext.currentTime);
        
        // High frequency sparkle
        const high = audioContext.createOscillator();
        const highGain = audioContext.createGain();
        high.connect(highGain);
        highGain.connect(audioContext.destination);
        high.type = 'sine';
        high.frequency.setValueAtTime(200, audioContext.currentTime);
        highGain.gain.setValueAtTime(0.01, audioContext.currentTime);
        
        // Add frequency modulation for more dynamic sound
        bass.frequency.exponentialRampToValueAtTime(60, audioContext.currentTime + 4);
        bass.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 8);
        
        mid.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 3);
        mid.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 6);
        
        // Start all oscillators
        bass.start();
        mid.start();
        high.start();
        
        // Store references
        oscillators.push(bass, mid, high);
        gainNodes.push(bassGain, midGain, highGain);
        
        // Fade out after 45 seconds
        setTimeout(() => {
            gainNodes.forEach(gain => {
                gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 3);
            });
            setTimeout(() => {
                oscillators.forEach(osc => {
                    try { osc.stop(); } catch(e) {}
                });
            }, 3000);
        }, 45000);
        
    } catch (e) {
        console.log('Web Audio API not supported:', e);
    }
}

// Initialize main website animations
function initMainWebsite() {
    // Animate hero elements
    animateHeroElements();
    
    // Initialize parallax effects
    initParallaxEffects();
    
    // Initialize ticker animation
    initTickerAnimation();
    
    // Add hover effects to achievement cards
    initAchievementCards();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
}

// Animate hero elements on load
function animateHeroElements() {
    const heroImage = document.querySelector('.profile-image');
    const heroTitle = document.querySelector('.hero-title');
    const heroDetails = document.querySelectorAll('.detail-item');
    
    // Animate profile image
    setTimeout(() => {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'scale(0.8)';
        heroImage.style.transition = 'all 1s ease-out';
        
        setTimeout(() => {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'scale(1)';
        }, 100);
    }, 500);
    
    // Animate title
    setTimeout(() => {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        heroTitle.style.transition = 'all 1s ease-out';
        
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 100);
    }, 800);
    
    // Animate detail items
    heroDetails.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
            item.style.transition = 'all 0.8s ease-out';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100);
        }, 1200 + (index * 200));
    });
}

// Initialize parallax effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.bg-layer');
    
    // Clear transforms initially to avoid accumulation
    parallaxElements.forEach(el => { el.style.transform = 'translate3d(0,0,0)'; });
    
    let lastScrollY = window.pageYOffset;
    let mouseX = 0.5;
    let mouseY = 0.5;
    
    function applyParallax() {
        const scrolled = lastScrollY;
        parallaxElements.forEach((element, index) => {
            const scrollSpeed = (index + 1) * 0.3;
            const mouseSpeed = (index + 1) * 6;
            const y = scrolled * scrollSpeed;
            const x = (mouseX - 0.5) * mouseSpeed;
            const yy = (mouseY - 0.5) * mouseSpeed;
            element.style.transform = `translate3d(${x}px, ${y + yy}px, 0)`;
        });
    }
    
    window.addEventListener('scroll', () => {
        lastScrollY = window.pageYOffset;
        applyParallax();
    }, { passive: true });
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        applyParallax();
    });
    
    applyParallax();
}

// Initialize ticker animation
function initTickerAnimation() {
    const tickerContent = document.querySelector('.ticker-content');
    const tickerItems = document.querySelectorAll('.ticker-item');
    
    // Clone ticker items for seamless loop
    tickerItems.forEach(item => {
        const clone = item.cloneNode(true);
        tickerContent.appendChild(clone);
    });
}

// Initialize achievement cards effects
function initAchievementCards() {
    const cards = document.querySelectorAll('.achievement-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add random rotation effect
            const rotation = (Math.random() - 0.5) * 10;
            card.style.transform = `translateY(-10px) rotate(${rotation}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
}

// Initialize smooth scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Copy to clipboard function
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

// Fallback copy function
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyNotification('Copied to clipboard!');
        } else {
            showCopyNotification('Failed to copy');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showCopyNotification('Failed to copy');
    }
    
    document.body.removeChild(textArea);
}

// Show copy notification
function showCopyNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        font-family: 'Oswald', sans-serif;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe achievement cards
    const cards = document.querySelectorAll('.achievement-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.8s ease-out';
        observer.observe(card);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'M' to toggle music
    if (e.key.toLowerCase() === 'm') {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
        } else {
            backgroundMusic.pause();
        }
    }
    
    // Press 'Escape' to scroll to top
    if (e.key === 'Escape') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Add dynamic stats updates
function updateStats() {
    const stats = [
        { selector: '.ticker-item:nth-child(1) span', base: 15847, increment: 1 },
        { selector: '.ticker-item:nth-child(2) span', base: 2341, increment: 0.1 },
        { selector: '.ticker-item:nth-child(3) span', base: 8923, increment: 0.5 },
    ];
    
    stats.forEach(stat => {
        const element = document.querySelector(stat.selector);
        if (element) {
            setInterval(() => {
                const currentValue = parseInt(element.textContent.split(': ')[1].replace(',', ''));
                const newValue = currentValue + Math.floor(Math.random() * stat.increment + 1);
                element.textContent = element.textContent.split(': ')[0] + ': ' + newValue.toLocaleString();
            }, 30000); // Update every 30 seconds
        }
    });
}

// Initialize dynamic stats
setTimeout(updateStats, 5000);

// Add performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

monitorPerformance();

