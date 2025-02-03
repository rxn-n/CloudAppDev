const itemForm = document.getElementById("item-form");

// Handle item submission
itemForm.addEventListener("submit", async function (event) {
	event.preventDefault();

	const itemName = document.getElementById("itemName").value;
	const itemDescription = document.getElementById("itemDescription").value;
	const itemImage = document.getElementById("itemImage").files[0];

	if (!itemImage) {
		alert("Please upload an image.");
		return;
	}

	// Step 1: Upload the image to S3
	const itemUrl = await uploadImageToS3(itemImage);
	if (!itemUrl) {
		alert("Failed to upload image. Please try again.");
		return;
	}

	const itemTags = getSelectedTags(); // Call this function before submitting the form

	const item = {
		Name: itemName,
		Description: itemDescription,
		ItemURL: itemUrl,
		Tags: itemTags, // Send tags as an array
	};

	const success = await addItemToDynamoDB(item);
	if (success) {
		alert("Item successfully added!");
		window.location.href = "index.html"; // Redirect to homepage
	}
});

// Step 1: Upload image to S3
async function uploadImageToS3(file) {
	const fileName = `lost-item-${Date.now()}-${file.name}`;
	const s3Url = `https://lost-and-found-images-bucket.s3.us-east-1.amazonaws.com/${fileName}`;

	try {
		const s3UploadResponse = await fetch(s3Url, {
			method: "PUT",
			body: file,
			headers: {
				"Content-Type": file.type,
			},
		});

		if (!s3UploadResponse.ok) {
			throw new Error("Error uploading image to S3");
		}

		return s3Url;
	} catch (error) {
		console.error("Error uploading image to S3:", error);
		return null;
	}
}

// Step 2: Storing the tags

function getSelectedTags() {
	const checkboxes = document.querySelectorAll('input[name="tags"]:checked');
	return Array.from(checkboxes).map((cb) => cb.value);
	}

// Step 3: Add item details to DynamoDB
async function addItemToDynamoDB(item) {
	try {
		const response = await fetch(
			"https://508qfwa0x8.execute-api.us-east-1.amazonaws.com/productions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(item),
			}
		);

		const data = await response.json();
		console.log("DynamoDB response:", data);

		if (!response.ok) {
			throw new Error("Error adding item to DynamoDB: " + data.error);
		}

		return true;
	} catch (error) {
		console.error("Error adding item to DynamoDB:", error);
		alert("Failed to add item.");
		return false;
	}
}
