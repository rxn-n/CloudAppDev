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

	// Step 2: Store item details in DynamoDB	
	const item = {
		Name: itemName,
		Description: itemDescription,
		ItemURL: itemUrl,
	};

	await addItemToDynamoDB(item);
});

// Step 1: Upload image to S3
async function uploadImageToS3(file) {
	const fileName = `lost-item-${Date.now()}-${file.name}`;
	const s3Url = `https://lost-and-found-images-bucket.s3.us-east-1.amazonaws.com/${fileName}`;

	try {
		// You can use AWS SDK here to directly upload the file to S3
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

// Step 2: Add item details to DynamoDB
async function addItemToDynamoDB(item) {
	fetch("https://508qfwa0x8.execute-api.us-east-1.amazonaws.com/productions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json", // Add this header
		},
		body: JSON.stringify({
			Name: itemName,
			Description: itemDescription,
			ItemURL: imageURL, // Ensure this field is correctly populated
		}),
	});

	console.log(JSON.stringify(item));

	const data = await response.json();
	console.log("DynamoDB response:", data);

	if (!response.ok) {
		alert("Error adding item to DynamoDB.");
	}
}
