function sendMessage(action) {
    chrome.runtime.sendMessage({action}, response => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
      } else {
        console.log("Message sent successfully. Response:", response);

        if (response.action === 'getTabUrls') {
            if (response.tabUrls && Array.isArray(response.tabUrls)) {
                const hasXyzCom = response.tabUrls.some(url => url.includes('xyz.com'));
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

// Create container for buttons
const buttonContainer = document.createElement('div');
buttonContainer.style.position = 'fixed';
buttonContainer.style.bottom = '20px';
buttonContainer.style.right = '20px';
buttonContainer.style.width = '200px'; // Increased from 80px
buttonContainer.style.height = '200px'; // Increased from 80px
buttonContainer.style.borderRadius = '50%';
buttonContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
buttonContainer.style.display = 'flex';
buttonContainer.style.flexDirection = 'column';
buttonContainer.style.justifyContent = 'center';
buttonContainer.style.alignItems = 'center';
buttonContainer.style.zIndex = '9999';
buttonContainer.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.5)'; // Enhanced shadow


// Create buttons
const switchTabButton = document.createElement('button');
switchTabButton.textContent = 'S';
switchTabButton.title = 'Switch Tab';
switchTabButton.style.width = '30px';
switchTabButton.style.height = '30px';
switchTabButton.style.borderRadius = '50%';
switchTabButton.style.margin = '3px';
switchTabButton.style.padding = '0';
switchTabButton.style.border = 'none';
switchTabButton.style.backgroundColor = 'white';
switchTabButton.style.cursor = 'pointer';

const getTabUrlsButton = document.createElement('button');
getTabUrlsButton.textContent = 'G';
getTabUrlsButton.title = 'Get Tab URLs';
getTabUrlsButton.style.width = '30px';
getTabUrlsButton.style.height = '30px';
getTabUrlsButton.style.borderRadius = '50%';
getTabUrlsButton.style.margin = '3px';
getTabUrlsButton.style.padding = '0';
getTabUrlsButton.style.border = 'none';
getTabUrlsButton.style.backgroundColor = 'white';
getTabUrlsButton.style.cursor = 'pointer';

// Add event listeners
switchTabButton.addEventListener('click', () => {
  sendMessage('switchTab');
});

getTabUrlsButton.addEventListener('click', () => {
  sendMessage('getTabUrls');
});

// Append buttons to the container
buttonContainer.appendChild(switchTabButton);
buttonContainer.appendChild(getTabUrlsButton);

// Append container to the body
document.body.appendChild(buttonContainer);