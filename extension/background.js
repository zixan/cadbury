chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  console.log("Received message in background", request);
    if (request.action === "switchTabs") {
      chrome.tabs.query({currentWindow: true}, (tabs) => {
        switchTabs(tabs, request.payload.tabIndex);
      });
    }

    else if (request.action === "getTabUrls") {
        chrome.tabs.query({currentWindow: true}, (tabs) => {
          const tabUrls = tabs.map(tab => tab.url);
          sendResponse({'action': 'getTabUrls', 'tabUrls': tabUrls});
        });
    }

    else if (request.action === "setLoadingState") {
      chrome.tabs.query({currentWindow: true }, (tabs) => { // Query all tabs
        // Update each tab with the extension open
        tabs.forEach(tab => {
          console.log("Setting loading state in content script", request.payload.state, request.payload.status);
          setLoadingStateInContentScript(tab.id, request.payload.state, request.payload.status);
        })
      });
    }
    
    return true;
  });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "switchTabs") {
      chrome.tabs.query({currentWindow: true}, (tabs) => {
        switchTabs(tabs, request.payload.tabIndex);
      });
    }

    else if (request.action === "getTabUrls") {
        chrome.tabs.query({currentWindow: true}, (tabs) => {
          const tabUrls = tabs.map(tab => tab.url);
          sendResponse({'action': 'getTabUrls', 'tabUrls': tabUrls});
        });
    }

    
    return true;
  });


chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  if (details.url.includes('https://qbo.intuit.com/app/reports')) {
    chrome.scripting.executeScript({
      target: {tabId: details.tabId},
      files: ['qb.js']
    });
  }
});


function switchTabs(tabs, index) {
    if (tabs.length <= 1 || index < 0) {
        console.error("Not enough tabs open or no tab index provided");
        return
    }
    
    chrome.tabs.query({currentWindow: true}, (tabs) => {
        if (tabs.length > 1) {
            chrome.tabs.update(tabs[index].id, {active: true});
        }
    });
}

function setLoadingStateInContentScript(tabId, state, status) {
  console.log("Setting loading state in content script tab id", state, status, tabId);
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (state, status, tabId) => {
      if (state !== null) {
        const existingHourglass = document.querySelector('.hourglass');
        console.log("Existing hourglass", existingHourglass);
        if (existingHourglass) {
          if (state == true) {
            existingHourglass.classList.add('hourglass-animation');
          }
          else {
            existingHourglass.classList.remove('hourglass-animation');
          }
        } 
      }

      if (status) {
        const statusTextDiv = document.querySelector('.status-text');
        if (statusTextDiv) {
          statusTextDiv.textContent = status;
        }
      }
      
      else {
        const statusTextDiv = document.querySelector('.status-text');
        if (statusTextDiv) {
          statusTextDiv.textContent = "";
        }
      }
    },
    args: [state, status, tabId]
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.clear(() => {
    console.log("Local storage cleared on extension load");
  });
});