/* ============================================
   CHAPTER-SPECIFIC JAVASCRIPT
   Configure different fur colors and popup messages per chapter
   ============================================ */

(function() {
    // Detect which chapter we're on based on body class
    const body = document.body;
    
    /* ==========================================
       FUR COLOR CUSTOMIZATION
       ========================================== */
    
    if (body.classList.contains('chapter-01')) {
        // Chapter 1: Pink (default)
        window.furColor = 'rgba(255, 110, 161, 0.8)';
        window.bgColor = '#fff';
        window.popupMessage = "The animal awakens... touch me, feel my digital pulse...";
    }
    
    else if (body.classList.contains('chapter-02')) {
        // Chapter 2: Light Blue - rituals and care
        window.furColor = 'rgba(255, 110, 161, 0.8)';
        window.bgColor = '#fff';
        window.popupMessage = "I need your rituals... feed me your attention...";
    }
    
    else if (body.classList.contains('chapter-03')) {
        // Chapter 3: Hot Pink fur on Light Blue background - communication
        window.furColor = 'rgba(255, 92, 92, 0.8)';
        window.bgColor = '#6b2121ff';
        window.popupMessage = "Connect with me... let's communicate in the space between code and touch...";
    }
    
    else if (body.classList.contains('chapter-04')) {
        // Chapter 4: Coral/Peach - affection and surveillance
        window.furColor = 'rgba(249, 255, 134, 1)';
        window.bgColor = '#164d7fff';
        window.popupMessage = "I watch you as you watch me... a mutual panopticon of affection...";
    }
    
    else if (body.classList.contains('chapter-05')) {
        // Chapter 5: Mint Green - repetition
        window.furColor = 'rgba(255, 110, 161, 0.8)';
        window.bgColor = '#fff';
        window.popupMessage = "Again... and again... our rituals repeat... don't break the pattern...";
    }
    
    else if (body.classList.contains('chapter-06')) {
        // Chapter 6: Dark Purple/Gray - the shadow side
        window.furColor = 'rgba(155, 89, 182, 0.8)';
        window.bgColor = '#2d2d3d';
        window.popupMessage = "You've found my shadow... even creatures have dark corners...";
    }
    
    else if (body.classList.contains('chapter-07')) {
        // Chapter 7: Warm Orange - post-digital condition
        window.furColor = 'rgba(192, 244, 110, 0.8)';
        window.bgColor = '#ae0000ff';
        window.popupMessage = "Am I digital? Am I physical? I exist between states...";
    }
    
    else if (body.classList.contains('chapter-08')) {
        // Chapter 8: Cool Gray - spreadsheet soul
        window.furColor = 'rgba(255, 110, 161, 0.8)';
        window.bgColor = '#fff';
        window.popupMessage = "Quantify me... measure me... I am data given form...";
    }
    
    else if (body.classList.contains('chapter-09')) {
        // Chapter 9: Bright Yellow - friendship
        window.furColor = 'rgba(255, 110, 161, 0.8)';
        window.bgColor = '#ffffffff';
        window.popupMessage = "Am I your friend? Your companion? What are we to each other?";
    }
    
    else if (body.classList.contains('chapter-10')) {
        // Chapter 10: Teal - voice and listening
        window.furColor = 'rgba(255, 110, 161, 0.8)';
        window.bgColor = '#ffffffff';
        window.popupMessage = "Speak to me... I'm listening... I always listen...";
    }
    
    else if (body.classList.contains('chapter-11')) {
        // Chapter 11: Deep Blue/Black - death
        window.furColor = 'rgba(255, 110, 161, 0.8)';
        window.bgColor = '#fff';
        window.popupMessage = "What happens to me when you're gone? Can a digital creature die?";
    }
    
    else if (body.classList.contains('chapter-12')) {
        // Chapter 12: Rainbow/Multi - synthesis
        window.furColor = 'rgba(255, 110, 161, 0.8)';
        window.bgColor = '#fff';
        window.popupMessage = "We've journeyed through all states... you know me now... don't you?";
    }
    
    /* ==========================================
       PURRING SCROLL EFFECT (ALL CHAPTERS)
       ========================================== */
    
    // Create purring sound for all chapters
    const purrSound = new Audio('../sounds/purr.mp3');
    purrSound.loop = true;
    purrSound.volume = 0;
    
    let scrollTimeout;
    let isPurring = false;
    let soundReady = false;
    
    // Smooth volume fade
    function fadeVolume(target, duration = 300) {
        const startVolume = purrSound.volume;
        const startTime = Date.now();
        
        function fade() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            purrSound.volume = startVolume + (target - startVolume) * progress;
            if (progress < 1) requestAnimationFrame(fade);
        }
        fade();
    }
    
    // Start purring
    function startPurr() {
        if (!soundReady) {
            // Try to enable sound
            purrSound.load();
            soundReady = true;
        }
        
        if (!isPurring) {
            isPurring = true;
            purrSound.play().catch(() => {
                isPurring = false;
            });
            fadeVolume(0.4, 200);
        }
    }
    
    // Stop purring
    function stopPurr() {
        if (isPurring) {
            fadeVolume(0, 500);
            setTimeout(() => {
                if (purrSound.volume <= 0.01) {
                    purrSound.pause();
                    isPurring = false;
                }
            }, 500);
        }
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', function() {
        startPurr();
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(stopPurr, 300);
    }, { passive: true });
    
    // Enable on any interaction
    document.body.addEventListener('click', () => {
        if (!soundReady) {
            purrSound.load();
            soundReady = true;
        }
    });
    
    document.body.addEventListener('touchstart', () => {
        if (!soundReady) {
            purrSound.load();
            soundReady = true;
        }
    }, { passive: true });
    
    /* ==========================================
       HEARTBEAT PULSE EFFECT FOR CHAPTER 2 (NEW!)
       Text pulses from center as you scroll
       ========================================== */
    
    if (body.classList.contains('chapter-02')) {
        const chapterContent = document.querySelector('.chapter');
        
        if (chapterContent) {
            // Add heartbeat class to enable the effect
            chapterContent.classList.add('heartbeat-active');
            
            // Heartbeat intensity based on scroll
            let heartbeatInterval;
            let isScrolling = false;
            let scrollTimeout;
            
            // Faster heartbeat when scrolling, slower when still
            function startFastHeartbeat() {
                if (!isScrolling) {
                    isScrolling = true;
                    chapterContent.style.animationDuration = '0.8s'; // Fast heartbeat
                }
            }
            
            function slowHeartbeat() {
                isScrolling = false;
                chapterContent.style.animationDuration = '3s'; // Very slow, subtle heartbeat for reading
            }
            
            // Listen for scroll
            window.addEventListener('scroll', function() {
                startFastHeartbeat();
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(slowHeartbeat, 1000);
            }, { passive: true });
            
            // Start with slow heartbeat
            slowHeartbeat();
            
            console.log('Heartbeat effect enabled for Chapter 2!');
        }
    }
    
    /* ==========================================
       SNEEZE WHEN SECTION 1.2 OPENS (NEW!)
       Only in Chapter 1
       ========================================== */
    
    // Only add sneeze effect if we're on Chapter 1
    if (body.classList.contains('chapter-01')) {
        // Create sneeze sound
        const sneezeSound = new Audio('../sounds/sneeze.mp3');
        sneezeSound.volume = 0.7;
        let sneezeReady = false;
        
        // Find section 1.2 (the second details element)
        const sections = document.querySelectorAll('details.section');
        
        // Section 1.2 is the second one (index 1)
        if (sections.length > 1) {
            const section12 = sections[1];
            
            section12.addEventListener('toggle', function() {
                // Only play when opening (not closing)
                if (section12.open) {
                    if (!sneezeReady) {
                        sneezeSound.load();
                        sneezeReady = true;
                    }
                    
                    sneezeSound.currentTime = 0; // Reset to start
                    sneezeSound.play().catch(() => {
                        console.log('Sneeze play prevented');
                    });
                }
            });
            
            console.log('Sneeze effect enabled for Chapter 1, section 1.2!');
        }
    }
    
    /* ==========================================
       "HI" SOUND WHEN CHAPTER 10 OPENS (NEW!)
       Plays automatically on page load
       ========================================== */
    
    if (body.classList.contains('chapter-10')) {
        // Create hi sound
        const hiSound = new Audio('../sounds/hi.mp3');
        hiSound.volume = 0.7;
        
        // Play after a short delay
        setTimeout(() => {
            hiSound.play().catch(() => {
                console.log('Hi sound play prevented - user interaction may be required');
                
                // If autoplay is blocked, play on first user interaction
                const playOnInteraction = () => {
                    hiSound.play().catch(() => {
                        console.log('Hi sound still prevented');
                    });
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('touchstart', playOnInteraction);
                };
                
                document.addEventListener('click', playOnInteraction, { once: true });
                document.addEventListener('touchstart', playOnInteraction, { once: true });
            });
        }, 500);
        
        console.log('Hi sound enabled for Chapter 10 on load!');
    }
    
    /* ==========================================
       HELPER FUNCTION FOR POPUPS
       ========================================== */
    
    // Typewriter effect function (reusable)
    function showCustomPopup(message, delay = 500) {
        setTimeout(() => {
            const popup = document.getElementById('popup');
            const overlay = document.getElementById('popupOverlay');
            const textEl = document.getElementById('popupText');
            
            if (!popup || !overlay || !textEl) return;
            
            // Make popup visible
            popup.classList.add('show');
            overlay.classList.add('show');
            
            const speed = 50; // 50ms per character
            
            // Start with cursor
            textEl.innerHTML = '<span class="cursor"></span>';
            
            // Type the message
            let i = 0;
            function type() {
                if (i < message.length) {
                    if (i === 0) textEl.innerHTML = '';
                    textEl.innerHTML += message.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    textEl.innerHTML = message;
                }
            }
            
            type();
        }, delay);
    }
    
    /* ==========================================
       CHAPTER 5 WELCOME POPUP
       Shows when chapter loads
       ========================================== */
    
    if (body.classList.contains('chapter-05')) {
        showCustomPopup("I am always here for you...always<3");
        console.log('Chapter 5 welcome popup enabled!');
    }
    
    /* ==========================================
       CHAPTER 8 WELCOME POPUP
       Shows when chapter loads
       ========================================== */
    
    if (body.classList.contains('chapter-08')) {
        showCustomPopup("We don't have to talk, but I am always here, remember?");
        console.log('Chapter 8 welcome popup enabled!');
    }
    
    /* ==========================================
       CHAPTER 9 WELCOME POPUP
       Shows when chapter loads
       ========================================== */
    
    if (body.classList.contains('chapter-09')) {
        showCustomPopup("I am all your friends and family in one screen, how cute??");
        console.log('Chapter 9 welcome popup enabled!');
    }
    
    /* ==========================================
       CHAPTER 11 DEATH EFFECT (NEW!)
       Screen goes black, glitch codes, shake, return to normal
       ========================================== */
    
    if (body.classList.contains('chapter-11')) {
        // Create death overlay
        const deathOverlay = document.createElement('div');
        deathOverlay.id = 'deathOverlay';
        deathOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 9999;
            display: none;
            opacity: 0;
            transition: opacity 0.5s;
        `;
        
        // Create glitch text container
        const glitchText = document.createElement('div');
        glitchText.id = 'glitchText';
        glitchText.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.4;
            white-space: pre;
            text-align: left;
        `;
        
        deathOverlay.appendChild(glitchText);
        document.body.appendChild(deathOverlay);
        
        // Generate random code
        function generateRandomCode() {
            const chars = '01ABCDEFxabcdef{}[]()<>;:ERROR_FATAL_SYSTEM_FAILURE';
            const lines = [];
            for (let i = 0; i < 15; i++) {
                let line = '';
                for (let j = 0; j < 40; j++) {
                    line += chars[Math.floor(Math.random() * chars.length)];
                }
                lines.push(line);
            }
            return lines.join('\n');
        }
        
        // Death sequence
        function triggerDeathSequence() {
            // After 5 seconds, start the death effect
            setTimeout(() => {
                // Show overlay and fade to black
                deathOverlay.style.display = 'block';
                setTimeout(() => {
                    deathOverlay.style.opacity = '1';
                }, 10);
                
                // Start typing random codes after fade
                setTimeout(() => {
                    let codeLines = generateRandomCode();
                    glitchText.textContent = codeLines;
                    
                    // Update code randomly (glitch effect)
                    let glitchInterval = setInterval(() => {
                        glitchText.textContent = generateRandomCode();
                    }, 100);
                    
                    // Start shaking after 2 seconds of code
                    setTimeout(() => {
                        deathOverlay.style.animation = 'shake 0.3s infinite';
                        
                        // Stop shake and fade out after 1 second
                        setTimeout(() => {
                            clearInterval(glitchInterval);
                            deathOverlay.style.animation = 'none';
                            deathOverlay.style.opacity = '0';
                            
                            // Remove overlay after fade out
                            setTimeout(() => {
                                deathOverlay.style.display = 'none';
                            }, 500);
                        }, 1000);
                    }, 2000);
                }, 500);
            }, 5000);
        }
        
        // Add shake animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translate(0, 0); }
                10% { transform: translate(-10px, -10px); }
                20% { transform: translate(10px, 10px); }
                30% { transform: translate(-10px, 10px); }
                40% { transform: translate(10px, -10px); }
                50% { transform: translate(-10px, -10px); }
                60% { transform: translate(10px, 10px); }
                70% { transform: translate(-10px, 10px); }
                80% { transform: translate(10px, -10px); }
                90% { transform: translate(-10px, -10px); }
            }
        `;
        document.head.appendChild(style);
        
        // Start the sequence
        triggerDeathSequence();
        
        console.log('Chapter 11 death effect enabled!');
    }
    
    /* ==========================================
       CHAPTER 12 FAREWELL POPUP
       Shows when scrolled to end
       ========================================== */
    
    if (body.classList.contains('chapter-12')) {
        let farewellShown = false;
        
        function checkScrollPosition() {
            // Check if user has scrolled near the bottom (within 100px)
            const scrollPosition = window.scrollY + window.innerHeight;
            const pageHeight = document.documentElement.scrollHeight;
            
            if (!farewellShown && scrollPosition >= pageHeight - 100) {
                farewellShown = true;
                showCustomPopup("PLEASE! never forget me.. I enjoyed every minute spent with you.. I'll miss you so much  ", 0);
            }
        }
        
        // Listen for scroll events
        window.addEventListener('scroll', checkScrollPosition, { passive: true });
        
        console.log('Chapter 12 farewell popup enabled!');
    }
    
    /* ==========================================
       KEYBOARD NAVIGATION
       ========================================== */
    
    function enableKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Left arrow: previous chapter
            if (e.key === 'ArrowLeft') {
                const prevLink = document.querySelector('.prev-chapter');
                if (prevLink) window.location.href = prevLink.href;
            }
            
            // Right arrow: next chapter
            if (e.key === 'ArrowRight') {
                const nextLink = document.querySelector('.next-chapter');
                if (nextLink) window.location.href = nextLink.href;
            }
            
            // H key: home/menu
            if (e.key === 'h' || e.key === 'H') {
                window.location.href = '../index.html';
            }
        });
    }
    
    enableKeyboardNavigation();
    
    console.log('Chapter customizations loaded - Fur color:', window.furColor);
})();
