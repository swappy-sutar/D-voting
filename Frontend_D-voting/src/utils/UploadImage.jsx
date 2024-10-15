import axios from "axios";
const apiurl = import.meta.env.backend_URL;

const UploadImage = async (file, storagePath) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "x-access-token": token,
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await axios.post(
      `${apiurl}/api/v1/${storagePath}`,
      formData,
      config
    );

    return res.data.imageUrl;
  } catch (error) {
    console.error("Error occurred during image upload:", error);
    throw error;
  }
};

export { UploadImage };
