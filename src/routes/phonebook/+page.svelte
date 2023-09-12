<script>
    import { onMount } from 'svelte';
    import ContactTable from './components/ContactTable.svelte';
    import { fetchContacts } from './components/api';
    import { page } from '$app/stores';
    import Modal from './components/Modal.svelte';
    import CreateContactForm from './components/CreateContactForm.svelte';
  
    let contacts = [];
    let accessToken = $page?.data?.session?.access_token;

    let isModalOpen = false;
    let visible = isModalOpen;
    let isFormValid = false;

    onMount(async () => {
      if (!$page?.data?.session) {
        // Handle authentication failure here
      } else {
        try {
          contacts = await fetchContacts(accessToken);
        } catch (error) {
          // Handle API request error here
          console.error(error);
        }
      }
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
    closeModal(); // Close the modal when the 'close' event is emitted
  };

  const handleCreateContact = () => {
    // Validate the form before creating a contact
    if (isFormValid) {
      // Perform contact creation logic here, if form is valid
      // You can call an API to create the contact
      // After contact creation, close the modal and update the contact list
      closeModal(); // Close the modal
      // Add logic to create the contact and update the contact list
    }
  };
  </script>
  
  <div>
    <button on:click={openModal}>Create new contact</button>
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

<ContactTable {contacts} />

<div><button class="destructive-btn" on:click={() => fetchContacts(accessToken)}> Test Get contacts</button></div>

