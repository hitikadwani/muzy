"use client"

import 'react-toastify/dist/ReactToastify.css'
import StreamView from '../components/StreamView'


const creatorId = "cc64dfc0-36f2-42e3-bad7-b0b40e0b9ab6"
export default function Component() {
    return <StreamView creatorId={creatorId} playVideo={true} />
}