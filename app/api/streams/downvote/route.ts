import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const DownvoteSchema = z.object({
    streamId: z.string(),
})

export async function POST(req: NextRequest) { 
    const session = await getServerSession();
    // TODO: You can get rid of DB call here by integrating id with next-auth
    
    const user = await prismaClient.user.findFirst({
        where:{ 
            email: session?.user?.email || ""
        }
    })

    if(!user) {
        return NextResponse.json({
            msg: "Unauthenticated"
        }, {
            status: 411
        })
    }

    try {
        const data = DownvoteSchema.parse(req.json());
        await prismaClient.upvote.delete({
            where: {
                userId_streamId: {
                    userId: user.id,
                    streamId: data.streamId
                }
                
            }
        });
        return NextResponse.json({
            msg: "Done!"
        })
    } catch(e) {
        console.log(e);
        return NextResponse.json({
            msg: "Error while downvoting"
        }, {
            status: 411
        })
    }
}