<script>
    import { signIn } from "@auth/sveltekit/client";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    onMount(() => {
        if ($page?.data?.session) {
            goto("/home");
        }
    });
</script>

<div>
    <p class="steps-title">Follow these simple steps to get started:</p>
    <div class="section">
        <span>Step 1:</span>
        <p>
            Head over to <a
                href="https://developer.softrig.com"
                target="_blank"
                rel="noreferrer">https://developer.softrig.com</a
            > and create an application with a SPA client
        </p>
    </div>
    <div class="section">
        <span>Step 2:</span>
        <p>
            Create a copy of the <span class="bold">.env.example</span> file,
            rename it to <span class="bold">.env</span> and fill in the values
        </p>
        <div class="code-block">
            <code>
                {`IDENTITY_SERVER_BASE_URL="<VALUE>"`}
                <br />{`IDENTITY_SERVER_SCOPES="<VALUE>"`}
                <br />{`SECRET_CLIENT_ID="<VALUE>"`}
                <br />{`SECRET_CLIENT_SECRET="<VALUE>"`}
            </code>
        </div>
    </div>
    <div class="section">
        <span>Step 3:</span>
        <p>Click the log in button below after completing the steps above :)</p>
        <button on:click={() => signIn("softrig", { callbackUrl: "/home" })}>
            Log in
        </button>
    </div>
    <img src="/artwork.png" class="artwork" alt="logo" />
</div>

<style>
    .bold {
        font-weight: 600;
    }

    .steps-title {
        margin-bottom: 1.5rem;
    }

    .section {
        margin-bottom: 2.5rem;
    }

    .section > span {
        font-weight: 600;
    }

    a {
        color: #2253dd;
    }

    button {
        color: #fff;
        background: #2253dd;
        border: none;
        border-radius: 1.5rem;
        padding: 0.5rem 1.2rem;
        cursor: pointer;
    }

    .code-block {
        max-width: 400px;
        background: #fafafc;
        padding: 1rem 1.5rem;
        border-radius: 0.6rem;
        overflow: auto;
    }

    .code-block > code {
        white-space: pre;
    }

    .artwork {
        position: absolute;
        width: 400px;
        bottom: 30px;
        right: 15%;
    }

    @media (max-width: 1200px) {
        .artwork {
            display: none;
        }
    }
</style>
