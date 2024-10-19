<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    import { cubicIn, cubicOut } from "svelte/easing";
    import { fly } from "svelte/transition";

    interface Props extends HTMLAttributes<HTMLDivElement> {
        /**
        The value shown in the result.
        */
        value: number;

        /**
        The unit displayed after the value.
        */
        unit?: string;

        /**
        When the key changes, the result will animate a change.
        */
        key?: any;
    };

    const { value, unit, key, ...rest }: Props = $props();

    const duration = 100;
    const flyOut = { duration, easing: cubicIn, opacity: 1, y: -17 };
    const flyIn = { duration, delay: duration, easing: cubicOut, opacity: 1, y: 17 };
</script>

<div class="result">
    {#key key ?? value}
        <div class="value" in:fly={flyIn} out:fly={flyOut} {...rest}>
            {value.toFixed(1)}<!--
            -->{#if unit}
                <span class="unit">{unit}</span>
            {/if}
        </div>
    {/key}
</div>

<style>
    .result {
        height: 1em;
        overflow: hidden;
        position: relative;
        width: 8rem;
    }

    .value {
        line-height: 1;
        position: absolute;
        text-align: center;
        width: 100%;
        -webkit-user-select: none;
        user-select: none;
    }

    .unit {
        font-size: 1.3rem;
        -webkit-user-select: none;
        user-select: none;
    }
</style>
