import { useNavigate, useParams } from "react-router-dom";
import * as videoClient from "./client";
import { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";

export default function YouTubeVideoDetails() {
    const navigate = useNavigate();
    const { videoId } = useParams();
    const [video, setVideo] = useState<any>(null);
    const fetchVideoDetails = async () => {
        const videoDetails = await videoClient
            .getYouTubeVideoDetails(videoId!);
        setVideo(videoDetails);
    };
    useEffect(() => {
        fetchVideoDetails();
    }, [videoId]);
    if (!video) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2><IoChevronBack onClick={() => navigate(-1)} />
                {video.snippet.title}
            </h2>
            {video && (
                <div className="card mb-4">
                    <div className="card-body">
                        <iframe width="100%" height="315" frameBorder="0"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={video.snippet.title}
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">
                            {video.snippet.title}
                        </h5>
                        <p className="card-text">
                            {video.snippet.description}
                        </p>
                        <a target="_blank" className="btn btn-primary"
                            href={`https://www.youtube.com/watch?v=${videoId}`}
                            rel="noopener noreferrer">
                            Watch on YouTube
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}