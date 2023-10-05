<script>
    import { PUBLIC_API_BASE_URL } from "$env/static/public";
    import { createEventDispatcher } from "svelte";

    export let accessToken;
    const dispatch = createEventDispatcher();

    let name = "";
    let phone = "";
    let email = "";
    let comment = "";
    let isFormValid = false;
    let checkedFormValidation = false;

    const close = () => {
        event.preventDefault();
        dispatch("close");
    };

    const createContact = async () => {
        if (!isFormValid) {
            console.log("You are missing Name: " + name + " or Phone: " + phone + " or Email is:" + isValidEmail(email));
            checkedFormValidation = true;
            return; //Not Valid. Prevent submission
        }
        const url = `${PUBLIC_API_BASE_URL}/api/biz/contacts`;

        const contactData = {
            Info: {
                Name: name,
                InvoiceAddress: {
                    AddressLine1: "",
                    AddressLine2: "",
                    AddressLine3: "",
                    City: "",
                    Country: "",
                    CountryCode: "",
                    PostalCode: "",
                },
                DefaultPhone: {
                    CountryCode: "",
                    Description: "",
                    Number: phone,
                },
                DefaultEmail: {
                    EmailAddress: email,
                },
            },
            Comment: comment,
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(contactData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("API error:", errorResponse);
                throw new Error("Failed to create contact");
            }
            dispatch("close");
        } catch (error) {
            console.error(error);
        }
    };

    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    }

    function validateForm() {
        isFormValid = !!name && !!phone && isValidEmail(email);
    }
</script>

<form class="custom-form">
    <div class="form-group">
        <label for="name">Name *</label>
        <input
            type="text"
            id="name"
            bind:value={name}
            on:input={validateForm}
        />
        {#if !name && checkedFormValidation}
        <span class="validation_fail_text">
        Name is Required
        </span>
        {/if}
    </div>
    <div class="form-group">
        <label for="phone">Phone *</label>
        <input
            type="text"
            id="phone"
            bind:value={phone}
            on:input={validateForm}
        />
        {#if !phone && checkedFormValidation}
        <span class="validation_fail_text">
        Phone Number is Required
        </span>
        {/if}
    </div>
    <div class="form-group">
        <label for="email">Email *</label>
        <input
            type="text"
            id="email"
            bind:value={email}
            on:input={validateForm}
        />
        {#if !email && checkedFormValidation}
        <span class="validation_fail_text">
        Email is Required
        </span>
        {:else if !isValidEmail(email) && checkedFormValidation}
        <span class="validation_fail_text">
            Must be a valid email
            </span>
        {/if}
    </div>
    <div class="form-group">
        <label for="comment">Comment</label>
        <textarea id="comment" bind:value={comment} />
    </div>
    <div>
        <button on:click={createContact}>Create</button>
        <button class="modal-close" on:click={close}>Close</button>
    </div>
</form>

<style>
    button {
        color: #fff;
        background: #2253dd;
        border: none;
        border-radius: 1.5rem;
        padding: 0.5rem 1.2rem;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }

    .modal-close {
        margin-top: 10px;
        background: #c7231b;
    }

    .modal-close:hover {
        background: #9b1b15;
    }

    textarea {
        width: 100%;
        height: 200px;
    }

    .custom-form {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f9f9f9;
    }

    .form-group {
        margin-bottom: 15px;
    }

    label {
        display: block;
        font-weight: bold;
    }

    input[type="text"],
    input[type="email"],
    textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
    }

    .form-actions {
        text-align: right;
    }

    .validation_fail_text {
        color: #FF0000;
    }
</style>
