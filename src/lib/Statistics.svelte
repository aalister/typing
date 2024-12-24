<script lang="ts">
    import CalendarHeatmap from "./CalendarHeatmap.svelte";
    import ContentSwitcher from "./ContentSwitcher.svelte";
    import { daysBetween, shiftDate, today, weekStart } from "./date";
    import Result from "./Result.svelte";
    import { cache, getScores, type Score } from "./scores.svelte";

    const endDate = today();
    const startDate = weekStart(shiftDate(endDate, -364));

    let dbScores: Score[] = $state([]);

    $effect(() => {
        getScores(startDate, endDate).then((scores) => {
            dbScores = scores;
        });
    });

    const scores = $derived.by(() => {
        let scores = [...cache.scores, ...dbScores];

        // Remove stale data overwritten by cache
        return scores.filter((score, index, scores) => {
            return index === scores.map((other) => other.date.getTime()).indexOf(score.date.getTime());
        });
    });

    const data = $derived.by(() => {
        let data = new Array(daysBetween(startDate, endDate) + 1).fill(0);

        for (const score of scores) {
            data[daysBetween(startDate, score.date)] = score.wpm;
        }

        return data;
    });

    const min = $derived(Math.min(...scores.map((score) => score.wpm)));
    const max = $derived(Math.max(...scores.map((score) => score.wpm)));

    /**
    Calculates the opacity for a value in the heatmap.
    */
    function opacity(value: number) {
        if (value === 0) {
            return 0;
        }

        if (min === max) {
            return 1;
        }

        return 0.3 + (0.7 * (value - min)) / (max - min);
    }

    let timeRange = $state("all time");

    const aggregateScores = $derived(timeRange === "all time"
        ? scores
        : scores.filter((score) => score.date.getTime() === today().getTime())
    );

    const count = $derived(
        aggregateScores.reduce((sum, score) => sum + score.count, 0),
    );

    const fastest = $derived(
        Math.max(...aggregateScores.map((score) => score.fastest), 0),
    );

    const average = $derived(
        aggregateScores.reduce((sum, score) => sum + score.count * score.wpm, 0) / count,
    );

    const accuracy = $derived(
        aggregateScores.reduce((sum, score) => sum + score.count * score.accuracy, 0) / count,
    );
</script>

<div class="container">
    <div class="toolbar">
        <div class="statistics">
            <div class="statistic">
                <div class="label">Average:</div>
                <Result
                    key={[timeRange, average.toFixed(1)]}
                    value={isNaN(average) ? 0 : average}
                    unit=" WPM"
                    style="text-align:left"
                />
            </div>
            <div class="statistic">
                <div class="label">Fastest:</div>
                <Result
                    key={[timeRange, fastest.toFixed(1)]}
                    value={fastest}
                    unit=" WPM"
                    style="text-align:left"
                />
            </div>
            <div class="statistic">
                <div class="label">Accuracy:</div>
                <Result
                    key={[timeRange, accuracy.toFixed(1)]}
                    value={isNaN(accuracy) ? 0 : accuracy}
                    unit="%"
                    style="text-align:left"
                />
            </div>
        </div>
        <ContentSwitcher
            items={[
                { id: "today", label: "Today" },
                { id: "all time", label: "All time" },
            ]}
            bind:selectedId={timeRange}
        />
    </div>
    <CalendarHeatmap {startDate} {endDate} {data} {opacity}>
        {#snippet tooltip(value, date)}
            Average {value.toFixed(1)} WPM on {new Date(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
            ).toLocaleDateString("en-gb", {
                weekday: "short",
                day: "numeric",
                month: "short",
            })}
        {/snippet}
    </CalendarHeatmap>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 1.4rem;
    }

    .toolbar {
        align-items: center;
        display: flex;
        justify-content: space-between;
    }

    .statistics {
        display: flex;
        gap: 2.4rem;
    }

    .statistic {
        display: flex;
        gap: 0.6rem;
    }

    .label {
        color: var(--text2);
        line-height: 1;
        -webkit-user-select: none;
        user-select: none;
    }
</style>
