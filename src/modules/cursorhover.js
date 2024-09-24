/**
 * @deprecated
 * @description
 * This file contains the cursor hover directive.
 * @file cursorhover.js
 * @example
 * ```html
 * <template>
 *    <div v-cursor>
 *       Hover over me
 *   </div>
 * </template>
 */

// cursorHover.js
export const vCursor = {
    mounted(el, binding) {
        el.classList.add('v-cursor-element');

        const cursorBox = document.createElement('div');
        cursorBox.classList.add('custom-cursor');
        document.body.appendChild(cursorBox);

        const updateCursorPosition = (e) => {
            cursorBox.style.left = `${e.clientX}px`;
            cursorBox.style.top = `${e.clientY}px`;
        };

        const showCursor = () => {
            cursorBox.classList.add('active');
        };

        const hideCursor = () => {
            cursorBox.classList.remove('active');
        };

        el.addEventListener('mousemove', updateCursorPosition);
        el.addEventListener('mouseenter', showCursor);
        el.addEventListener('mouseleave', hideCursor);

        // Clean up
        el.customCursor = {
            cursorBox,
            updateCursorPosition,
            showCursor,
            hideCursor
        };
    },
    unmounted(el) {
        el.classList.remove('v-cursor-element');
        document.body.removeChild(el.customCursor.cursorBox);
        el.removeEventListener('mousemove', el.customCursor.updateCursorPosition);
        el.removeEventListener('mouseenter', el.customCursor.showCursor);
        el.removeEventListener('mouseleave', el.customCursor.hideCursor);
    }
};
