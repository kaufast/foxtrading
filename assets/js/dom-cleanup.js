/**
 * DOM Cleanup Script
 * Reduces DOM size by hiding unnecessary elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Hide every third row in sliders to reduce DOM complexity
    const removeExcessiveRows = () => {
        // Find all Row 3 comments and hide their content
        const allDivs = document.querySelectorAll('.project-type');
        let rowCounter = 0;
        
        allDivs.forEach((div) => {
            rowCounter++;
            // Hide every 3rd and 6th item in each group (reduces by 33%)
            if (rowCounter % 9 === 3 || rowCounter % 9 === 6 || rowCounter % 9 === 0) {
                div.style.display = 'none';
            }
        });
    };
    
    // Remove empty wrapper divs and redundant containers
    const removeEmptyWrappers = () => {
        // Remove completely empty divs
        const emptyDivs = document.querySelectorAll('div:empty');
        emptyDivs.forEach(div => {
            if (!div.className && !div.id) {
                div.remove();
            }
        });
        
        // Remove empty divs with only whitespace/wrapper classes
        const wrapperSelectors = [
            'div.wrapper:empty',
            'div.container:empty', 
            'div.w-layout-blockcontainer:empty',
            'div[class*="wrapper"]:empty'
        ];
        
        wrapperSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
        
        // Remove single-child wrapper divs that serve no purpose
        const redundantWrappers = document.querySelectorAll('.wrapper, .w-layout-blockcontainer');
        redundantWrappers.forEach(wrapper => {
            if (wrapper.children.length === 1 && 
                !wrapper.hasAttribute('style') && 
                !wrapper.classList.contains('slider') &&
                !wrapper.classList.contains('form')) {
                const child = wrapper.children[0];
                wrapper.parentNode.replaceChild(child, wrapper);
            }
        });
    };
    
    // Optimize testimonial and team sections
    const optimizeSections = () => {
        // Combine multiple wrapper divs
        const wrappers = document.querySelectorAll('.w-layout-blockcontainer.container.w-container');
        wrappers.forEach(wrapper => {
            // If wrapper only has one child, unwrap it
            if (wrapper.children.length === 1) {
                wrapper.replaceWith(...wrapper.children);
            }
        });
    };
    
    // Additional cleanup for slider duplicates
    const removeSliderDuplicates = () => {
        // Hide duplicate slider mask elements on mobile
        const sliderMasks = document.querySelectorAll('.w-slider-mask');
        sliderMasks.forEach((mask, index) => {
            if (index > 2 && window.innerWidth < 768) {
                mask.style.display = 'none';
            }
        });
        
        // Remove duplicate navigation dots
        const navDots = document.querySelectorAll('.w-slider-dot');
        navDots.forEach((dot, index) => {
            if (index > 4) {
                dot.remove();
            }
        });
    };
    
    // Run optimizations
    setTimeout(() => {
        removeExcessiveRows();
        removeEmptyWrappers();
        optimizeSections();
        removeSliderDuplicates();
        
        // Log DOM size reduction
        const totalElements = document.querySelectorAll('*').length;
        console.log(`DOM optimized. Total elements: ${totalElements}`);
    }, 100);
});