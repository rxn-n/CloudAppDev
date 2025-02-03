document.addEventListener("DOMContentLoaded", function () {
    const itemsContainer = document.getElementById("items-container");
    const searchInput = document.getElementById("search");

    async function fetchItems() {
			try {
				const response = await fetch(
					"https://508qfwa0x8.execute-api.us-east-1.amazonaws.com/productions/getItems"
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

				displayItems(data);
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
				// Use item.Name and item.Description as per the API response
				itemDiv.innerHTML = `<h3>${item.Name}</h3><p>${item.Description}</p>`;
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
