<script lang="ts">
    export let text: string;
    export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';
</script>

<span class="tooltip-wrapper">
    <svg class="tooltip-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12" y2="17"></line>
    </svg>
    <span class="tooltip-text {position}">{text}</span>
</span>

<style>
    .tooltip-wrapper {
        display: inline-flex;
        align-items: center;
        position: relative;
        vertical-align: middle;
        margin-left: 0.5rem;
        text-decoration: none !important;
    }

    .tooltip-icon {
        cursor: help;
        color: var(--text-secondary);
        transition: color 0.2s;
        pointer-events: all;
    }

    .tooltip-icon:hover {
        color: var(--text-primary);
    }

    .tooltip-text {
        visibility: hidden;
        position: absolute;
        background-color: var(--background-secondary);
        color: var(--text-primary);
        text-align: center;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        white-space: nowrap;
        z-index: 50;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transition: opacity 0.2s;
        text-decoration: none !important;
        pointer-events: none;
    }

    .tooltip-text.right {
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 0.5rem;
    }

    /* Other position styles remain the same */

    .tooltip-wrapper:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
    }
</style>
