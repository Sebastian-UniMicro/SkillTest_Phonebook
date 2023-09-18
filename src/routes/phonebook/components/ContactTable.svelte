<script>
  import EditContactForm from "./EditContactForm.svelte";
  import DeleteContactForm from "./DeleteContactForm.svelte";
  import Modal from "./Modal.svelte";

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

  let selectedSorting = "name"; // Default sorting criterion

  let searchQuery = ""; // Initialize search query variable

  let selectedContactId = null;

  let isModalOpen = false;
  let visible = isModalOpen;
  let activeModal = null;
  let isFormValid = false;

  function toggleDropdown(contact) {
    console.log("Toggling dropdown for contact:", contact);
    contact.showDropdown = !contact.showDropdown;
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
    selectedSorting = 'name';
    sortContacts();
  }

  function setSortingToEmail() {
    selectedSorting = 'email';
    sortContacts();
  }

  function setSortingToPhone() {
    selectedSorting = 'phone';
    sortContacts();
  }
</script>

<input type="text" bind:value={searchQuery} placeholder="Search contacts..." />

<select bind:value={selectedSorting}> <!-- Theory, used these values bound with thead beneath as buttons to trigger + the sortContacts button -->
  <option value="name">Name</option>
  <option value="email">Email</option>
  <option value="phone">Phone</option>
</select>

<button on:click={sortContacts}>Sort</button>

<table class="custom-table">
    <thead>
      <tr>
        <th>
          <button class="custom-button" on:click={setSortingToName}>
            {selectedSorting === "name" ? "Name *" : "Name"}</button>
        </th>
        <th>
          <button class="custom-button" on:click={setSortingToPhone}>
            {selectedSorting === "phone" ? "Phone Number *" : "Phone Number"}</button>
        </th>
        <th>
          <button class="custom-button" on:click={setSortingToEmail}>
            {selectedSorting === "email" ? "Email *" : "Email"}</button>
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
          <!--             <button class="ellipsis-button" on:click={() => toggleDropdown(contact)}></button>
            {#if contact.showDropdown}

              <div class="dropdown"> -->
          <button on:click={() => editContact(contact)}>Edit</button>
          <button on:click={() => deleteContact(contact)}>Delete</button>
          <!--               </div>
            {/if} -->
        </td>
      </tr>
    {/each}
  </tbody>
</table>

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
  .dropdown {
    position: absolute;
    z-index: 1;
    display: none;
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    padding: 5px;
  }

  .dropdown button {
    display: block;
    width: 100%;
    text-align: left;
    padding: 5px;
    border: none;
    background: none;
    cursor: pointer;
  }

  /*TODO Make ellipsis look good*/
  .ellipsis-button {
    width: 24px; /* Adjust the size as needed */
    height: 24px; /* Adjust the size as needed */
    background-color: transparent;
    border: none;
    font-size: 18px; /* Adjust the size as needed */
    cursor: pointer;
  }

  .ellipsis-button::before {
    content: "\22EE"; /* Unicode character for vertical ellipsis */
  }

  .custom-table {
    border-collapse: collapse;
    width: 100%;
  }

  /* Style the table headers */
  .custom-table th {
    background-color: #f2f2f2;
    text-align: left;
    padding: 8px;
  }

  /* Style the button inside the table header cell */
  .custom-table th button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-weight: bold;
    font-size: 16px;
  }

  /* Add hover effect to the buttons */
  .custom-table th button:hover {
    text-decoration: underline;
  }

  /* Style the table rows */
  .custom-table tr {
    border-bottom: 1px solid #ddd;
  }

  /* Style the table cells */
  .custom-table td {
    padding: 8px;
  }
</style>
