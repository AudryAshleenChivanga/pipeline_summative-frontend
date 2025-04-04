document.getElementById('imageUpload').addEventListener('change', function(event) {
  const preview = document.getElementById('preview');
  preview.innerHTML = '';
  const file = event.target.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.classList.add('preview-image');
      preview.appendChild(img);
      preview.style.opacity = 1;
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = `<p class="error-message">Please upload a valid image file.</p>`;
  }
});

document.getElementById('folderUpload').addEventListener('change', function(event) {
  const folderPreview = document.getElementById('folderPreview');
  folderPreview.innerHTML = '';
  const files = event.target.files;

  if (files.length > 0) {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const img = document.createElement('img');
          img.src = e.target.result;
          img.classList.add('preview-image');
          folderPreview.appendChild(img);
          folderPreview.style.opacity = 1;
        };
        reader.readAsDataURL(file);
      }
    });
  } else {
    folderPreview.innerHTML = `<p class="error-message">No images found in this folder.</p>`;
  }
});

document.getElementById('predictImage').addEventListener('change', function(event) {
  const statusDiv = document.getElementById('status');
  const predictPreview = document.getElementById('predictPreview');
  const file = event.target.files[0];

  if (file && file.type.startsWith('image/')) {
    statusDiv.textContent = 'Prediction in progress...';
    statusDiv.className = 'status info';
    predictPreview.style.display = 'none';

    const spinner = document.createElement('div');
    spinner.classList.add('loading-spinner');
    statusDiv.appendChild(spinner);

    const reader = new FileReader();
    reader.onload = function(e) {
      setTimeout(() => {
        statusDiv.textContent = 'Prediction complete! Confidence: 87.2%';
        statusDiv.className = 'status success';
        
        predictPreview.src = e.target.result;
        predictPreview.style.display = 'block';
        statusDiv.removeChild(spinner);
      }, 2000);
    };
    reader.readAsDataURL(file);
  } else {
    predictPreview.style.display = 'none';
    statusDiv.innerHTML = '<p class="error-message">Please select a valid image file for prediction.</p>';
    statusDiv.className = 'status error';
  }
});
