<script>
    import { PUBLIC_API_BASE_URL } from "$env/static/public";
  
    export let contact = {}; // Receive the contact data as a prop
  
    async function EditContact() {
      const contactId = contact.ID; // Extract the ID from the contact data
      const url = `${PUBLIC_API_BASE_URL}/api/biz/contacts/${contactId}`; // Construct the URL
  
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contact),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update contact');
        }
  
        // Handle success, e.g., close the modal or navigate back
      } catch (error) {
        // Handle errors, e.g., display an error message
        console.error(error);
      }
    }
  </script>
  
  <form>
    <div>
      <label for="name">Name:</label>
      <input type="text" id="name" bind:value={contact.name} />
    </div>
    <div>
      <label for="phone">Phone:</label>
      <input type="text" id="phone" bind:value={contact.phone} />
    </div>
    <div>
      <label for="email">Email:</label>
      <input type="text" id="email" bind:value={contact.email} />
    </div>
    <div>
        <label for="comment">Comment</label>
        <textarea id="comment" bind:value={contact.comment} />
    </div>
    <div>
      <button on:click={EditContact}>Save</button>
    </div>
  </form>