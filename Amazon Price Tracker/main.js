// Function to check price
function checkPrice() {
    try {
        const URL = 'https://www.amazon.in/Directed-Graphic-Printed-T-Shirt-T-Shirts/dp/B09DQ12NSH/ref=sr_1_11?crid=1BMAAJ2YKLXU5&dib=eyJ2IjoiMSJ9.KJY0j4EdAYsJRQUmf_RV9iqNmpJzZsWLHdRtxY-IgpTPoZaXyK1MbtXOdByzhU9Z2Y7R-zrXD4dWm-N5DxnljuuOLGh9ivJx6vO44MvrBtdyLvimDjSt5hHCaUOvrL1nN-P7KEkhzv_eSB80X6FLSvvqd8kZ2X0YYYNlaY2CwKHsltXSTp5UnhzjDkVw9zMjqzFQh5nmZt7OuEeajFGSZuZ2pvTx7sBH9EZPrOz4K9mSVP2tj1N3FaDQMjhUr28abes5BsL0yUx7hFw9-gJMKSpQkpgbMU7cD38slAEOVUA.iYp9FmHz3n2fKXzoFeuIbAeLI3vHrGj_TjecW-DKsQg&dib_tag=se&keywords=data%2Banalyst%2Btshirt&qid=1718017431&sprefix=data%2Banal%2Caps%2C191&sr=8-11';

        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
        };

        fetch(URL, { headers })
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const htmlDocument = parser.parseFromString(data, 'text/html');

                const title = htmlDocument.getElementById('productTitle').textContent.trim();
                const price = htmlDocument.querySelector('.a-price-whole').textContent.trim();
                const today = new Date().toISOString().slice(0, 10);

                const data = { title, price, date: today };

                // Example of what to do next: send data to background script or save locally
                chrome.runtime.sendMessage({ action: 'saveData', data }, response => {
                    console.log('Data saved successfully:', response);
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                console.log('Retrying in 5 seconds...');
                setTimeout(checkPrice, 5000); // Retry after 5 seconds
            });
    } catch (error) {
        console.error('Exception occurred:', error);
    }
}

// Function to call checkPrice multiple times (for testing purposes)
function runCheck() {
    for (let i = 0; i < 4; i++) {
        setTimeout(checkPrice, i * 10000); // Call checkPrice every 10 seconds
    }
}

// Initial call to runCheck (for testing purposes)
runCheck();
