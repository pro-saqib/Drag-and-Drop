const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const progressBar = document.getElementById('progressBar');
const uploadStatus = document.getElementById('uploadStatus');
const uploadedFiles = document.getElementById('uploadedFiles');

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragover');
    handleFiles(event.dataTransfer.files);
});

dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
});

function handleFiles(files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
    }
    uploadFiles(formData, files);
}

function uploadFiles(formData, files) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload'); // Endpoint for file uploads

    xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            progressBar.style.width = percentComplete + '%';
            progressBar.setAttribute('aria-valuenow', percentComplete);
            progressBar.textContent = Math.round(percentComplete) + '%';
        }
    });

    xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
            uploadStatus.textContent = 'Upload complete!';
            displayUploadedFiles(files);
        } else {
            uploadStatus.textContent = 'Upload failed. Server returned status: ' + xhr.status;
            console.error('Upload failed. Server returned status:', xhr.status, xhr.statusText);
        }
    });

    xhr.addEventListener('error', () => {
        uploadStatus.textContent = 'Upload failed. An error occurred during the transaction.';
        console.error('Upload failed due to an error.');
    });

    xhr.send(formData);
}

function displayUploadedFiles(files) {
    uploadedFiles.innerHTML = '';
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileItem = document.createElement('div');
        fileItem.className = 'col-3 mb-3';

        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'thumbnail-container';

        const thumbnail = document.createElement('img');
        thumbnail.className = 'thumbnail';
        thumbnail.src = URL.createObjectURL(file);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', () => {
            fileItem.remove();
        });

        const fileDetails = document.createElement('div');
        fileDetails.className = 'alert alert-success mt-2';
        fileDetails.textContent = `File: ${file.name} (Size: ${file.size} bytes)`;

        thumbnailContainer.appendChild(thumbnail);
        thumbnailContainer.appendChild(deleteButton);
        fileItem.appendChild(thumbnailContainer);
        fileItem.appendChild(fileDetails);
        uploadedFiles.appendChild(fileItem);
    }
}
