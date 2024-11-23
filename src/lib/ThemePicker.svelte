<script lang="ts">
    import Button from "./Button.svelte";

    const query = matchMedia("(prefers-color-scheme:dark)");
    const themes = [
        {
            label: "System",
            value: null,
        },
        {
            label: "Light",
            value: "light",
        },
        {
            label: "Dark",
            value: "dark",
        },
    ];

    let theme = $state(localStorage.getItem("typing-theme"));
    let active = $state(false);

    /**
    Sets the theme when the user presses a button.
    */
    function setTheme(value: string | null) {
        theme = value;
        active = false;

        if (!theme) {
            document.documentElement.classList.toggle("dark", query.matches);
            localStorage.removeItem("typing-theme");

            return;
        }

        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("typing-theme", theme);
    }
</script>

<svelte:window onclick={() => {active = false}} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="dropdown" class:active onclick={(e) => {e.stopPropagation()}}>
    <Button aria-label="Theme" onclick={() => {active = !active}}>
        <div class="icon"></div>
    </Button>
    <div class="menu">
        {#each themes as { label, value }}
            <Button onclick={() => {setTheme(value)}}>
                <div class="label" class:active={theme === value}>
                    {label}
                </div>
            </Button>
        {/each}
    </div>
</div>

<style>
    .dropdown {
        position: relative;
    }

    .icon {
        border-radius: 50%;
        box-shadow: inset 0 0 0 0.2rem var(--text1);
        height: 2rem;
        overflow: hidden;
        position: relative;
        width: 2rem;
    }

    .icon::before,
    .icon::after {
        background: var(--text1);
        content: "";
        position: absolute;
        transition: transform 200ms var(--standard);
    }

    .icon::before {
        inset: 0 50% 0 0;
    }

    .icon::after {
        inset: 0 -100% 0 150%;
    }

    .dropdown.active .icon::before,
    .dropdown.active .icon::after {
        transform: translateX(-200%);
    }

    .menu {
        background: var(--background2);
        border-radius: 0.5rem;
        display: none;
        flex-direction: column;
        gap: 0.4rem;
        margin-top: 0.8rem;
        padding: 0.8rem;
        position: absolute;
        right: 0;
        width: 15rem;
        z-index: 1;
    }

    .dropdown.active .menu {
        display: flex;
    }

    .label.active {
        color: var(--background1);
    }

    .label::before {
        background: var(--text1);
        content: "";
        display: none;
        inset: 0;
        position: absolute;
        z-index: -1;
    }

    .label.active::before {
        display: block;
    }
</style>
