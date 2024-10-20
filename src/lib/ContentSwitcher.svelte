<script lang="ts">
    import Button from "./Button.svelte";

    interface Props {
        /**
        The items the content switcher.
        */
        items: { id: any, label: string }[];

        /**
        The ID of the selected item.
        */
        selectedId?: any;

        /**
        Called when the selected item changes.
        */
        onchange?: (id: any) => void;
    };

    let { items, selectedId = $bindable(items[0].id), onchange }: Props = $props();

    /**
    Sets the selected id when the user presses a button.
    */
    function select(id: any) {
        if (selectedId !== id) {
            selectedId = id;
            onchange?.(id);
        }
    }

    const selected = $derived(items.findIndex((item) => item.id === selectedId));
    const position = $derived(`${100 * selected}% + ${0.5 * selected}rem`);
</script>

<div class="items">
    {#each items as { id, label }}
        <div class="item">
            <Button onclick={() => {select(id)}} aria-selected={id === selectedId}>
                {label}
            </Button>
        </div>
    {/each}
    <div class="overlay" aria-hidden="true">
        <div class="slider" style:transform="translateX(calc({position}))">
            <div class="counterbalance" style:transform="translateX(calc(-1 * ({position})))">
                <div class="items">
                    {#each items as { label }}
                        <div class="active">
                            {label}
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .items {
        column-gap: 0.5rem;
        display: grid;
        grid-auto-columns: 1fr;
        grid-auto-flow: column;
        height: 3.6rem;
    }

    .item {
        display: flex;
        flex-direction: column;
        grid-row-start: 1;
        height: 3.6rem;
    }

    .overlay {
        grid-column-start: 1;
        grid-row-start: 2;
        pointer-events: none;
        position: relative;
        transform: translateY(-3.6rem);
    }

    .slider {
        background: var(--text1);
        border-radius: 0.3rem;
        height: 3.6rem;
        overflow: hidden;
        position: absolute;
        transition: transform 200ms var(--standard);
        width: 100%;
    }

    .counterbalance {
        width: 100%;
        transition: transform 200ms var(--standard);
    }

    .slider .items {
        width: max-content;
    }

    .active {
        align-items: center;
        color: var(--background1);
        display: flex;
        justify-content: center;
        padding: 0 1.4rem;
    }
</style>
