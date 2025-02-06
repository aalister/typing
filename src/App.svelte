<script lang="ts">
    import { fly } from "svelte/transition";
    import Button from "./lib/Button.svelte";
    import Keyboard from "./lib/Keyboard.svelte";
    import Statistics from "./lib/Statistics.svelte";
    import Test from "./lib/Test.svelte";
    import ThemePicker from "./lib/ThemePicker.svelte";
    import { cubicIn, cubicOut } from "svelte/easing";

    let open = $state(false);

    const duration = 100;
    const flyOut = $derived({ duration, easing: cubicIn, opacity: 1, y: open ? -48 : 48 });
    const flyIn = $derived({ duration, delay: duration, easing: cubicOut, opacity: 1, y: open ? 48 : -48 });
</script>

<div class="navbar">
    <ThemePicker />
    <a class="avatar" href="https://github.com/aalister" target="_blank" rel="noreferrer">
        <img src="https://avatars.githubusercontent.com/u/80782387" alt="GitHub">
    </a>
</div>
<div class="content">
    <Test />
    <Keyboard />
</div>
<div class="actions">
    <Button kind="primary" onclick={() => {open = !open}} style="width:14.4rem">
        {#if open}
            <div class="label" in:fly={flyIn} out:fly={flyOut}>
                Hide Statistics
            </div>
        {:else}
            <div class="label" in:fly={flyIn} out:fly={flyOut}>
                Show Statistics
            </div>
        {/if}
    </Button>
</div>
<div class="statistics" class:open>
    <Statistics />
</div>

<style>
    .navbar {
        align-items: center;
        display: flex;
        gap: 1.6rem;
        justify-content: end;
        padding: 2rem;
        width: 100%;
    }

    .avatar {
        border-radius: 50%;
        display: flex;
        height: 4rem;
        overflow: hidden;
        width: 4rem;
    }

    .avatar:focus-visible {
        outline-offset: 0.3rem;
        outline: 0.2rem solid var(--primary1);
    }

    .content {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin: 2rem auto;
    }

    .statistics {
        left: 50%;
        position: absolute;
        transform: translate(-50%, calc(100vh - 57.4rem));
        transition: transform 200ms var(--emphasised-accelerate), visibility 200ms; /* Exit transition */
        visibility: hidden;
    }

    .statistics.open {
        transform: translateX(-50%);
        transition: transform 300ms var(--emphasised-decelerate); /* Enter transition */
        visibility: visible;
    }

    .actions {
        align-items: center;
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        inset: auto 0 2rem 0;
        justify-content: center;
        padding: 0.8rem;
        position: absolute;
        z-index: 1;
    }

    .label {
        position: absolute;
    }
</style>
