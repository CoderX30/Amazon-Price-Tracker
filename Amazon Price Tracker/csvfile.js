async function downloadCSV(data) {
    const csvContent = "data:text/csv;charset=utf-8," + data.join("\n");
    const blob = new Blob([csvContent], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
      url: url,
      filename: 'scraped_urls.csv'
    });
  }
  