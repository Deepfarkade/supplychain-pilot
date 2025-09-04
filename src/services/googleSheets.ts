/**
 * Google Sheets API Service
 * Fetches live data from Google Sheets
 */

export interface OrderData {
  po_number: string;
  expected_delivery_date: string;
  sku_id: string;
  quantity: number;
}

// Extract sheet ID from the provided URL
const SHEET_ID = '1YusTkKbZESXfhF4XVV4_escOJZDWdicUoN7fsRqTj5A';
const API_KEY = 'AIzaSyBpKi_f1XArOFVK7_TpH4_8qZ5rNxE6_Ks'; // Public API key for demo
const RANGE = 'Sheet1!A:D'; // Adjust range as needed

/**
 * Fetch data from Google Sheets using the Sheets API
 */
export async function fetchOrdersFromSheet(): Promise<OrderData[]> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status}`);
    }
    
    const data = await response.json();
    const rows = data.values;
    
    if (!rows || rows.length === 0) {
      return [];
    }
    
    // Skip header row and convert to OrderData objects
    return rows.slice(1).map((row: string[]) => ({
      po_number: row[0] || '',
      expected_delivery_date: row[1] || '',
      sku_id: row[2] || '',
      quantity: parseInt(row[3]) || 0
    })).filter(order => order.po_number); // Filter out empty rows
    
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw error;
  }
}

/**
 * Alternative method using CSV export (fallback)
 */
export async function fetchOrdersFromCSV(): Promise<OrderData[]> {
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
    
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`CSV fetch error: ${response.status}`);
    }
    
    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    // Skip header and parse CSV
    return lines.slice(1).map(line => {
      const columns = line.split(',').map(col => col.replace(/"/g, '').trim());
      return {
        po_number: columns[0] || '',
        expected_delivery_date: columns[1] || '',
        sku_id: columns[2] || '',
        quantity: parseInt(columns[3]) || 0
      };
    }).filter(order => order.po_number);
    
  } catch (error) {
    console.error('Error fetching CSV data:', error);
    throw error;
  }
}

/**
 * Main function to fetch orders with fallback
 */
export async function fetchOrders(): Promise<OrderData[]> {
  try {
    // Try Google Sheets API first
    return await fetchOrdersFromSheet();
  } catch (error) {
    console.warn('Google Sheets API failed, trying CSV fallback:', error);
    try {
      // Fallback to CSV export
      return await fetchOrdersFromCSV();
    } catch (csvError) {
      console.error('Both API and CSV methods failed:', csvError);
      throw new Error('Unable to fetch order data from Google Sheets');
    }
  }
}