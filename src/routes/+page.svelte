<script>
    import { signIn } from "@auth/sveltekit/client";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    onMount(() => {
        if ($page?.data?.session) {
            goto("/phonebook");
        }
    });
</script>

<div class="container">
    <button on:click={() => signIn("softrig", { callbackUrl: "/phonebook" })}>
        Log in
    </button>
</div>

<style>
    .container {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        height: 100vh;
        padding: 1rem; /* Add padding for spacing */
    }

    button {
        color: #fff;
        background: #2253dd;
        border: none;
        border-radius: 1.5rem;
        padding: 1rem 2rem; /* Increase padding for a larger button */
        cursor: pointer;
    }
</style>
