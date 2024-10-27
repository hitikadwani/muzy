"use client"

import 'react-toastify/dist/ReactToastify.css'
import StreamView from '../components/StreamView'


const creatorId = "704cffdb-e164-4847-832e-7169ecda3638"
export default function Component() {
    return <StreamView creatorId={creatorId} playVideo={true} />
}