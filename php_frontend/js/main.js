document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Custom Cursor Logic --- */
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    
    // Only activate custom cursor on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        
        document.addEventListener('mousemove', (e) => {
            // Using requestAnimationFrame for performance
            requestAnimationFrame(() => {
                if(cursor) cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
                if(cursorDot) cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
            });
        });

        // Hover Effects
        const hoverElements = document.querySelectorAll('a, button, .course-item, .interactive-card, [data-hover="true"]');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if(cursor) cursor.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                if(cursor) cursor.classList.remove('hovered');
            });
        });
    }

    /* --- 2. Mobile Menu Toggle --- */
    const mobileBtn = document.getElementById('mobile-toggle-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            mobileMenu.style.display = isMenuOpen ? 'flex' : 'none';
            
            // Icon Toggle (Simple Logic)
            if(isMenuOpen && typeof lucide !== 'undefined') {
                mobileBtn.innerHTML = '<i data-lucide="x" style="width:30px; height:30px;"></i>';
                lucide.createIcons();
            } else if(typeof lucide !== 'undefined') {
                mobileBtn.innerHTML = '<i data-lucide="menu" style="width:30px; height:30px;"></i>';
                lucide.createIcons();
            }
        });
    }

    /* --- 3. Lucide Icons Init --- */
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

});
