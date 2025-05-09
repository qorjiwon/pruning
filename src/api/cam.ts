import axios from "axios";

export const uploadImage = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("image", file);
    await axios.post("/upload_image/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};