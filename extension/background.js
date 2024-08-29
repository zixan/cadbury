chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    if (request.action === "switchTab") {
      chrome.tabs.query({currentWindow: true}, (tabs) => {
        if (tabs.length > 1) {
          let currentIndex = tabs.findIndex(tab => tab.active);
          let nextIndex = (currentIndex + 1) % tabs.length;
          chrome.tabs.update(tabs[nextIndex].id, {active: true});
        }
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