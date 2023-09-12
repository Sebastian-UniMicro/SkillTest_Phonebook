<script>
    import { onMount } from 'svelte';
    import ContactTable from './components/ContactTable.svelte';
    import { fetchContacts } from './components/api';
    import { page } from '$app/stores';
    import Modal from './components/Modal.svelte';
    import CreateContactForm from './components/CreateContactForm.svelte';
  
    let contacts = [];
    let accessToken = $page?.data?.session?.access_token;
  
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

    let isModalOpen = false;
    let visible = isModalOpen;

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
  </script>
  
  <div>
    <button on:click={openModal}>Create new contact</button>
  </div>
  
  <Modal {visible} {closeModal}>
    <!-- Content for the modal goes here -->
    <h2>Create New Contact</h2>
    <CreateContactForm
    on:create={closeModal}        
    on:close={handleCreateContactFormClose}
  />
</Modal>

  <ContactTable {contacts} />

  <div><button class="destructive-btn" on:click={() => fetchContacts(accessToken)}> Test Get contacts</button></div>

