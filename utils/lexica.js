import axios from "axios";

const lexicaUrl = `https://lexica.art/api/v1`;



const axiosInstance = axios.create({
    baseURL: lexicaUrl,
});

export const fetchImages = async (query) => {
    try {
        const response = await axiosInstance.get(`/search`, {
            params: {
                q: query, 
            },
            });
        return response.data.images;
    } catch (error) {
        console.error("Error fetching records:", error);
        throw error;
    }
};