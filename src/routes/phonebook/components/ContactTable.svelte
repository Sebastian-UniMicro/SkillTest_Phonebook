<script>
  import EditContactForm from "./EditContactForm.svelte";
  import DeleteContactForm from "./DeleteContactForm.svelte";
  import Modal from "./Modal.svelte";
  import { signOut } from "@auth/sveltekit/client";

  export let contacts = [
    {
      ID: "",
      Info: {
        Name: "",
        InvoiceAddress: {
          AddressLine1: "",
          AddressLine2: "",
          AddressLine3: "",
          City: "",
          Country: "",
          CountryCode: "",
          PostalCode: "",
        },
        DefaultPhone: {
          CountryCode: "",
          Description: "",
          Number: "",
        },
        DefaultEmail: {
          EmailAddress: "",
        },
      },
      Comment: "",
    },
  ];

  let selectedSorting = "";

  let searchQuery = "";
  let debounceTimer;

  let selectedContactId = null;

  let isModalOpen = false;
  let visible = isModalOpen;
  let activeModal = null;
  let isFormValid = false;

  function toggleDropdown(contact) {
    console.log("Toggling dropdown for contact:", contact);
    contact.showDropdown = !contact.showDropdown;
    console.log("You can see the dropdown = " + contact.showDropdown);
  }

  function editContact(contact) {
    selectedContactId = contact.ID;
    activeModal = "edit";
    openModal();
  }

  function deleteContact(contact) {
    selectedContactId = contact.ID;
    activeModal = "delete";
    openModal();
  }

  const openModal = () => {
    isModalOpen = true;
    visible = isModalOpen;
  };

  const closeModal = () => {
    isModalOpen = false;
    visible = isModalOpen;
  };

  const handleEditContactFormClose = () => {
    closeModal();
  };

  const handleEditContact = () => {
    if (isFormValid) {
      closeModal();
    }
  };

  const handleDeleteContactFormClose = () => {
    closeModal();
  };

  const handleDeleteContact = () => {
    if (isFormValid) {
      closeModal();
    }
  };

  //SORTING
  function sortContacts() {
    contacts = contacts.slice().sort((a, b) => {
      if (selectedSorting === "name") {
        return a.Info.Name.localeCompare(b.Info.Name);
      } else if (selectedSorting === "email") {
        return a.Info.DefaultEmail.EmailAddress.localeCompare(
          b.Info.DefaultEmail.EmailAddress
        );
      } else if (selectedSorting === "phone") {
        return a.Info.DefaultPhone.Number.localeCompare(
          b.Info.DefaultPhone.Number
        );
      }
      return 0;
    });
  }

  function filterContacts(contact) {
    const query = searchQuery.toLowerCase();
    return (
      contact.Info.Name.toLowerCase().includes(query) ||
      contact.Info.DefaultEmail.EmailAddress.toLowerCase().includes(query) ||
      contact.Info.DefaultPhone.Number.includes(query)
    );
  }

  function sortingFunction(a, b) {
    if (selectedSorting === "name") {
      return a.Info.Name.localeCompare(b.Info.Name);
    } else if (selectedSorting === "email") {
      return a.Info.DefaultEmail.EmailAddress.localeCompare(
        b.Info.DefaultEmail.EmailAddress
      );
    } else if (selectedSorting === "phone") {
      return a.Info.DefaultPhone.Number.localeCompare(
        b.Info.DefaultPhone.Number
      );
    }
    return 0;
  }

  function setSortingToName() {
    selectedSorting = "name";
    sortContacts();
  }

  function setSortingToEmail() {
    selectedSorting = "email";
    sortContacts();
  }

  function setSortingToPhone() {
    selectedSorting = "phone";
    sortContacts();
  }

  function handleInputChange(event) {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      sortContacts();
    }, 300);
  }
</script>

<input
  type="text"
  bind:value={searchQuery}
  placeholder="Search contacts..."
  on:input={handleInputChange}
  class="custom-search-input"
/>

<button class="logout-btn" on:click={() => signOut()}> Log out </button>

<div class="table-container">
  <table class="custom-table">
    <thead>
      <tr>
        <th>
          <button class="custom-button" on:click={setSortingToName}>
            {selectedSorting === "name" ? "Name *" : "Name"}</button
          >
        </th>
        <th>
          <button class="custom-button" on:click={setSortingToPhone}>
            {selectedSorting === "phone"
              ? "Phone Number *"
              : "Phone Number"}</button
          >
        </th>
        <th>
          <button class="custom-button" on:click={setSortingToEmail}>
            {selectedSorting === "email" ? "Email *" : "Email"}</button
          >
        </th>
      </tr>
    </thead>
    <tbody>
      {#each contacts
        .filter(filterContacts)
        .sort(sortingFunction) as contact (contact.ID)}
        <tr>
          <td>{contact.Info.Name}</td>
          <td>{contact.Info.DefaultPhone.Number}</td>
          <td>{contact.Info.DefaultEmail.EmailAddress}</td>
          <td>
            <div>
              <button
                class="transformative-btn"
                on:click={() => editContact(contact)}>Edit</button
              >
              <button
                class="destructive-btn"
                on:click={() => deleteContact(contact)}>Delete</button
              >
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<Modal {visible} {closeModal}>
  {#if activeModal === "edit"}
    <h2 class="bold">Edit Contact</h2>
    <EditContactForm
      on:create={handleEditContact}
      on:close={handleEditContactFormClose}
      bind:isFormValid
      contactId={selectedContactId}
    />
  {/if}
  {#if activeModal === "delete"}
    <h2 class="bold">Delete Contact</h2>
    <DeleteContactForm
      on:create={handleDeleteContact}
      on:close={handleDeleteContactFormClose}
      contactId={selectedContactId}
    />
  {/if}
</Modal>

<style>
  button {
    background: #2253dd;
    border: none;
    border-radius: 1.5rem;
    padding: 0.5rem 1.2rem;
    cursor: pointer;
  }

  .custom-search-input {
    width: auto;
    padding: 10px;
    font-size: 16px;
    border: 2px solid #ccc;
    border-radius: 4px;
  }

  .table-container{
    max-height: 800px; /* Adjust the maximum height as needed */
    overflow-y: auto;
  }

  .custom-table {
    border-collapse: collapse;
    width: 100%;
    border: 1px solid #ddd;
  }

  .custom-table th {
    background-color: #f2f2f2;
    text-align: left;
    padding: 8px;
    border-bottom: 1px solid #ddd;
    color: #000; /* Black text color */
  }

  .custom-table th button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-weight: bold;
    font-size: 16px;
  }

  .custom-table th button:hover {
    text-decoration: underline;
  }

  .custom-table tr {
    border-bottom: 1px solid #ddd;
  }

  .custom-table td {
    padding: 8px;
    border-bottom: 1px solid #ddd;
  }

  .custom-table tfoot tr {
    border-top: 1px solid #ddd;
  }

  .destructive-btn {
    color: #fff;
    background: #c7231b;
  }

  .destructive-btn:hover {
    color: #fff;
    background: #9b1b15;
  }

  .transformative-btn {
    color: #fff;
  }

  .transformative-btn:hover {
    color: #fff;
    background-color: #0056b3;
  }

  .logout-btn {
    position: absolute;
    top: 0;
    right: 0;
    background: #c7231b;
    border: none;
    border-radius: 1.5rem;
    padding: 0.5rem 1.2rem;
    cursor: pointer;
    color: #fff;
  }

  .logout-btn:hover {
    background: #9b1b15;
  }
</style>
