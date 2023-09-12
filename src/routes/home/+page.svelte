<script lang="ts">
    import { signOut } from "@auth/sveltekit/client";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { PUBLIC_API_BASE_URL } from "$env/static/public";

    let name = $page?.data?.session?.user?.name || "User";
    let accessToken = $page?.data?.session?.access_token;
    let sampleReqResponse: any = null;

    onMount(() => {
        if (!$page?.data?.session) {
            goto("/");
        }
    });

    const sendSampleRequest = () => {
        const url = `${PUBLIC_API_BASE_URL}/api/biz/customers`;

        fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                sampleReqResponse = data;
                console.log("Data: ", data);
            })
            .catch((error) => {
                console.error("Error: ", error);
            });
    };
</script>

<div>
    <div class="section">
        <p class="sub-title-text">
            Hello {name?.charAt(0).toUpperCase() + name?.slice(1)} 👋
        </p>
        <p>You are now logged in, here is your access token:</p>
        <div class="code-block full-width">
            <code>
                {JSON.stringify(accessToken)?.replaceAll('"', "")}
            </code>
        </div>
    </div>
    <div class="section">
        <p class="sub-title-text">Example usage of the API</p>
        <p>The example below shows how you can use the API.</p>
        <div class="sample-req">
            <code>GET : {PUBLIC_API_BASE_URL}/api/biz/customers</code>
            <button class="inline-btn" on:click={() => sendSampleRequest()}>
                Send
            </button>
        </div>
        {#if !!sampleReqResponse}
            <p class="sample-res-title">Response:</p>
            <div class="code-block full-width">
                <code>
                    {JSON.stringify(sampleReqResponse)}
                </code>
            </div>
        {/if}
        <div class="info-container">
            <p class="bold">Important note:</p>
            <ul>
                <li>
                    In order to authenticate successfully with the API, you must
                    pass the access token in the authorization header.
                </li>
                <li>
                    If you are using a multi-tenant client, you have to make
                    sure that you pass the CompanyKey in the header
                </li>
                <li>
                    The example above is for a single-tenant client, so you do
                    not need to pass the CompanyKey
                </li>
            </ul>
        </div>
    </div>
    <div class="section">
        <p class="sub-title-text">Log out</p>
        <p>Click the button below to log out</p>
        <button class="destructive-btn" on:click={() => signOut()}>
            Log out
        </button>
    </div>
    <div><button on:click={() => goto("/phonebook")}> Enter Phonebook </button></div>
</div>

<style>
    .bold {
        font-weight: 600;
    }

    button {
        color: #fff;
        background: #2253dd;
        border: none;
        border-radius: 1.5rem;
        padding: 0.5rem 1.2rem;
        cursor: pointer;
    }

    .destructive-btn {
        background: #c7231b;
    }

    .inline-btn {
        margin-left: 1rem;
    }

    .code-block {
        max-width: 650px;
        max-height: 280px;
        margin-bottom: 1.5rem;
        background: #fafafc;
        padding: 1rem 1.5rem;
        border-radius: 0.6rem;
        overflow: auto;
    }

    .code-block > code {
        word-break: break-all;
    }

    .full-width {
        max-width: 100%;
    }

    .sub-title-text {
        font-weight: 500;
        font-size: 1.2rem;
    }

    .info-container {
        max-width: max-content;
        background: #f3f8ff;
        padding: 0.5rem 1.5rem;
        border-radius: 0.6rem;
        margin-top: 1rem;
        overflow: auto;
        font-size: 14px;
        border: 1px solid #96b4df;
    }

    ul {
        line-height: 2rem;
    }

    .sample-req {
        margin-bottom: 1rem;
    }

    .sample-res-title {
        font-size: 13px;
        font-weight: 500;
    }
</style>
