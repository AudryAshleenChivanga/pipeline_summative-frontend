// Handle Image Upload and Prediction
async function uploadImage() {
    const imageInput = document.getElementById("imageInput");
    const predictionResult = document.getElementById("predictionResult");
    const imagePreview = document.getElementById("imagePreview");
    
    // Clear previous image and result
    imagePreview.innerHTML = '';
    predictionResult.innerHTML = '';

    if (!imageInput.files || imageInput.files.length === 0) {
        alert("Please upload an image.");
        return;
    }

    // Display uploaded image preview inside a frame
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onloadend = function () {
        const img = document.createElement("img");
        img.src = reader.result;
        imagePreview.appendChild(img);
        imagePreview.style.display = "block"; // Show the image preview after it's loaded
    };
    reader.readAsDataURL(file);

    // Show loading bar for prediction
    const loadingBar = document.createElement("div");
    loadingBar.classList.add("loading-bar");
    loadingBar.innerHTML = `<div></div>`;
    predictionResult.appendChild(loadingBar);

    const loadingDiv = loadingBar.querySelector("div");

    // Simulate image processing and prediction with a 2-minute loading
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        loadingDiv.style.width = `${progress}%`;

        if (progress === 100) {
            clearInterval(interval);
            // Simulate prediction result (replace with actual API call)
            predictionResult.innerHTML = `<p>Predicted Result: Low Risk of Glaucoma</p>`;
        }
    }, 1200); // 2 minutes (1200ms * 5 steps for completion)
}

// Simulate Retraining Process by calling an API
async function retrainModel() {
    const retrainStatus = document.getElementById("retrainStatus");
    const retrainResult = document.getElementById("retrainResult");

    retrainStatus.innerHTML = "<p>Retraining the model...</p>";

    // Show loading bar for retraining
    const loadingBar = document.createElement("div");
    loadingBar.classList.add("loading-bar");
    loadingBar.innerHTML = `<div></div>`;
    retrainResult.appendChild(loadingBar);

    const loadingDiv = loadingBar.querySelector("div");

    // Simulate retraining process
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        loadingDiv.style.width = `${progress}%`;

        if (progress === 100) {
            clearInterval(interval);
            retrainStatus.innerHTML = "<p>Model retrained successfully!</p>";

            // Simulate retraining results (replace with actual results from your images directory)
            retrainResult.innerHTML = `<p>Retraining results displayed here</p>`;
        }
    }, 1200); // 2 minutes (1200ms * 5 steps for completion)
}
