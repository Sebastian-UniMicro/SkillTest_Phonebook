<script>
    import { PUBLIC_API_BASE_URL } from "$env/static/public";
    import { createEventDispatcher, onMount } from "svelte";
    import { fetchSingleContact } from "./api";
    import { page } from "$app/stores";
  
    let accessToken = $page?.data?.session?.access_token;
    export let contactId;
    const dispatch = createEventDispatcher();
    export let refreshContacts;
  
    let name = "";
    let confirmDeletion = false;
  
    const close = () => {
        event.preventDefault();
        dispatch("close");
    };
  
    const deleteContact = async () => {

      const url = `${PUBLIC_API_BASE_URL}/api/biz/contacts/${contactId}`;
  
      const contactData = {
        "ID": contactId,
          "InfoID": contactId,
          "Comment": "",
          "Info": {
              "Name": name,
              "ID": contactId,
              "DefaultEmailID": "",
              "DefaultPhoneID": "",
              "DefaultPhone": {
                  "Number": "",
                  "ID": "",
                  "CountryCode": "",
                  "Description": "Mobile"
              },
              "DefaultEmail": {
                  "ID": "",
                  "EmailAddress": ""
              }
          }
      };
  
      try {
        const response = await fetch(url, {
          method: 'DELETE',
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
  
        setTimeout(() => {
          refreshContacts();
        }, 2000);
  
        dispatch('close');
      } catch (error) {
  
        console.error(error);
      }
    };

    const checkforConfirmation = async () => {
        confirmDeletion = true;
    }

    const abbortdeletion = async () => {
        confirmDeletion = false;
    }
  
    onMount(async () => {
      try {
        const contactData = await fetchSingleContact(accessToken, contactId);

        name = contactData.Info.Name;
      } catch (error) {
        console.error(error);
      }
    });
  </script>
  
  <form>
    <div>
        <label for="name">{name}</label>
    </div>
    <div>
        {#if !confirmDeletion}
        <button on:click={checkforConfirmation}>Delete</button>
        <button class="modal-close" on:click={close}>Close</button>
        {/if}
    </div>
    <div>
        {#if confirmDeletion}
        <div>Are you sure?</div>
        <button on:click={deleteContact}>YES</button>
        <button class="modal-close" on:click={close} on:click={abbortdeletion}>NO</button>
      {/if}
    </div>
  </form>
  
  <style>
    .modal-close {
        margin-top: 10px;
    }
  </style>
  