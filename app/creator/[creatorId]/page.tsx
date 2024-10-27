import StreamView from "@/app/components/StreamView";

type Params = Promise<{ creatorId: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata(props: {
    params: Params;
    searchParams: SearchParams;
}) {
    const params = await props.params;
   
    const creatorId = params.creatorId;

    return {
        title: `Creator ${creatorId}`
    };
}

export default async function Creator(props: {
    params: Params;
    searchParams: SearchParams;
}) {
    const params = await props.params;
   
    const creatorId = params.creatorId;

    return (
        <div>
            <StreamView creatorId={creatorId} playVideo={false} />
        </div>
    );
}