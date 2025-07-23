import axios from "axios";
const YOUTUBE_API = import.meta.env.VITE_YOUTUBE_API;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const searchYouTubeKeywords = async (query: string) => {
    const response = await axios.get(
        `${YOUTUBE_API}/search?part=snippet&q=${query}&key=${YOUTUBE_API_KEY}`);
    return response.data.items;
};

export const getYouTubeVideoDetails = async (videoId: string) => {
    const response = await axios.get(
        `${YOUTUBE_API}/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`);
    return response.data.items[0];
};