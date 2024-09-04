function sendMessage(action, tabIndex) {
    chrome.runtime.sendMessage({action, tabIndex}, response => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
      } else {
        console.log("Message sent successfully. Response:", response);

        if (response.action === 'getTabUrls') {
            if (response.tabUrls && Array.isArray(response.tabUrls)) {
                const hasXyzCom = response.tabUrls.some(url => url.includes('maps.google.com'));
                const hasAbcCom = response.tabUrls.some(url => url.includes('abc.com'));
                
                console.log(hasXyzCom, hasAbcCom)
                const resultElement = document.createElement('div');
                resultElement.textContent = `Has xyz.com: ${hasXyzCom}`;
                resultElement.style.backgroundColor = 'white';
                resultElement.style.padding = '5px';
                resultElement.style.border = '1px solid black';
                document.body.appendChild(resultElement);
              }            
        }
      }
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "setLoadingState") {
    const existingHourglass = document.querySelector('.hourglass');
    if (existingHourglass) {
      if (request.payload.state == true) {
        existingHourglass.classList.add('hourglass-animation');
        statusText.textContent = request.payload.status + '...';
      } else {
        existingHourglass.classList.remove('hourglass-animation');
      }
    }
  }
});

const link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = chrome.runtime.getURL('style.css'); // Adjust the path if necessary

// Append the link element to the head
document.head.appendChild(link);


// Create container for buttons
const buttonContainer = document.createElement('div');
buttonContainer.classList.add('button-container');
document.body.appendChild(buttonContainer);

const hourglass = document.createElement('div');
hourglass.classList.add('hourglass');
buttonContainer.appendChild(hourglass);

const statusText = document.createElement('p');
statusText.classList.add('status-text');
buttonContainer.appendChild(statusText);