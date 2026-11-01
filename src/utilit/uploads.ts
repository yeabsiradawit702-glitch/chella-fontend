
import axios from "axios";
import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile: File) => {
  const formData = new FormData();

  // Append image file to form data
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error uploading the image:",
        error.response?.data || error.message
      );
    } else if (error instanceof Error) {
      console.error("Error uploading the image:", error.message);
    }

    throw error;
  }
};

export default uploadImage;
