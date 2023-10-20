// Make dropdowns clickable
(function() {
    const dropdowns = document.getElementsByClassName("dropdown");

    document.addEventListener("click", function(event) {
        // Don't close dropdowns when clicking inside the menu, unless the user
        // clicked a dropdown close button.
        if (event.target.closest(".dropdown-menu")) {
            if (!event.target.closest(".dropdown-close")) {
                return;
            }
        }

        for (const dropdown of dropdowns) {
            const isClicked = dropdown.contains(event.target);
            dropdown.classList.toggle("active", isClicked ? undefined : false);
        }
    });
})();

// Theme selection buttons
(function() {
    const buttons = document.getElementsByClassName("theme-button");
    const theme = localStorage.getItem("theme");

    // Set the active theme button based on the saved theme preference
    for (const button of buttons) {
        if ((button.dataset.theme || null) === theme) {
            button.classList.add("active");
            break;
        }
    }

    const query = matchMedia("(prefers-color-scheme:dark)");

    for (const button of buttons) {
        const theme = button.dataset.theme;

        button.addEventListener("click", function() {
            for (const other of buttons) {
                other.classList.toggle("active", other === button);
            }

            if (!theme) {
                // Revert to the system theme
                document.documentElement.classList.toggle("dark", query.matches);
                localStorage.removeItem("theme");

                return;
            }

            document.documentElement.classList.toggle("dark", theme === "dark");
            localStorage.setItem("theme", theme);
        });
    }
})();

// Make the keyboard respond to user input
(function() {
    const keys = {};

    for (const key of document.querySelectorAll(".keyboard-key[data-key]")) {
        keys[key.dataset.key] = key;
    }

    window.addEventListener("keydown", function(event) {
        const key = keys[event.code];

        if (key) {
            key.classList.add("active");
        }
    });

    window.addEventListener("keyup", function(event) {
        const key = keys[event.code];

        if (key) {
            key.classList.remove("active");
        }
    });

    // Remove pressed key highlights when the user focuses away from the window
    // to prevent stuck highlighted keys
    window.addEventListener("blur", function() {
        for (const key in keys) {
            keys[key].classList.remove("active");
        }
    });
})();

/** Generates cumulative distribution function for the Zipf distrubtion on n elements. */
function zipf(n) {
    const h = [1];

    for (let k = 2; k <= n; k++) {
        h.push(1 / k + h[k - 2]);
    }

    const hn = h[h.length - 1];
    const cdf = [];

    for (const hk of h) {
        cdf.push(hk / hn);
    }

    return cdf;
}

/** Waits for an element's animation to end. */
function animationEnd(element) {
    return new Promise(function(resolve) {
        element.addEventListener("animationend", resolve, {once: true});
    });
}

(async function() {
    const response = await fetch("/words.txt");
    const contents = await response.text();
    const words = contents.trim().split("\n");
    const distribution = zipf(words.length);

    /** Gets a random word from the word list. */
    function getWord() {
        const x = Math.random();

        for (let i = 0; i < words.length; i++) {
            if (distribution[i] >= x) {
                return words[i].trim();
            }
        }
    }

    /** Gets randomly generated text. */
    function getText(length) {
        const text = [];

        while (text.length < length) {
            const word = getWord();

            // Avoid consecutive repeated words
            if (word !== text[text.length - 1]) {
                text.push(word);
            }
        }

        return text.join(" ");
    }

    const textElement = document.getElementById("test-text");
    let letters = [];

    /** Sets the letters in the test and displays them. */
    function setLetters(text) {
        textElement.innerHTML = "";
        letters = [];

        for (const letter of text) {
            const span = document.createElement("span");
            span.innerText = letter;
            textElement.appendChild(span);
            letters.push(span);
        }
    }

    const progressBar = document.getElementById("test-progress-bar");
    const cursor = document.getElementById("test-cursor");

    /** Moves the progress bar. */
    function setProgressBar(fraction) {
        progressBar.style.transform = "translateX(" + 100 * fraction + "%)";
    }

    /** Moves the cursor horizontally over the text. */
    function moveCursor(x) {
        cursor.style.transform = "translateX(" + x + "px)";
    }

    let text = "";
    let testLength = 25;
    let index = 0;
    let incorrect = 0;
    let lastIncorrect = false;
    let startTime = 0;

    /** Sets up the typing test. */
    function setupTest() {
        setProgressBar(0);
        moveCursor(0);
        text = getText(testLength);
        index = 0;
        incorrect = 0;
        lastIncorrect = false;
        setLetters(text);
    }

    // Test length selection buttons
    (function () {
        const highlight = document.getElementById("test-length-highlight");
        const buttons = document.getElementsByClassName("test-length-button");

        for (const button of buttons) {
            button.addEventListener("click", function() {
                if (button.dataset.testLength === testLength) {
                    return;
                }

                for (const other of buttons) {
                    other.classList.toggle("active", other === button);
                }

                highlight.style.transform = "translateX(" + button.offsetLeft + "px)";
                testLength = button.dataset.testLength;
                setupTest();
            });
        }
    })();

    /** Hides the first line of text by sliding it up. */
    async function slideTextOff() {
        textElement.classList.add("slide-off");
        await animationEnd(textElement);
        textElement.classList.remove("slide-off");
    }

    /** Reveals the text by sliding it up. */
    async function slideTextOn() {
        textElement.classList.add("slide-on");
        await animationEnd(textElement);
        textElement.classList.remove("slide-on");
    }

    /** Hides completed letters */
    async function hideCompleteLetters() {
        const letters = document.querySelectorAll(".test-text .complete");
        await slideTextOff();

        for (const letter of letters) {
            letter.remove();
        }
    }

    const wpmElement = document.getElementById("test-wpm");
    const accElement = document.getElementById("test-accuracy");

    /** Animates updating a result. */
    async function displayResult(element, result) {
        element.classList.add("slide-off");

        await animationEnd(element);
        element.innerText = result.toFixed(1);
        element.classList.remove("slide-off");
        element.classList.add("slide-on");

        await animationEnd(element);
        element.classList.remove("slide-on");
    }

    /** Displays the words per minute. */
    async function setWPM(characters, start, finish) {
        const wpm = 12000 * characters / (finish - start);
        displayResult(wpmElement, wpm);
    }

    /** Displays the accuracy. */
    async function setAccuracy(total, incorrect) {
        const accuracy = 100 * (total - incorrect) / total;
        displayResult(accElement, accuracy);
    }

    /** Displays the results and resets the test. */
    async function finishTest() {
        setWPM(index, startTime, Date.now());
        setAccuracy(index, incorrect);
        await slideTextOff();
        setupTest();
        await slideTextOn();
    }

    setupTest(testLength);

    window.addEventListener("keypress", function(event) {
        if (index >= text.length) {
            return;
        }

        if (index === 0) {
            startTime = Date.now();

            // Ignore spaces at the beginning of the test
            if (event.key === " ") {
                return;
            }
        }

        let isNewline = false;

        if (index < text.length - 1) {
            isNewline = letters[index].offsetTop < letters[index + 1].offsetTop;
        }

        // Check if the user pressed an incorrect key
        // Allow enter at the end of a line instead of space
        if (event.key !== text[index] && (!isNewline || event.key !== "Enter")) {
            // Don't count repeated mistakes
            if (!lastIncorrect) {
                incorrect++
            }

            lastIncorrect = true;
            letters[index].classList.add("incorrect");

            return;
        }

        lastIncorrect = false;
        letters[index].classList.add("complete");
        index++;

        // Check if the test is finished
        if (index === text.length) {
            setProgressBar(1);
            finishTest();

            return;
        }

        if (isNewline) {
            hideCompleteLetters();
        }

        moveCursor(letters[index].offsetLeft);
        setProgressBar(index / text.length);
    });

    window.addEventListener("keydown", function(event) {
        // Reset the test if the user presses escape
        if (event.key === "Escape") {
            setupTest();
        }
    });
})();
