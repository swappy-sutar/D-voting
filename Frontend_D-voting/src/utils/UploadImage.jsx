const apiurl = import.meta.env.backend_URL;

const UploadImage = async (file, storagePath) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://d-voting-backend.vercel.app/api/v1/${storagePath}`,
      {
        method: "POST",
        headers: {
          "x-access-token": token,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error("Error occurred during image upload:", error);
    throw error;
  }
};

export { UploadImage };
