"use client"
import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Play, Share2 } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Appbar } from '../components/Appbar'
//@ts-expect-error new
import YouTubePlayer from 'youtube-player';

interface Video {
    id: string;
    type: string;
    url: string;
    extractedId: string;
    title: string;
    smallImg: string;
    bigImg: string;
    active: boolean;
    userId: string;
    upvotes: number;
    haveUpvoted: boolean;
}

// Define YouTube player types
interface YouTubePlayerState {
    data: number;
}

type YouTubePlayerInstance = ReturnType<typeof YouTubePlayer>;

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function StreamView({
    creatorId,
    playVideo = false
}: {
    creatorId: string;
    playVideo: boolean;
}) {
    const [inputLink, setInputLink] = useState('');
    const [queue, setQueue] = useState<Video[]>([]);
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(false);
    const [playNextLoader, setPlayNextLoader] = useState(false);
    const videoPlayerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YouTubePlayerInstance | null>(null);

    const refreshStreams = useCallback(async () => {
        const res = await fetch(`/api/streams/?creatorId=${creatorId}`, {
            credentials: "include"
        });
        const json: { streams: Video[], activeStream: { stream: Video } } = await res.json();
        setQueue(json.streams.sort((a: Video, b: Video) => b.upvotes - a.upvotes));

        setCurrentVideo(video => {
            if (video?.id === json.activeStream?.stream?.id) {
                return video;
            }
            return json.activeStream.stream;
        });
    }, [creatorId]);

    useEffect(() => {
        refreshStreams();
        const interval = setInterval(() => {
            refreshStreams();
        }, REFRESH_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [refreshStreams]);

    useEffect(() => {
        if (!videoPlayerRef.current) {
            return;
        }
        playerRef.current = YouTubePlayer(videoPlayerRef.current);
        
        if (currentVideo) {
            playerRef.current.loadVideoById(currentVideo.extractedId);
            playerRef.current.playVideo();

            playerRef.current.on('stateChange', (event: YouTubePlayerState) => {
                if (event.data === 0) { // Video ended
                    playNext();
                }
            });
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        }
    }, [currentVideo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/streams/", {
            method: "POST",
            body: JSON.stringify({
                creatorId,
                url: inputLink
            })
        });
        const newVideo = await res.json();
        setQueue([...queue, newVideo]);
        setLoading(false);
        setInputLink('');
    }

    const handleVote = (id: string, isUpvote: boolean) => {
        setQueue(queue.map(video =>
            video.id === id
                ? {
                    ...video,
                    upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
                    haveUpvoted: !video.haveUpvoted
                }
                : video
        ).sort((a, b) => b.upvotes - a.upvotes));
        fetch(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
            method: "POST",
            body: JSON.stringify({
                streamId: id
            })
        });
    }

    const playNext = async () => {
        if (queue.length > 0) {
            try {
                setPlayNextLoader(true);
                const data = await fetch('/api/streams/next', {
                    method: "GET",
                });
                const json = await data.json();
                setCurrentVideo(json.stream);
                setQueue(q => q.filter(x => x.id !== json.stream?.id));
            } catch (e) {
                console.error('Failed to fetch next video', e);
            }
            setPlayNextLoader(false);
        }
    }

    const handleShare = () => {
        const shareableLink = `${window.location.hostname}/creator/${creatorId}`;
        navigator.clipboard.writeText(shareableLink).then(() => {
            toast.success('Link copied to clipboard!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }, (err) => {
            console.error('Could not copy text: ', err);
            toast.error('Failed to copy link. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });
    }

    return (
        <div className="flex flex-col min-h-screen bg-[rgb(10,10,10)] text-gray-200">
            <Appbar />
            <div className='flex justify-center'>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-5 w-screen max-w-screen-xl pt-8">
                    <div className='col-span-3'>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Upcoming Songs</h2>
                            {queue.length === 0 && (
                                <Card className="bg-gray-900 border-gray-800 w-full">
                                    <CardContent className="p-4"><p className="text-center py-8 text-gray-400">No videos in queue</p></CardContent>
                                </Card>
                            )}
                            {queue.map((video) => (
                                <Card key={video.id} className="bg-gray-900 border-gray-800">
                                    <CardContent className="p-4 flex items-center space-x-4">
                                        <img
                                            src={video.smallImg}
                                            alt={`Thumbnail for ${video.title}`}
                                            className="w-30 h-20 object-cover rounded"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-white">{video.title}</h3>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleVote(video.id, !video.haveUpvoted)}
                                                    className="flex items-center space-x-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                                                >
                                                    {video.haveUpvoted ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                                                    <span>{video.upvotes}</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div className='col-span-2'>
                        <div className="max-w-4xl mx-auto p-4 space-y-6 w-full">
                            <div className="flex justify-between items-center">
                                <h1 className="text-xl font-bold text-white">Add a song</h1>
                                <Button onClick={handleShare} className="bg-purple-700 hover:bg-purple-800 text-white">
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                </Button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="Paste YouTube link here"
                                    value={inputLink}
                                    onChange={(e) => setInputLink(e.target.value)}
                                    className="bg-gray-900 text-white border-gray-700 placeholder-gray-500"
                                />
                                <Button disabled={loading} type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white">
                                    {loading ? "Loading..." : "Add to Queue"}
                                </Button>
                            </form>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">Now Playing</h2>
                                <Card className="bg-gray-900 border-gray-800">
                                    <CardContent className="p-4">
                                        {currentVideo ? (
                                            <div>
                                                {playVideo ? (
                                                    <div ref={videoPlayerRef} className='w-full' />
                                                ) : (
                                                    <>
                                                        <img
                                                            src={currentVideo.bigImg}
                                                            className="w-full h-72 object-cover rounded"
                                                        />
                                                        <p className="mt-2 text-center font-semibold text-white">{currentVideo.title}</p>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-center py-8 text-gray-400">No video playing</p>
                                        )}
                                    </CardContent>
                                </Card>
                                {playVideo && (
                                    <Button disabled={playNextLoader} onClick={playNext} className="w-full bg-purple-700 hover:bg-purple-800 text-white">
                                        <Play className="mr-2 h-4 w-4" /> {playNextLoader ? "Loading..." : "Play next"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    )
}