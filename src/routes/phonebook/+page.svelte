<script>
    import { onMount, setContext } from 'svelte';
    import ContactTable from './components/ContactTable.svelte';
    import { fetchContacts } from './components/api';
    import { page } from '$app/stores';
    import Modal from './components/Modal.svelte';
    import CreateContactForm from './components/CreateContactForm.svelte';
    import { goto } from '$app/navigation';
    import { signOut } from '@auth/sveltekit/client';
  
    export let contacts = [];
    let accessToken = $page?.data?.session?.access_token;

    let isModalOpen = false;
    let visible = isModalOpen;
    let isFormValid = false;

    onMount(() => { //Check session authentication
        if (!$page?.data?.session) {
            goto("/");
        }
    });

    export const GetContactsForTable = (async () => {
      if (!$page?.data?.session) {
      } else {
        try {
          contacts = await fetchContacts(accessToken);
        } catch (error) {
          console.error(error);
        }
      }
    });

        export async function getContactsForTable() {
      if (!$page?.data?.session) {
      } else {
        try {
          contacts = await fetchContacts(accessToken);
        } catch (error) {
          console.error(error);
        }
      }
    }

    onMount(async () => {
      GetContactsForTable();
    });

    const openModal = () => {
        isModalOpen = true;
        visible = isModalOpen; 
    };

    const closeModal = () => {
        isModalOpen = false;
        visible = isModalOpen;
    };

    const handleCreateContactFormClose = () => {
    closeModal();
  };

  const handleCreateContact = () => {
    if (isFormValid) {
      closeModal();
    }
  };

  </script>
  
  <div>
    <button class="custom-button" on:click={openModal}>Create new contact</button>
  </div>
  
  <Modal {visible} {closeModal}>
    <h2 class="bold">Create New Contact</h2>
    <CreateContactForm
    on:create={handleCreateContact}
    on:close={handleCreateContactFormClose}
    bind:isFormValid={isFormValid}
    accessToken={accessToken}
  />
</Modal>

<button on:click={GetContactsForTable}> Update table</button>

<ContactTable {contacts} />


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

  button:active {
    background-color: #00408a;
  }
</style>