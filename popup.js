// popup.js
let sheetId = 'SHEET ID'; // Replace with your Google Sheet ID

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('authorizeButton').addEventListener('click', function() {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }
      console.log('Authorization successful');
    });
  });

  document.getElementById('scrapeButton').addEventListener('click', async function() {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    let currentUrl = tab.url;

    chrome.identity.getAuthToken({interactive: true}, async function(token) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }
      console.log('Authorized with token:', token);

      try {
        let response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:A1:append?valueInputOption=USER_ENTERED`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [[currentUrl]]
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to append data to Google Sheets: ${response.status}`);
        }

        console.log('Data successfully added to Google Sheets');
      } catch (error) {
        console.error('Error adding data to Google Sheets:', error);
      }
    });
  });
});
