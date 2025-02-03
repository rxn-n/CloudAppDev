document.addEventListener("DOMContentLoaded", function () {
	const itemsContainer = document.getElementById("items-container");
	const searchInput = document.getElementById("search");

	const items = [
		{ name: "Wallet", description: "Black leather wallet found in cafeteria" },
		{ name: "Keys", description: "Set of car keys with a blue keychain" },
		{ name: "Phone", description: "iPhone 12 found near reception" },
	];

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

	displayItems(items);
});
