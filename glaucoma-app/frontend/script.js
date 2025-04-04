async function uploadImage() {
    const imageInput = document.getElementById("imageInput");
    const predictionResult = document.getElementById("predictionResult");
    const imagePreview = document.getElementById("imagePreview");
    imagePreview.innerHTML = '';
    predictionResult.innerHTML = '';
    if (!imageInput.files || imageInput.files.length === 0) {
        alert("Please upload an image.");
        return;
    }
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onloadend = function () {
        const img = document.createElement("img");
        img.src = reader.result;
        imagePreview.appendChild(img);
        imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
    const loadingBar = document.createElement("div");
    loadingBar.classList.add("loading-bar");
    loadingBar.innerHTML = `<div></div>`;
    predictionResult.appendChild(loadingBar);
    const loadingDiv = loadingBar.querySelector("div");
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        loadingDiv.style.width = `${progress}%`;
        if (progress === 100) {
            clearInterval(interval);
            if (CONFIG.useRealAPI) {
                fetch(CONFIG.apiUrl + '/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ file_id: "some_file_id" })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.prediction !== undefined) {
                        predictionResult.innerHTML = `<p>Predicted Result: ${data.prediction === 0 ? "Low Risk of Glaucoma" : "High Risk of Glaucoma"}</p>`;
                    } else {
                        predictionResult.innerHTML = `<p>Error: ${data.error}</p>`;
                    }
                })
                .catch(error => {
                    predictionResult.innerHTML = `<p>Error in prediction.</p>`;
                });
            } else {
                predictionResult.innerHTML = `<p>Predicted Result: Low Risk of Glaucoma</p>`;
            }
        }
    }, 1200);
}

async function retrainModel() {
    const retrainStatus = document.getElementById("retrainStatus");
    const retrainResult = document.getElementById("retrainResult");
    retrainStatus.innerHTML = "<p>Retraining the model...</p>";
    const loadingBar = document.createElement("div");
    loadingBar.classList.add("loading-bar");
    loadingBar.innerHTML = `<div></div>`;
    retrainResult.appendChild(loadingBar);
    const loadingDiv = loadingBar.querySelector("div");
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        loadingDiv.style.width = `${progress}%`;
        if (progress === 100) {
            clearInterval(interval);
            retrainStatus.innerHTML = "<p>Model retrained successfully!</p>";
            if (CONFIG.useRealAPI) {
                fetch(CONFIG.apiUrl + '/retrain', {
                    method: 'POST'
                })
                .then(response => response.json())
                .then(data => {
                    retrainResult.innerHTML = `<p>${data.status}</p>`;
                })
                .catch(error => {
                    retrainStatus.innerHTML = "<p>Error retraining model.</p>";
                });
            } else {
                retrainResult.innerHTML = `<p>Retraining results displayed here</p>`;
            }
        }
    }, 1200);
}
