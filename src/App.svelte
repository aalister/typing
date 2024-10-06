<script lang="ts">
    import Keyboard from "./lib/Keyboard.svelte";
    import Test from "./lib/Test.svelte";
    import ThemePicker from "./lib/ThemePicker.svelte";
</script>

<div class="navbar">
    <ThemePicker/>
</div>
<div class="content">
    <Test/>
    <Keyboard/>
</div>

<style>
    .navbar {
        padding: 2rem;
        display: flex;
        justify-content: end;
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
