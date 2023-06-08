function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append("file", file);

  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("File upload failed");
      }
      console.log("File uploaded successfully");
    })
    .catch((error) => {
      console.error(error);
    });
}

function fetchFileList() {
  fetch("/files")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch file list");
      }
      return response.json();
    })
    .then((fileList) => {
      const fileSelect = document.getElementById("fileSelect");
      fileList.forEach((fileName) => {
        const option = document.createElement("option");
        option.text = fileName;
        fileSelect.add(option);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}
function downloadFile() {
  const fileSelect = document.getElementById("fileSelect");
  const fileName = fileSelect.value;

  fetch("/download/" + fileName)
    .then((response) => {
      if (!response.ok) {
        throw new Error("File download failed");
      }
      return response.blob();
    })
    .then((blob) => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      console.error(error);
    });
}
fetchFileList();
