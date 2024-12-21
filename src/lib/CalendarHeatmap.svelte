<script lang="ts">
    import type { Snippet } from "svelte";
    import { daysBetween, getDay, shiftDate } from "./date";

    interface Props {
        /**
        Data contains the values for each day starting from the start date.
        */
        data: number[];

        /**
        Start date is the first day in the calendar.
        */
        startDate: Date;

        /**
        End date is the last day in the calendar.
        */
        endDate: Date;

        /**
        Tooltip is displayed when hovering over a day.
        */
        tooltip?: Snippet<[number, Date]>;

        /**
        Opacity calculates the opacity of a day given its value.
        */
        opacity?: (value: number) => number;
    }

    const {
        data,
        startDate,
        endDate,
        tooltip,
        opacity = calculateOpacity,
    }: Props = $props();

    /**
    Returns the opacity of a value in the heatmap.
    */
    function calculateOpacity(value: number) {
        return max > 0 ? value / max : 0;
    }

    const max = $derived(Math.max(...data));
    const row = $derived(getDay(startDate) + 1);
</script>

<div class="calendar">
    {#each { length: daysBetween(startDate, endDate) + 1 } as _, i (i)}
        {@const value = data[i] ?? 0}
        <div
            class="day"
            class:highlight={tooltip}
            style:--opacity={opacity(value)}
            style:grid-row-start={i ? undefined : row}
        >
            {#if tooltip}
                <div class="tooltip">
                    {@render tooltip(value, shiftDate(startDate, i))}
                </div>
            {/if}
        </div>
    {/each}
</div>

<style>
    .calendar {
        display: grid;
        gap: 0.4rem;
        grid-auto-flow: column;
        grid-template-rows: repeat(7, auto);
        width: fit-content;
    }

    .day {
        background: var(--background2);
        border-radius: 0.1rem;
        height: 1.2rem;
        position: relative;
        width: 1.2rem;
    }

    .day::before {
        background: var(--primary1);
        border-radius: 0.1rem;
        content: "";
        inset: 0rem;
        opacity: var(--opacity);
        position: absolute;
        transition: opacity 200ms;
    }

    .day.highlight::after {
        content: "";
        inset: -0.2rem;
        position: absolute;
    }

    .day.highlight:hover {
        background: var(--text1);
    }

    .day.highlight:hover::before {
        display: none;
    }

    .tooltip {
        background: var(--background2);
        border-radius: 0.3rem;
        display: none;
        font-size: 1.4rem;
        inset: auto auto 100% 50%;
        margin-bottom: 0.8rem;
        padding: 0.8rem;
        pointer-events: none;
        position: absolute;
        transform: translateX(-50%);
        white-space: nowrap;
        z-index: 1;
    }

    .day.highlight:hover .tooltip {
        display: block;
    }
</style>
