<script>
    import { onMount } from 'svelte';
    import ContactTable from './components/ContactTable.svelte';
    import { fetchContacts } from './components/api';
    import { page } from '$app/stores';
    import Modal from './components/Modal.svelte';
    import CreateContactForm from './components/CreateContactForm.svelte';
    import { goto } from '$app/navigation';
  
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

    onMount(async () => {
      if (!$page?.data?.session) {
      } else {
        try {
          contacts = await fetchContacts(accessToken);
        } catch (error) {
          console.error(error);
        }
      }
      console.log("Contacts data:", contacts);
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
