console.clear();
console.log("Custom Theme Adaptor");

chrome.tabs.onActivated.addListener(async (activeInfo) => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	if (tab?.id) {
		if (tab.url.startsWith("https://app.clickup.com")) {
			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				function: functionToExecute,
			});
		}
	}
});

const functionToExecute = () => {
	const documentBody = document.querySelector("body");
	const themeMq = window.matchMedia("(prefers-color-scheme: dark)");

	const themeMqCallback = (darkThemeMqEvent) => {
		const darkThemeClassName = "dark-theme";

		const isClickUpInDarkMode =
			documentBody.classList.contains(darkThemeClassName);

		const isSystemSetAsDark = darkThemeMqEvent.matches;

		if (
			(isSystemSetAsDark && !isClickUpInDarkMode) ||
			(!isSystemSetAsDark && isClickUpInDarkMode)
		) {
			const data = { dark_theme: isSystemSetAsDark };

			const authToken = `Bearer ${localStorage.getItem("id_token")}`;

			fetch("https://app.clickup.com/v1/user", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: authToken,
				},
				body: JSON.stringify(data),
			});
		}

		const themeChangeListenerAttributeName =
			"theme-change-listener-registered";

		const themeChangeListenerAttribute = documentBody.getAttribute(
			themeChangeListenerAttributeName
		);

		if (themeChangeListenerAttribute !== "true") {
			themeMq.addEventListener("change", themeMqCallback);
			documentBody.setAttribute(themeChangeListenerAttributeName, "true");
		}
	};

	themeMqCallback(themeMq);
};
