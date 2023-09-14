  <script>
    import EditContactForm from "./EditContactForm.svelte";

    export let contacts = [
      {
        "ID": "",
        "Info": {
          "Name": "",
          "InvoiceAddress": {
              "AddressLine1": "",
              "AddressLine2": "",
              "AddressLine3": "",
              "City": "",
              "Country": "",
              "CountryCode": "",
              "PostalCode": ""
            },
          "DefaultPhone": {
              "CountryCode": "",
              "Description": "",
              "Number": ""
            },
          "DefaultEmail": {
              "EmailAddress": ""
            }
        },
        "Comment": "",
      }
        ];

        let selectedContactId = null;

  function toggleDropdown(contact) {
    console.log("Toggling dropdown for contact:", contact);
  contact.showDropdown = !contact.showDropdown;
}

  function editContact(contact) {
    selectedContactId = contact.ID;

    console.log("The contact to edit is " + contact.ID);
  }

function deleteContact(contact) {
  // TODO Implement deletion logic here
  // TODO You can open a confirmation modal for deletion
}
  </script>
  
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Phone Number</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      {#each contacts as contact (contact.ID)}
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

  {#if selectedContactId !== null}
  <EditContactForm contactId={selectedContactId} />
{/if}

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
  </style>