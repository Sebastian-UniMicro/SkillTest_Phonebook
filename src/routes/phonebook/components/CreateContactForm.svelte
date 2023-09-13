<script>
    import { PUBLIC_API_BASE_URL } from "$env/static/public";
    import { createEventDispatcher } from "svelte";

    export let accessToken;
    const dispatch = createEventDispatcher();

    let name = "";
    let phone = "";
    let email = "";
    let comment = "";
    let isFormValid = true;

    const close = () => {
        event.preventDefault();
        dispatch("close");
    };

    const createContact = async () => {
        if (!isFormValid) {
            return; //Not Valid. Prevent submission
        }
        const url = `${PUBLIC_API_BASE_URL}/api/biz/contacts`;

        const contactData = {
  "Info": {
    "Name": name,
    "InvoiceAddress": {
        "AddressLine1": "",
        "AddressLine2": "",
        "AddressLine3": "",
        "City": "",
        "Country": "",
        "CountryCode": "",
        "PostalCode": ""
      },
    "DefaultPhone": {
        "CountryCode": "",
        "Description": "",
        "Number": phone
      },
    "DefaultEmail": {
        "EmailAddress": email
      }
  },
  "Comment": comment
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
                const errorResponse = await response.json(); // Parse the response body
                console.error("API error:", errorResponse); // Log the error response
                throw new Error("Failed to create contact");
            }

            // Handle success, e.g., close the modal, update the contact list, etc.
            dispatch("close");
        } catch (error) {
            // Handle error, e.g., display an error message to the user
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

<form>
    <div>
        <label for="name">Name *</label>
        <input
            type="text"
            id="name"
            bind:value={name}
            on:input={validateForm}
        />
    </div>
    <div>
        <label for="phone">Phone *</label>
        <input
            type="text"
            id="phone"
            bind:value={phone}
            on:input={validateForm}
        />
    </div>
    <div>
        <label for="email">Email *</label>
        <input
            type="text"
            id="email"
            bind:value={email}
            on:input={validateForm}
        />
    </div>
    <div>
        <label for="comment">Comment</label>
        <textarea
            id="comment"
            bind:value={comment}
        />
    </div>
    <div>
        <button on:click={createContact}>Create</button>
        <button class="modal-close" on:click={close}>Close</button>
    </div>
</form>

<style>
    .modal-close {
        margin-top: 10px;
    }

    textarea {
		width: 100%;
		height: 200px;
	}
</style>
