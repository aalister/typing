<script lang="ts">
    import ProgressBar from "./ProgressBar.svelte";
    import Result from "./Result.svelte";
    import { fly } from "svelte/transition";
    import { expoOut } from "svelte/easing";
    import { getText } from "./words";
    import Button from "./Button.svelte";

    let length = $state(25);
    let letters: {
        letter: string;
        complete: boolean;
        correct: boolean;
        element: HTMLElement | undefined;
    }[] = $state([]);

    /**
    Sets the initial state of each letter in a randomly generated text.
    */
    function initLetters() {
        letters = [...getText(length)].map((letter) => ({
            letter,
            complete: false,
            correct: true,
            element: undefined,
        }));
    }

    initLetters();

    let cursor = $state(0);
    let row = $state(0);
    let wpm = $state(0);
    let accuracy = $state(0);
    let progress = $state(0);
    let resetDuration = $state(100);
    let testID = $state(0);

    let index = 0;
    let startTime = 0;
    let incorrect = 0;

    /**
    Resets the typing test.
    */
    function resetTest(animate = true) {
        resetDuration = animate ? 100 : 0;
        index = 0;
        cursor = 0;
        row = 0;
        progress = 0;
        incorrect = 0;
        testID++;
        initLetters();
    }

    /**
    Calculates the score and resets the test after a transition.
    */
    function finishTest() {
        wpm = 12000 * index / (Date.now() - startTime);
        accuracy = 100 * (index - incorrect) / index;
        row++;
        setTimeout(resetTest, 100);
    }

    /**
    Handles a keypress for the test.
    */
    function onkeypress(event: KeyboardEvent) {
        if (index >= letters.length) {
            return;
        }

        // Defocus active element to avoid unintentionally pressing buttons
        if (event.key.match(/[a-z]/)) {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        }

        if (index == 0) {
            startTime = Date.now();

            // Ignore spaces at the beginning of the test
            if (event.key === " ") {
                return;
            }
        }

        let isNewline = false;

        // Check if this is the last letter on this line using the difference in y
        // position between the current letter and the next letter
        if (index < letters.length - 1) {
            isNewline = letters[index].element!.offsetTop < letters[index + 1].element!.offsetTop;
        }

        // Check if the user pressed an incorrect key
        // Allow enter at the end of a line instead of space
        if (event.key !== letters[index].letter && (!isNewline || event.key !== "Enter")) {
            // Don't count repeated mistakes on the same letter
            if (letters[index].correct) {
                letters[index].correct = false;
                incorrect++;
            }

            return;
        }

        letters[index++].complete = true;
        progress = index / letters.length;

        // Check if the test is finished
        if (index == letters.length) {
            finishTest();
            return;
        }

        if (isNewline) {
            row++;
        }

        cursor = letters[index].element!.offsetLeft;
    }

    /**
    Handles other keyboard inputs.
    */
    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            resetTest(false);
        }
    }

    let highlight = $state(6.3);

    /**
    Resets the test with n words.
    */
    function setTestLength(n: number) {
        if (length !== n) {
            length = n;
            highlight = {
                10: 0,
                25: 6.3,
                50: 12.6,
                100: 18.9,
                250: 25.2,
            }[length]!
            resetTest(false);
        }
    }
</script>

<svelte:window {onkeypress} {onkeydown} />

<div class="container">
    <div class="toolbar">
        <div class="results">
            <Result key={[wpm, accuracy]} value={wpm} unit=" WPM" />
            <Result key={[wpm, accuracy]} value={accuracy} unit="%" />
        </div>
        <div class="length">
            <div class="length-highlight" style:transform="translateX({highlight}rem)"></div>
            {#each [10, 25, 50, 100, 250] as n (n)}
                {@const active = length === n}
                {@const style = `height: 3.6rem; width: 5.8rem; ${active ? "color: var(--background1)" : ""}`}
                <Button {style} onclick={() => {setTestLength(n)}}>{n}</Button>
            {/each}
        </div>
    </div>
    <ProgressBar fraction={progress} />
    <div class="test">
        <div class="cursor" style:transform="translateX({cursor}px)"></div>
        {#key testID}
            <div class="text" style:transform="translateY({-1.5 * row}em)" in:fly={{ duration: resetDuration, y: 60, opacity: 1, easing: expoOut }}>
                {#each letters as info, i (i)}
                    <span bind:this={info.element} class:complete={info.complete} class:incorrect={!info.correct}>
                        {info.letter}
                    </span>
                {/each}
            </div>
        {/key}
    </div>
</div>

<style>
    .container {
        background: var(--background2);
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        width: 70rem;
    }

    .toolbar {
        align-items: center;
        display: flex;
        height: 6.4rem;
        justify-content: space-between;
        padding: 1.4rem 4rem;
    }

    .results {
        display: flex;
    }

    .length {
        display: flex;
        gap: 0.5rem;
        position: relative;
    }

    .length-highlight {
        background: var(--text1);
        border-radius: 0.3rem;
        height: 100%;
        position: absolute;
        transition: transform 200ms var(--standard);
        width: 5.8rem;
    }

    .test {
        font-size: 2rem;
        height: 3em;
        line-height: 1.5em;
        margin: 4rem;
        overflow: hidden;
        position: relative;
        z-index: 0;
    }

    .cursor {
        background: var(--text2);
        height: 1.5em;
        position: absolute;
        transition: transform 100ms;
        width: 0.2rem;
        z-index: -1;
    }

    .text {
        transition: transform 100ms ease-in-out;
    }

    .complete {
        color: var(--text2);
    }

    .complete.incorrect {
        color: var(--error1);
    }
</style>
