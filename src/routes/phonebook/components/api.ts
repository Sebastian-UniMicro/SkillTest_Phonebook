import { PUBLIC_API_BASE_URL } from "$env/static/public";

export async function fetchContacts(accessToken) {
    const expansion = '?expand=Info,Info.InvoiceAddress,Info.DefaultPhone,Info.DefaultEmail,Info.DefaultAddress';
    const url = `${PUBLIC_API_BASE_URL}/api/biz/contacts${expansion}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch contacts. Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  export async function fetchSingleContact(accessToken, contactId) {
    const expansion = '?expand=Info,Info.InvoiceAddress,Info.DefaultPhone,Info.DefaultEmail,Info.DefaultAddress';
    const url = `${PUBLIC_API_BASE_URL}/api/biz/contacts/${contactId}${expansion}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch contacts. Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }