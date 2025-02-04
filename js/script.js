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
			console.log("Fetched raw data:", rawData); // Debugging

			// Parse the body if necessary
			const data =
				typeof rawData.body === "string"
					? JSON.parse(rawData.body).items
					: rawData.items;
			console.log("Parsed data:", data); // Debugging

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
			console.log("Displaying item:", item); // Debugging
			const itemDiv = document.createElement("div");
			itemDiv.classList.add("item");

			// Use item.Name and item.Description as before
			const image = item.ItemURL
				? `<img src="${item.ItemURL}" alt="${item.Name}" class="item-image">`
				: "";

			// Display Tags as well
			const tags =
				item.Tags && Array.isArray(item.Tags)
					? item.Tags.join(", ")
					: "No tags";

			itemDiv.innerHTML = `
                <h3>${item.Name}</h3>
                <p>${item.Description}</p>
                ${image}  <!-- This will display the image if available -->
                <p><strong>Tags:</strong> ${tags}</p>
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
				(item.Tags &&
					Array.isArray(item.Tags) &&
					item.Tags.some((tag) => tag.toLowerCase().includes(query))) // Corrected for array
		);
		displayItems(filteredItems); // Display filtered items
	});

	fetchItems(); // Fetch items when the page loads
});
