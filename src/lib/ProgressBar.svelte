<script lang="ts">
    interface Props {
        fraction: number;
    };

    let { fraction }: Props = $props();
</script>

<div class="progress">
    <div class="slider" style:transform="translateX({100 * fraction}%)"></div>
</div>

<style>
    .progress {
        background: var(--background1);
        height: 0.2rem;
        overflow: hidden;
        position: relative;
    }

    .slider {
        background: var(--primary1);
        inset: 0 100% 0 -100%;
        position: absolute;
        transition: transform 200ms var(--standard);
    }
</style>
