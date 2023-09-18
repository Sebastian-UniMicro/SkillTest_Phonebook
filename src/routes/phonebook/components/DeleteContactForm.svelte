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
  let isConfirmingDeletion = false;
  
  const close = () => {
    event.preventDefault();
    dispatch("close");
  };
  
  const deleteContact = async () => {
    const url = `${PUBLIC_API_BASE_URL}/api/biz/contacts/${contactId}`;
  
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('API error:', errorResponse);
        throw new Error('Failed to delete contact');
      }
  
      setTimeout(() => {
        refreshContacts();
      }, 2000);
  
      dispatch('close');
    } catch (error) {
      console.error(error);
    }
  };
  
  const confirmDeletion = () => {
    isConfirmingDeletion = true;
  };
  
  const abortDeletion = () => {
    isConfirmingDeletion = false;
  };
  
  onMount(async () => {
    try {
      const contactData = await fetchSingleContact(accessToken, contactId);
      name = contactData.Info.Name;
    } catch (error) {
      console.error(error);
    }
  });
</script>

{#if isConfirmingDeletion}
<div class="modal">
  <div class="modal-content">
    <p class="confirmation-message">Are you sure you want to delete {name}?</p>
    <div class="button-container">
      <button class="delete-button" on:click={deleteContact}>Yes</button>
      <button class="cancel-button" on:click={abortDeletion}>No</button>
    </div>
  </div>
</div>
{/if}

<div class="confirmation-form">
  <div>
    <label for="name">{name}</label>
  </div>
  <div>
    {#if !isConfirmingDeletion}
    <button class="delete-button" on:click={confirmDeletion}>Delete</button>
    <button class="modal-close" on:click={close}>Close</button>
    {/if}
  </div>
</div>

<style>
  button {
        color: #fff;
        background: #2253dd;
        border: none;
        border-radius: 1.5rem;
        padding: 0.5rem 1.2rem;
        cursor: pointer;
    }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background-color: white;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  }

  .confirmation-message {
    font-weight: bold;
    margin-bottom: 20px;
  }

  .button-container {
    display: flex;
    justify-content: center;
  }

  .delete-button {
    background-color: #c7231b;
    color: white;
    cursor: pointer;
    margin-right: 10px;
  }

  .delete-button:hover {
    background: #9b1b15;
  }

  .cancel-button {
    background-color: #2253dd;
    color: white;
    cursor: pointer;
  }

  .cancel-button:hover {
    background-color: #0056b3
  }

  .modal-close {
    margin-top: 10px;
    background-color: #2253dd;
    color: white;
    cursor: pointer;
  }

  .modal-close:hover {
    background-color: #0056b3
  }

  .confirmation-form {
    max-width: 400px;
    margin: 0 auto;
  }
</style>
