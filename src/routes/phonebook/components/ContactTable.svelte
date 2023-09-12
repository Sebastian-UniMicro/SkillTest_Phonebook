<script>
    // Define properties to pass data
    export let contacts = [];
  </script>
  
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      {#each contacts as contact}
        <tr>
          <td>{contact.name}</td>
          <td>{contact.phone}</td>
          <td>{contact.email}</td>
        </tr>
      {/each}
    </tbody>
  </table>