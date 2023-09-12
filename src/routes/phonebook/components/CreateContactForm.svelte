<script>
    import { PUBLIC_API_BASE_URL } from "$env/static/public";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let name = "";
    let phone = "";
    let email = "";
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

        const newContact = {
            name,
            phone,
            email,
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`, // Include the access token if required
                },
                body: JSON.stringify(newContact),
            });

            if (!response.ok) {
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
        <label for="name">Name:</label>
        <input type="text" id="name" bind:value={name} on:input={validateForm} />
      </div>
      <div>
        <label for="phone">Phone:</label>
        <input type="text" id="phone" bind:value={phone} on:input={validateForm} />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="text" id="email" bind:value={email} on:input={validateForm} />
      </div>
      <div>
        <button on:click={createContact}>Create</button>
        <button on:click={close}>Close</button>
      </div>
</form>
