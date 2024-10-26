<script lang="ts">
    import { expoOut } from "svelte/easing";
    import { fly } from "svelte/transition";
    import ContentSwitcher from "./ContentSwitcher.svelte";
    import ProgressBar from "./ProgressBar.svelte";
    import Result from "./Result.svelte";
    import { getText } from "./words";

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

    let index = $state(0);
    let row = $state(0);
    let wpm = $state(0);
    let accuracy = $state(0);
    let resetDuration = $state(0);
    let testID = $state(0);

    let startTime = 0;
    let incorrect = 0;

    /**
    Resets the typing test.
    */
    function resetTest(animate = true) {
        index = 0;
        row = 0;
        resetDuration = animate ? 100 : 0;
        testID++;
        incorrect = 0;
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

        // Check if the test is finished
        if (index == letters.length) {
            finishTest();
            return;
        }

        if (isNewline) {
            row++;
        }
    }

    /**
    Handles other keyboard inputs.
    */
    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            resetTest(false);
        }
    }

    /**
    Sets the length of the test to n words.
    */
    function setTestLength(n: number) {
        length = n;
        resetTest(false);
    }

    const cursorPosition = $derived(letters[index]?.element?.offsetLeft ?? 0);
    const progress = $derived(index / letters.length);
    const transtiion = $derived({ duration: resetDuration, y: 60, opacity: 1, easing: expoOut });
</script>

<svelte:window {onkeypress} {onkeydown} />

<div class="container">
    <div class="toolbar">
        <div class="results">
            <Result key={[wpm, accuracy]} value={wpm} unit=" WPM" />
            <Result key={[wpm, accuracy]} value={accuracy} unit="%" />
        </div>
        <ContentSwitcher
            items={[
                { id: 10, label: "10" },
                { id: 25, label: "25" },
                { id: 50, label: "50" },
                { id: 100, label: "100" },
                { id: 250, label: "250" },
            ]}
            onchange={setTestLength}
            selectedId={25}
        />
    </div>
    <ProgressBar fraction={progress} />
    <div class="test">
        <div class="cursor" style:transform="translateX({cursorPosition}px)"></div>
        {#key testID}
            <div class="text" style:transform="translateY({-1.5 * row}em)" in:fly={transtiion}>
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
        -webkit-user-select: none;
        user-select: none;
    }

    .complete {
        color: var(--text2);
    }

    .complete.incorrect {
        color: var(--error1);
    }
</style>
