import { PUBLIC_API_BASE_URL } from "$env/static/public";

export async function fetchContacts(accessToken) {
    const url = `${PUBLIC_API_BASE_URL}/api/biz/contacts`;
  
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