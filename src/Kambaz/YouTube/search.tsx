import { Link, useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import * as youtubeClient from "./client";
import { Button } from "react-bootstrap";

export default function YouTubeVideoSearch() {
    const [query, setQuery] = useState("");
    const [videos, setVideos] = useState<any[]>([]);
    const { search } = useParams();
    const navigate = useNavigate();
    const searchVideos = async (keyword: string) => {
        const response = await youtubeClient.searchYouTubeKeywords(
            keyword || query);
        setVideos(response);
        if (!keyword) {
            navigate(`/Kambaz/YouTube/${query}`);
        } else {
            navigate(`/Kambaz/YouTube/${keyword}`);
        }
    };
    useEffect(() => {
        const fetchVideos = async () => {
            if (search) {
                setQuery(search);
                await searchVideos(search);
            }
        };
        fetchVideos();
    }, [search]);

    return (
        <div>
            <h2>YouTube Video Search</h2>
            <input value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="form-control mb-2" />
            <Button className="btn btn-primary"
                onClick={async () => { searchVideos(query); }} >
                Search
            </Button>
            {videos && videos.length > 0 && (
                <div className="row">
                    {videos.map((video) => (
                        <div key={video.id.videoId} className="col-4">
                            <div className="card mb-4">
                                <img
                                    src={video.snippet.thumbnails.high.url}
                                    alt={video.snippet.title}
                                    className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">{video.snippet.title}</h5>
                                    <p className="card-text">{video.snippet.description}</p>
                                    <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                        target="_blank" className="btn btn-primary" >
                                        Watch Video
                                    </a>
                                    <Link to={`/Kambaz/YouTube/details/${video.id.videoId}`}
                                        className="btn btn-secondary ms-2">
                                        View Details </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 