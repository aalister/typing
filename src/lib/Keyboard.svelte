<script lang="ts">
    import { SvelteSet } from "svelte/reactivity";

    let pressed = new SvelteSet<string>();
</script>

<svelte:window
    onkeydown={(event) => pressed.add(event.code)}
    onkeyup={(event) => pressed.delete(event.code)}
    onblur={() => pressed.clear()}
/>

<div class="keyboard">
    <div class="row">
        <div class="key width-4" class:active={pressed.has("Backquote")}></div>
        <div class="key width-4" class:active={pressed.has("Digit1")}></div>
        <div class="key width-4" class:active={pressed.has("Digit2")}></div>
        <div class="key width-4" class:active={pressed.has("Digit3")}></div>
        <div class="key width-4" class:active={pressed.has("Digit4")}></div>
        <div class="key width-4" class:active={pressed.has("Digit5")}></div>
        <div class="key width-4" class:active={pressed.has("Digit6")}></div>
        <div class="key width-4" class:active={pressed.has("Digit7")}></div>
        <div class="key width-4" class:active={pressed.has("Digit8")}></div>
        <div class="key width-4" class:active={pressed.has("Digit9")}></div>
        <div class="key width-4" class:active={pressed.has("Digit0")}></div>
        <div class="key width-4" class:active={pressed.has("Minus")}></div>
        <div class="key width-4" class:active={pressed.has("Equal")}></div>
        <div class="key width-8" class:active={pressed.has("Backspace")}></div>
    </div>
    <div class="row">
        <div class="key width-6" class:active={pressed.has("Tab")}></div>
        <div class="key width-4" class:active={pressed.has("KeyQ")}>Q</div>
        <div class="key width-4" class:active={pressed.has("KeyW")}>W</div>
        <div class="key width-4" class:active={pressed.has("KeyE")}>E</div>
        <div class="key width-4" class:active={pressed.has("KeyR")}>R</div>
        <div class="key width-4" class:active={pressed.has("KeyT")}>T</div>
        <div class="key width-4" class:active={pressed.has("KeyY")}>Y</div>
        <div class="key width-4" class:active={pressed.has("KeyU")}>U</div>
        <div class="key width-4" class:active={pressed.has("KeyI")}>I</div>
        <div class="key width-4" class:active={pressed.has("KeyO")}>O</div>
        <div class="key width-4" class:active={pressed.has("KeyP")}>P</div>
        <div class="key width-4" class:active={pressed.has("BracketLeft")}></div>
        <div class="key width-4" class:active={pressed.has("BracketRight")}></div>
        <div class="key width-6 enter" class:active={pressed.has("Enter")}></div>
    </div>
    <div class="row">
        <div class="key width-7" class:active={pressed.has("CapsLock")}></div>
        <div class="key width-4" class:active={pressed.has("KeyA")}>A</div>
        <div class="key width-4" class:active={pressed.has("KeyS")}>S</div>
        <div class="key width-4" class:active={pressed.has("KeyD")}>D</div>
        <div class="key width-4" class:active={pressed.has("KeyF")}>F</div>
        <div class="key width-4" class:active={pressed.has("KeyG")}>G</div>
        <div class="key width-4" class:active={pressed.has("KeyH")}>H</div>
        <div class="key width-4" class:active={pressed.has("KeyJ")}>J</div>
        <div class="key width-4" class:active={pressed.has("KeyK")}>K</div>
        <div class="key width-4" class:active={pressed.has("KeyL")}>L</div>
        <div class="key width-4" class:active={pressed.has("Semicolon")}></div>
        <div class="key width-4" class:active={pressed.has("Quote")}></div>
        <div class="key width-4" class:active={pressed.has("Backslash")}></div>
    </div>
    <div class="row">
        <div class="key width-5" class:active={pressed.has("ShiftLeft")}></div>
        <div class="key width-4" class:active={pressed.has("IntlBackslash")}></div>
        <div class="key width-4" class:active={pressed.has("KeyZ")}>Z</div>
        <div class="key width-4" class:active={pressed.has("KeyX")}>X</div>
        <div class="key width-4" class:active={pressed.has("KeyC")}>C</div>
        <div class="key width-4" class:active={pressed.has("KeyV")}>V</div>
        <div class="key width-4" class:active={pressed.has("KeyB")}>B</div>
        <div class="key width-4" class:active={pressed.has("KeyN")}>N</div>
        <div class="key width-4" class:active={pressed.has("KeyM")}>M</div>
        <div class="key width-4" class:active={pressed.has("Comma")}></div>
        <div class="key width-4" class:active={pressed.has("Period")}></div>
        <div class="key width-4" class:active={pressed.has("Slash")}></div>
        <div class="key width-11" class:active={pressed.has("ShiftRight")}></div>
    </div>
    <div class="row">
        <div class="key width-6" class:active={pressed.has("ControlLeft")}></div>
        <div class="key width-4" class:active={pressed.has("MetaLeft")}></div>
        <div class="key width-6" class:active={pressed.has("AltLeft")}></div>
        <div class="key width-24" class:active={pressed.has("Space")}></div>
        <div class="key width-6" class:active={pressed.has("AltRight")}></div>
        <div class="key width-4"></div>
        <div class="key width-4" class:active={pressed.has("ContextMenu")}></div>
        <div class="key width-6" class:active={pressed.has("ControlRight")}></div>
    </div>
</div>

<style>
    .keyboard {
        background: var(--background2);
        border-radius: 0.5rem;
        color: var(--text2);
        padding: 1rem;
        -webkit-user-select: none;
        user-select: none;
        width: 62rem;
    }

    .row {
        display: flex;
    }

    .key {
        align-items: center;
        background: var(--background1);
        border-radius: 0.2rem;
        display: flex;
        height: 3.6rem;
        justify-content: center;
        margin: 0.2rem;
    }

    .width-4 {
        width: 3.6rem;
    }

    .width-5 {
        width: 4.6rem;
    }

    .width-6 {
        width: 5.6rem;
    }

    .width-7 {
        width: 6.6rem;
    }

    .width-8 {
        width: 7.6rem;
    }

    .width-11 {
        width: 10.6rem;
    }

    .width-24 {
        width: 23.6rem;
    }

    .enter {
        position: relative;
    }

    .enter::before {
        background: var(--background1);
        border-radius: 0.2rem;
        content: "";
        inset: 0 0 -4rem 1rem;
        position: absolute;
    }

    .enter::after {
        border-top-right-radius: 0.2rem;
        box-shadow: 0 -0.2rem 0 0 var(--background1);
        content: "";
        inset: 100% 4.6rem -0.4rem 0.6rem;
        position: absolute;
    }

    .key.active {
        background: var(--text1);
        color: var(--background1);
    }

    .enter.active::before {
        background: var(--text1);
    }

    .enter.active::after {
        box-shadow: 0 -0.2rem 0 0 var(--text1);
    }
</style>
