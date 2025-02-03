document.addEventListener("DOMContentLoaded", function () {
	const itemsContainer = document.getElementById("items-container");
	const searchInput = document.getElementById("search");

	async function fetchItems() {
		try {
			const response = await fetch(
				"https://uzqu49prib.execute-api.us-east-1.amazonaws.com/default/fetchItemInfo"
			); // Replace with your API Gateway URL
			const data = await response.json();
			displayItems(data);
		} catch (error) {
			console.error("Error fetching items:", error);
		}
	}

	function displayItems(filteredItems) {
		itemsContainer.innerHTML = "";
		filteredItems.forEach((item) => {
			const itemDiv = document.createElement("div");
			itemDiv.classList.add("item");
			itemDiv.innerHTML = `<h3>${item.name}</h3><p>${item.description}</p>`;
			itemsContainer.appendChild(itemDiv);
		});
	}

	searchInput.addEventListener("keyup", function () {
		const query = searchInput.value.toLowerCase();
		const filteredItems = items.filter(
			(item) =>
				item.name.toLowerCase().includes(query) ||
				item.description.toLowerCase().includes(query)
		);
		displayItems(filteredItems);
	});

	// Fetch items when the page loads
	fetchItems();
});
