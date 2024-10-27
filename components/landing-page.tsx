'use client'


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music, Play, Pause } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

export function LandingPage() {
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }
  const session = useSession();
  
  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-950 text-gray-100 pt-4">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800 bg-gray-900">
        <Link className="flex items-center justify-center" href="#">
          <Music className="h-6 w-6 text-purple-400" />
          <span className="ml-2 text-lg font-bold text-purple-400">Muzy</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {session.data?.user && <Button className="bg-purple-500 hover:bg-purple-600 text-white " onClick={() => signOut()}>Logout</Button>}
          {!session.data?.user && <Button className="bg-purple-500 hover:bg-purple-600 text-white" onClick={() => signIn()}>Signin</Button>}
          
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-gray-900 to-gray-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                  Stream Your Music to the World
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Connect with your fans through live music streaming. Share your passion and grow your audience.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">Get Started</Button>
                <Button variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-400/10">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 text-purple-400">
              How It Works
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border border-gray-800 p-6 rounded-lg bg-gray-950 hover:border-purple-400 transition-colors">
                <Music className="h-12 w-12 mb-2 text-purple-400" />
                <h3 className="text-xl font-bold text-purple-400">Create Your Stream</h3>
                <p className="text-sm text-gray-400 text-center">
                  Set up your streaming channel in minutes.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-gray-800 p-6 rounded-lg bg-gray-950 hover:border-purple-400 transition-colors">
                <Play className="h-12 w-12 mb-2 text-blue-400" />
                <h3 className="text-xl font-bold text-blue-400">Go Live</h3>
                <p className="text-sm text-gray-400 text-center">
                  Start your live music stream with just one click.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-gray-800 p-6 rounded-lg bg-gray-950 hover:border-purple-400 transition-colors">
                <Music className="h-12 w-12 mb-2 text-purple-400" />
                <h3 className="text-xl font-bold text-purple-400">Grow Your Fanbase</h3>
                <p className="text-sm text-gray-400 text-center">
                  Engage with your fans and build a loyal community.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-950">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 text-blue-400">
              Experience the Stream
            </h2>
            <div className="mx-auto max-w-sm space-y-4">
              <div className="rounded-lg border border-gray-800 bg-gray-900 shadow-lg shadow-purple-500/10" data-v0-t="card">
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-center text-purple-400">Now Playing</h3>
                  <div className="space-y-2">
                    <div className="text-center text-gray-300">Artist Name - Song Title</div>
                    <div className="h-4 rounded-full bg-gray-800">
                      <div className="h-4 rounded-full bg-gradient-to-r from-purple-400 to-blue-500" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button size="icon" variant="outline" onClick={togglePlay} className="text-purple-400 border-purple-400 hover:bg-purple-400/10">
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-t from-gray-900 to-gray-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-purple-400">Start Streaming Today</h2>
                <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join creators who are sharing their music with the world. Sign up now!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1 bg-gray-800 border-gray-700 focus:border-purple-400" placeholder="Enter your email" type="email" />
                  <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">Sign Up</Button>
                </form>
                <p className="text-xs text-gray-400">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2 hover:text-purple-400 transition-colors" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800 bg-gray-900">
        <p className="text-xs text-gray-400">© 2024 Muzy. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:text-purple-400 transition-colors" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:text-purple-400 transition-colors" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}