<script lang="ts">
    import Keyboard from "./lib/Keyboard.svelte";
    import Test from "./lib/Test.svelte";
    import ThemePicker from "./lib/ThemePicker.svelte";
</script>

<div class="navbar">
    <ThemePicker />
    <a class="avatar" href="https://github.com/aalister" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/80782387" alt="GitHub">
    </a>
</div>
<div class="content">
    <Test />
    <Keyboard />
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
        max-width: 70rem;
    }
</style>
