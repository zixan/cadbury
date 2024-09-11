chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
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
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "setLoadingState", payload: request.payload});
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
    if (tabs.length <= 1 || !index) {
        console.error("Not enough tabs open or no tab index provided");
        return
    }
    
    chrome.tabs.query({currentWindow: true}, (tabs) => {
        if (tabs.length > 1) {
            chrome.tabs.update(tabs[index].id, {active: true});
        }
    });
}