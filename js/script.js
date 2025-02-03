document.addEventListener("DOMContentLoaded", function () {
	const itemsContainer = document.getElementById("items-container");
	const searchInput = document.getElementById("search");

	let items = []; // Declare items here, in the global scope

	async function fetchItems() {
		try {
			const response = await fetch(
				"https://508qfwa0x8.execute-api.us-east-1.amazonaws.com/productions"
			);
			const rawData = await response.json();
			console.log("Fetched data:", rawData); // Debugging line

			// Extract `body` directly if it exists
			const data = rawData.body || rawData;
			console.log("Parsed data:", data); // Debugging line

			if (!Array.isArray(data)) {
				throw new Error(
					"Expected an array but received: " + JSON.stringify(data)
				);
			}

			items = data; // Assign the fetched data to the global items variable
			displayItems(items); // Display the fetched items
		} catch (error) {
			console.error("Error fetching items:", error);
		}
	}

	function displayItems(filteredItems) {
		itemsContainer.innerHTML = "";
		filteredItems.forEach((item) => {
			console.log(item); // Check the structure in the console
			const itemDiv = document.createElement("div");
			itemDiv.classList.add("item");

			// Use item.Name and item.Description as before
			const image = item.ItemURL
				? `<img src="${item.ItemURL}" alt="${item.Name}" class="item-image">`
				: "";

			itemDiv.innerHTML = `
                <h3>${item.Name}</h3>
                <p>${item.Description}</p>
                ${image}  <!-- This will display the image if available -->

            `;
			itemsContainer.appendChild(itemDiv);
		});
	}

	// Handle search functionality
	searchInput.addEventListener("keyup", function () {
		const query = searchInput.value.toLowerCase();
		const filteredItems = items.filter(
			(item) =>
				item.Name.toLowerCase().includes(query) ||
				item.Description.toLowerCase().includes(query) ||
				item.Tags.toLowerCase().includes(query)
		);
		displayItems(filteredItems); // Display filtered items
	});

	fetchItems(); // Fetch items when the page loads
});
