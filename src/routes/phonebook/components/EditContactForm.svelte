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
  let isFormValid = true;

  let phoneID = "";
  let emailID = "";

  const close = () => {
      event.preventDefault();
      dispatch("close");
  };

  const editContact = async () => {
/*     if (!isFormValid) {
      return; // Not Valid. Prevent submission
    } */
    const url = `${PUBLIC_API_BASE_URL}/api/biz/contacts/${contactId}`;

    const contactData = {
      "ID": contactId,
        "InfoID": contactId,
        "Comment": comment,
        "Info": {
            "Name": name,
            "ID": contactId,
            "DefaultEmailID": emailID,
            "DefaultPhoneID": phoneID,
            "DefaultPhone": {
                "Number": phone,
                "ID": phoneID,
                "CountryCode": "",
                "Description": "Mobile"
            },
            "DefaultEmail": {
                "ID": emailID,
                "EmailAddress": email
            }
        }
    };

    try {
      const response = await fetch(url, {
        method: 'PUT', // Use PUT for editing
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('API error:', errorResponse);
        throw new Error('Failed to update contact');
      }

      dispatch('close');
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
      <button on:click={editContact}>Save</button>
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
