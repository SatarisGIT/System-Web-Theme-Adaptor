console.clear();
console.log("Custom Theme Adaptor");

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab?.id) {
    if (tab.url.startsWith("https://app.clickup.com")) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          const documentBody = document.querySelector("body");

          const darkThemeMqCallback = (darkThemeMqEvent) => {
            const darkThemeClassName = "dark-theme";

            const isSystemSetAsDark = darkThemeMqEvent.matches;

            if (isSystemSetAsDark) {
              documentBody.classList.add(darkThemeClassName);
            } else {
              documentBody.classList.remove(darkThemeClassName);
            }
          };

          const themeChangeListenerAttributeName =
            "data-theme-change-listener-registered";

          const themeChangeListenerAttribute = documentBody.getAttribute(
            themeChangeListenerAttributeName
          );

          if (themeChangeListenerAttribute !== "true") {
            const darkThemeMq = window.matchMedia(
              "(prefers-color-scheme: dark)"
            );
            darkThemeMq.addEventListener("change", darkThemeMqCallback);
            documentBody.setAttribute(themeChangeListenerAttributeName, "true");

            darkThemeMqCallback(darkThemeMq);
          }
        },
      });
    }
  }
});
