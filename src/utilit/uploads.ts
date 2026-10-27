import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosInstance";
const uploadImage = async (imageFile)=>{
    const formData = new FormData();
    //appende image file to form data
    formData.append('image',imageFile)
    try{
         const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData
    );

    return response.data;
    } catch(error){
        console.error('error uploading the image: ', error.response?.data || error.message);
        throw error ;//ask what does it mean


    }
};
export default uploadImage;
