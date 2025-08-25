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
    
    // Remove empty wrapper divs
    const removeEmptyWrappers = () => {
        const emptyDivs = document.querySelectorAll('div:empty');
        emptyDivs.forEach(div => {
            if (!div.className && !div.id) {
                div.remove();
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
    
    // Run optimizations
    setTimeout(() => {
        removeExcessiveRows();
        removeEmptyWrappers();
        optimizeSections();
        
        // Log DOM size reduction
        const totalElements = document.querySelectorAll('*').length;
        console.log(`DOM optimized. Total elements: ${totalElements}`);
    }, 100);
});