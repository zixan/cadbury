// Wrap everything inside the window load event listener
window.addEventListener('load', function() {
  (function() {
    // Create a fake cursor element and add it to the body
    const fakeCursor = document.createElement('div');
    fakeCursor.id = 'fakeCursor';
    fakeCursor.style.position = 'absolute';
    fakeCursor.style.fontSize = '24px';
    fakeCursor.style.pointerEvents = 'none';
    fakeCursor.style.zIndex = '1000';
    fakeCursor.innerText = '🖱'; // ASCII character representing the mouse cursor
    document.body.appendChild(fakeCursor);

    // Start the fake cursor in the center of the screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    fakeCursor.style.left = `${centerX}px`;
    fakeCursor.style.top = `${centerY}px`;

    // Function to find the element by XPath
    function getElementByXPath(xpath) {
      return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // Function to get a small reduced random offset (for smoother movement)
    function getReducedRandomOffset() {
      return (Math.random() - 0.5) * 2; // Random value between -1 and 1 for smoother movement
    }

    // Function to ensure the element is visible by scrolling both horizontally and vertically if necessary
    function scrollToElementIfNeeded(targetElement, callback) {
      const rect = targetElement.getBoundingClientRect();
      const isVisibleVertically = (rect.top >= 0 && rect.bottom <= window.innerHeight);
      const isVisibleHorizontally = (rect.left >= 0 && rect.right <= window.innerWidth);

      if (!isVisibleVertically || !isVisibleHorizontally) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        setTimeout(callback, 1000); // Adding a 1-second timeout for smooth scrolling
      } else {
        callback();
      }
    }

    // Function to move the fake cursor and simulate a click, with scrolling if needed
    function moveCursorAndClick(xpath, duration = 1000, callback = null) {
      const targetElement = getElementByXPath(xpath);
      if (!targetElement) {
        console.error("Element not found for the given XPath");
        return;
      }

      // Scroll to the element if it's not visible
      scrollToElementIfNeeded(targetElement, function() {
        const rect = targetElement.getBoundingClientRect();
        const cursor = document.getElementById('fakeCursor');

        const startX = cursor.offsetLeft;
        const startY = cursor.offsetTop;
        const endX = rect.left + window.scrollX + rect.width / 2;
        const endY = rect.top + window.scrollY + rect.height / 2;

        let startTime = null;

        function animateCursor(time) {
          if (!startTime) startTime = time;
          const progress = Math.min((time - startTime) / duration, 1);
          const randomX = getReducedRandomOffset();
          const randomY = getReducedRandomOffset();

          cursor.style.left = startX + (endX - startX) * progress + randomX + 'px';
          cursor.style.top = startY + (endY - startY) * progress + randomY + 'px';

          // Ensure the cursor is always visible by scrolling if needed
          const cursorRect = cursor.getBoundingClientRect();
          if (cursorRect.top < 0 || cursorRect.bottom > window.innerHeight || cursorRect.left < 0 || cursorRect.right > window.innerWidth) {
            window.scrollBy(cursorRect.left < 0 || cursorRect.right > window.innerWidth ? 10 : 0, cursorRect.top < 0 || cursorRect.bottom > window.innerHeight ? 10 : 0);
          }

          if (progress < 1) {
            requestAnimationFrame(animateCursor);
          } else {
            // Simulate a click once the cursor reaches the target
            targetElement.click();
            console.log("Clicked on the element.");
            if (callback) callback(); // Execute callback after the click
          }
        }

        requestAnimationFrame(animateCursor);
      });
    }

    // Function to wait for the element to be loaded and fully visible, then animate the cursor to it
    function waitForElementAndAnimateClick(xpath, duration = 1000, intervalTime = 1000, callback = null) {
      const interval = setInterval(() => {
        const targetElement = getElementByXPath(xpath);
        if (targetElement) {
          clearInterval(interval); // Stop checking once the element is found
          moveCursorAndClick(xpath, duration, callback);
        }
      }, intervalTime); // Check every `intervalTime` milliseconds
    }

    function redact() {
      const elements = document.querySelectorAll('.TableCellComponent__CellWrapper-sc-14huedz-0.iPdOIf');

      // Iterate through the NodeList and redact (replace) the inner text or content
      elements.forEach(element => {
        element.textContent = '[REDACTED]'; // Replacing text content
      });
    }

    // First, move to the element by the initial XPath and click it
    moveCursorAndClick('//*[@id="navigation-container"]/div[8]/a/span', 2000, function() {
      // Increase the wait time for the second element to ensure it appears and is clickable
      setTimeout(function() {
        waitForElementAndAnimateClick('//*[@id="app"]/div/div[1]/div[2]/div[3]/div[4]/div/div/div[4]/div[2]/div[1]/div[13]/div/div[1]/div[1]/div/span/div/a', 1000, 1000, function() {
          // After clicking the second element, move to the third element and click, considering horizontal scrolling
          setTimeout(function() {
            redact();
              waitForElementAndAnimateClick("//*[contains(text(),'Export/Print')]", 1000, 1000, function() {
              waitForElementAndAnimateClick("//*[contains(text(),'Export as CSV')]");
            });
          }, 8000);
        });
      }, 5000); // Extended delay to ensure the second element is fully loaded
    });
  })();
});
