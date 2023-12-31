<script>
  import { PUBLIC_API_BASE_URL } from "$env/static/public";
  import { createEventDispatcher, onMount } from "svelte";
  import { fetchSingleContact } from "./api";
  import { page } from "$app/stores";

  let accessToken = $page?.data?.session?.access_token;
  export let contactId;
  const dispatch = createEventDispatcher();

  let name = "";
  let phone = "";
  let email = "";
  let comment = "";
  let isFormValid = false;
  let checkedFormValidation = false;

  let phoneID = "";
  let emailID = "";

  const close = () => {
    event.preventDefault();
    dispatch("close");
  };

  const editContact = async () => {
        if (!isFormValid) {
          checkedFormValidation = true;
      return; // Not Valid. Prevent submission
    }
    const url = `${PUBLIC_API_BASE_URL}/api/biz/contacts/${contactId}`;

    const contactData = {
      ID: contactId,
      InfoID: contactId,
      Comment: comment,
      Info: {
        Name: name,
        ID: contactId,
        DefaultEmailID: emailID,
        DefaultPhoneID: phoneID,
        DefaultPhone: {
          Number: phone,
          ID: phoneID,
          CountryCode: "",
          Description: "Mobile",
        },
        DefaultEmail: {
          ID: emailID,
          EmailAddress: email,
        },
      },
    };

    try {
      const response = await fetch(url, {
        method: "PUT", // Use PUT for editing
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("API error:", errorResponse);
        throw new Error("Failed to update contact");
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

  onMount(async () => {
    try {
      const contactData = await fetchSingleContact(accessToken, contactId);

      // Populate form fields with contact data
      name = contactData.Info.Name;
      phone = contactData.Info.DefaultPhone.Number;
      email = contactData.Info.DefaultEmail.EmailAddress;
      comment = contactData.Comment;

      phoneID = contactData.Info.DefaultPhoneID;
      emailID = contactData.Info.DefaultEmailID;

      validateForm(); // Trigger form validation
    } catch (error) {
      console.error(error);
    }
  });
</script>

<div class="modal-content">
  <form>
    <div>
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
    <div>
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
    <div>
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
    <div>
      <label for="comment">Comment</label>
      <textarea id="comment" bind:value={comment} />
    </div>
    <div>
      <button class="save-button" on:click={editContact}>Save</button>
      <button class="modal-close" on:click={close}>Close</button>
    </div>
  </form>
</div>

<style>
  .modal-content {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
  }

  .modal-close {
    margin-top: 10px;
    background: #c7231b;
    color: #fff;
    border: none;
    border-radius: 1.5rem;
    padding: 0.5rem 1.2rem;
    cursor: pointer;
  }

  .modal-close:hover {
    background: #9b1b15;
  }

  textarea {
    width: 100%;
    height: 200px;
  }

  .save-button {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 1.5rem;
    padding: 0.5rem 1.2rem;
    cursor: pointer;
  }

  .save-button:hover {
    background-color: #0056b3;
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

  .validation_fail_text {
        color: #FF0000;
    }
</style>
