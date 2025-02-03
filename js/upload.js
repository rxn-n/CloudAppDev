// Configure AWS SDK
AWS.config.update({
	region: "us-east-1", // Replace with your AWS region
	accesskeyid: "ASIA3VZOX6CC3N2GOERZ",
	secretAccessKey: "=n+BkJz5kKnPtR20APDMWz6FKi3iwjw/sCixKnivI"
});

const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Function to upload the image and metadata to S3 and DynamoDB
async function uploadImage(event) {
	event.preventDefault(); // Prevent the default form submission

	const fileInput = document.getElementById("image-upload");
	const file = fileInput.files[0];

	const itemName = document.getElementById("item-name").value;
	const itemDescription = document.getElementById("item-description").value;

	if (!file) {
		alert("Please choose a file to upload.");
		return;
	}

	// Create a unique filename for the image
	const fileName = `lost-and-found/${Date.now()}-${file.name}`;

	// S3 upload parameters
	const s3Params = {
		Bucket: "lost-and-found-images-bucket", // Your S3 bucket name
		Key: fileName,
		Body: file,
		ContentType: file.type,
		ACL: "public-read", // Allows public access to the image
	};

	try {
		// Upload the image to S3
		const data = await s3.upload(s3Params).promise();
		console.log("Upload success", data);

		// Once the image is uploaded, store the metadata in DynamoDB
		const dynamoParams = {
			TableName: "LostAndFoundItems", // Replace with your DynamoDB table name
			Item: {
				itemId: Date.now().toString(), // Unique ID for the item (can be replaced with UUID)
				itemName: itemName,
				itemDescription: itemDescription,
				imageUrl: data.Location, // URL of the uploaded image in S3
				uploadedAt: new Date().toISOString(),
			},
		};

		// Save the item metadata in DynamoDB
		await dynamoDB.put(dynamoParams).promise();

		alert("Item uploaded and metadata saved successfully!");
	} catch (error) {
		console.error("Error uploading image and saving metadata", error);
		alert("Error uploading image and saving metadata: " + error.message);
	}
}
