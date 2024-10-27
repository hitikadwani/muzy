import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios"; // Import axios
import { YT_REGEX } from "@/app/lib/utils";
import { getServerSession } from "next-auth";

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
});
const MAX_QUEUE_LEN = 20;

export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = data.url.match(YT_REGEX);
        if (!isYt) {
            return NextResponse.json({
                message: "Wrong URL format"
            }, {
                status: 411
            });
        }

        const extractedId = data.url.split("?v=")[1];
        
        // Make a request to the YouTube Data API
        const apiKey = process.env.YOUTUBE_API_KEY; // Ensure you have your API key set in your environment variables
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${extractedId}&key=${apiKey}&part=snippet`;

        const response = await axios.get(apiUrl);
        console.log(response);

        if (!response.data.items || response.data.items.length === 0) {
            return NextResponse.json({
                message: "No video data found"
            }, {
                status: 404
            });
        }
        
        const videoDetails = response.data.items[0];

        if (!videoDetails) {
            return NextResponse.json({
                message: "Video not found"
            }, {
                status: 404
            });
        }

        const thumbnails = videoDetails.snippet.thumbnails;
      
        
        const existingActiveStream = await prismaClient.stream.count({
            where: {
                userId: data.creatorId
            }
        });
        if (existingActiveStream >= MAX_QUEUE_LEN) {
            return NextResponse.json({
                message: "Already at limit"
            }, {
                status: 411
            });
        }

        const stream = await prismaClient.stream.create({
          data: {
            userId: data.creatorId,
            url: data.url,
            extractedId,
            type: "Youtube",
            title: videoDetails.snippet.title || "Can't find video",
            smallImg: thumbnails?.medium?.url || "default_img_url",
            bigImg: thumbnails?.high?.url || "default_img_url"
        }
      });

        return NextResponse.json({
            ...stream,
            hasUpvoted: false,
            upvotes: 0
        });
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            message: "Error while adding a stream"
        }, {
            status: 411
        });
    }
}
export async function GET() {
    // Get session and fetch the authenticated user
    const session = await getServerSession();
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    });

    if (!user) {
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        });
    }

    // Use the authenticated user's ID as creatorId instead of from query string
    const creatorId = user.id;

    const [streams, activeStream] = await Promise.all([
        prismaClient.stream.findMany({
            where: {
                userId: creatorId,
                played: false
            },
            include: {
                _count: {
                    select: {
                        upvotes: true
                    }
                },
                upvotes: {
                    where: {
                        userId: user.id
                    }
                }
            }
        }),
        prismaClient.currentStream.findFirst({
            where: {
                userId: creatorId
            },
            include: {
                stream: true
            }
        })
    ]);

    return NextResponse.json({
        streams: streams.map(({ _count, ...rest }) => ({
            ...rest,
            upvotes: _count.upvotes,
            haveUpvoted: rest.upvotes.length ? true : false
        })),
        activeStream
    });
}
