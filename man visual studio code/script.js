/* ============================================
   MAGNETIC FUR BACKGROUND EFFECT
   ============================================ */
(function() {
    const canvas = document.getElementById('furCanvas');
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    let FLUIDMAP = [];
    let inputsDelta = {};
    let WIDTH, HEIGHT;
    
    // Set canvas size to cover entire document
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        
        // Recalculate grid dimensions
        WIDTH = Math.floor(canvas.width / 20) + 1;
        HEIGHT = Math.floor(canvas.height / 20) + 1;
        
        // Reinitialize fluid map
        initFluidMap();
    }
    
    // Initialize the fluid map with zero velocity
    function initFluidMap() {
        FLUIDMAP = [];
        for (let x = 0; x < WIDTH; ++x) {
            FLUIDMAP[x] = [];
            for (let y = 0; y < HEIGHT; ++y) {
                FLUIDMAP[x][y] = {
                    x: 0,
                    y: 0
                };
            }
        }
    }
    
    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Track if mouse is down
    let mouseDown = false;
    
    // Mouse handlers - listen on document
    document.addEventListener('mousedown', function(e) {
        mouseDown = true;
        inputsDelta['mouse'] = { x: e.clientX, y: e.clientY };
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!mouseDown || !inputsDelta['mouse']) return;
        
        const x = Math.floor(e.clientX / 20);
        const y = Math.floor(e.clientY / 20);
        
        if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
            const oldInput = inputsDelta['mouse'];
            FLUIDMAP[x][y].x = (e.clientX - oldInput.x);
            FLUIDMAP[x][y].y = (e.clientY - oldInput.y);
            inputsDelta['mouse'] = { x: e.clientX, y: e.clientY };
        }
    });
    
    document.addEventListener('mouseup', function() {
        mouseDown = false;
        delete inputsDelta['mouse'];
    });
    
    // Touch handlers - listen on document, passive: true for scrolling
    document.addEventListener('touchstart', function(e) {
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            inputsDelta[touch.identifier] = { 
                x: touch.clientX, 
                y: touch.clientY + scrollY,
                startX: touch.clientX,
                startY: touch.clientY + scrollY,
                lastTime: Date.now()
            };
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const tracking = inputsDelta[touch.identifier];
            
            if (!tracking) continue;
            
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const currentX = touch.clientX;
            const currentY = touch.clientY + scrollY;
            
            // Calculate movement delta
            const deltaX = currentX - tracking.x;
            const deltaY = currentY - tracking.y;
            
            // Check if this is primarily vertical movement (scrolling) - if so, skip it
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);
            
            // If movement is more than 70% vertical, it's scrolling - ignore it
            if (absY > absX * 2) {
                inputsDelta[touch.identifier].x = currentX;
                inputsDelta[touch.identifier].y = currentY;
                continue;
            }
            
            // Limit maximum velocity to prevent crazy movements (cap at 20)
            const cappedDeltaX = Math.max(-20, Math.min(20, deltaX));
            const cappedDeltaY = Math.max(-20, Math.min(20, deltaY));
            
            const x = Math.floor(currentX / 20);
            const y = Math.floor(currentY / 20);
            
            if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
                FLUIDMAP[x][y].x = cappedDeltaX;
                FLUIDMAP[x][y].y = cappedDeltaY;
            }
            
            inputsDelta[touch.identifier].x = currentX;
            inputsDelta[touch.identifier].y = currentY;
            inputsDelta[touch.identifier].lastTime = Date.now();
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            delete inputsDelta[e.changedTouches[i].identifier];
        }
    }, { passive: true });
    
    // Main animation loop
    function animate() {
        // Update fluid dynamics
        const newFluid = [];
        for (let x = 0; x < WIDTH; ++x) {
            newFluid[x] = [];
            for (let y = 0; y < HEIGHT; ++y) {
                let dx = FLUIDMAP[x][y].x * 0.8;
                let dy = FLUIDMAP[x][y].y * 0.8;
                
                if (x > 0) {
                    dx += FLUIDMAP[x - 1][y].x * 0.05;
                    dy += FLUIDMAP[x - 1][y].y * 0.05;
                }
                if (x < WIDTH - 1) {
                    dx += FLUIDMAP[x + 1][y].x * 0.05;
                    dy += FLUIDMAP[x + 1][y].y * 0.05;
                }
                if (y > 0) {
                    dx += FLUIDMAP[x][y - 1].x * 0.05;
                    dy += FLUIDMAP[x][y - 1].y * 0.05;
                }
                if (y < HEIGHT - 1) {
                    dx += FLUIDMAP[x][y + 1].x * 0.05;
                    dy += FLUIDMAP[x][y + 1].y * 0.05;
                }
                
                newFluid[x][y] = { x: dx, y: dy };
            }
        }
        FLUIDMAP = newFluid;
        
        // Render the fur effect
        // Use dynamic background color from window.bgColor (set by chapter-script.js)
        ctx.fillStyle = window.bgColor || '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Use dynamic fur color from window.furColor (set by chapter-script.js)
        // Default to pink if not set
        ctx.strokeStyle = window.furColor || 'rgba(255, 110, 161, 0.8)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < WIDTH; ++x) {
            for (let y = 0; y < HEIGHT; ++y) {
                const p = FLUIDMAP[x][y];
                ctx.beginPath();
                ctx.moveTo(x * 20, y * 20);
                ctx.lineTo(x * 20 + p.x * 20, y * 20 + p.y * 20);
                ctx.stroke();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
})();

/* ============================================
   INACTIVITY POPUP SYSTEM
   ============================================ */
let inactivityTimer;
const INACTIVITY_TIME = 15000; // 15 seconds
const messageText = "Ughhh... I am bored.. I miss your soft touch... keep your hand on me!";
let typingTimeout;
let isTyping = false;

// Events that count as user activity
const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

// Reset the inactivity timer
function resetTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(showPopup, INACTIVITY_TIME);
}

// Typewriter effect function
function typeWriter(element, text, speed, callback) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            typingTimeout = setTimeout(type, speed);
        } else {
            if (callback) callback();
        }
    }
    
    type();
}

// Show popup with typing animation
function showPopup() {
    if (isTyping) return;
    
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('popupOverlay');
    const textEl = document.getElementById('popupText');
    
    // Make popup visible
    popup.classList.add('show');
    overlay.classList.add('show');
    isTyping = true;
    
    const speed = 50; // 50ms per character
    
    // Start with cursor
    textEl.innerHTML = '<span class="cursor"></span>';
    
    // Type the message
    typeWriter(textEl, messageText, speed, () => {
        textEl.innerHTML = messageText;
        isTyping = false;
    });
}

// Close popup and restart timer
function closePopup() {
    clearTimeout(typingTimeout);
    document.getElementById('popup').classList.remove('show');
    document.getElementById('popupOverlay').classList.remove('show');
    isTyping = false;
    resetTimer();
}

// Listen for user activity
activityEvents.forEach(event => {
    document.addEventListener(event, resetTimer, true);
});

// Allow closing by clicking overlay
document.getElementById('popupOverlay').addEventListener('click', closePopup);

// Start the timer on page load
resetTimer();