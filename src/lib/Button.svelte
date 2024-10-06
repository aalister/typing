<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";

    interface Props extends HTMLButtonAttributes {
        children: Snippet;
    };

    let { children, ...rest }: Props = $props();
</script>

<button type="button" {...rest}>
    {@render children()}
</button>

<style>
    button {
        align-items: center;
        background: none;
        border-radius: 0.3rem;
        border: none;
        display: flex;
        font: inherit;
        gap: 1.6rem;
        height: 4.8rem;
        justify-content: center;
        overflow: hidden;
        padding: 0 1.4rem;
        position: relative;
        z-index: 0;
    }

    button::before {
        background: var(--text1);
        content: "";
        inset: 0;
        opacity: 0;
        position: absolute;
        transition: opacity 100ms;
        z-index: -1;
    }

    button:hover::before {
        opacity: 0.05;
    }

    button:active::before {
        opacity: 0.15;
        transition: 0ms;
    }

    button:focus-visible {
        outline: 0.2rem solid var(--primary1);
    }
</style>
