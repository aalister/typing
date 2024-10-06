import wordList from "./words.txt?raw";

const words = wordList.trim().split("\n");

/**
Generates a cumulative distribution function for the Zipf distrubtion on n
elements.
*/
function zipf(n: number): number[] {
    const h = [1];

    for (let k = 2; k <= n; k++) {
        h.push(1 / k + h[k - 2]);
    }

    const hn = h[h.length - 1];
    const cdf: number[] = [];

    for (const hk of h) {
        cdf.push(hk / hn);
    }

    return cdf;
}

const distribution = zipf(words.length);

/**
Gets a random word from the word list.
*/
function getWord(): string {
    const x = Math.random();

    for (let i = 0; i < words.length; i++) {
        if (distribution[i] >= x) {
            return words[i].trim();
        }
    }

    return words[words.length - 1];
}

/**
Gets a randomly generated text with n words.
*/
export function getText(n: number): string {
    const text: string[] = [];

    while (text.length < n) {
        const word = getWord();

        // Avoid consecutive repeated words
        if (word !== text[text.length - 1]) {
            text.push(word);
        }
    }

    return text.join(" ");
}
