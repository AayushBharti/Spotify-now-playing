"use client"
import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import getNowPlayingItem from "@/app/api/SpotifyAPI"

interface Result {
  isPlaying: boolean
  albumImageUrl: string
  songUrl: string
  title: string
  artist: string
  progressMs: number
  durationMs: number
}

const SpotifyPlayer: React.FC = () => {
  const [result, setResult] = useState<Result | null>(null)

  // Function to fetch and update the now playing item
  const fetchNowPlaying = async () => {
    try {
      const nowPlayingItem = await getNowPlayingItem()
      if (nowPlayingItem) {
        setResult(nowPlayingItem)
      }
    } catch (error) {
      console.error("Error fetching now playing item:", error)
    }
  }

  // Initial fetch and set up polling
  useEffect(() => {
    fetchNowPlaying() // Initial fetch

    const interval = setInterval(() => {
      fetchNowPlaying()
    }, 30000) // 30 seconds interval

    return () => clearInterval(interval) // Clean up interval on unmount
  }, [])

  return (
    <div
      className="w-screen h-screen bg-center bg-cover relative"
      style={{
        backgroundImage: result?.isPlaying ? `url(${result.albumImageUrl})` : "url(/bg.jpg)",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-25 backdrop-blur-lg" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bgO-gray-900 rounded-lg w-72 p-4 z-10 ">
        {result?.isPlaying ? (
          <a
            href={result.songUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center text-center"
          >
            <div className="w-full mb-2">
              <img
                src={result.albumImageUrl}
                alt={`Album cover for ${result.title}`}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
            <div className="flex flex-col items-center mt-3">
              <div className="text-lg font-extrabold drop-shadow-lg">{result.title}</div>
              <div className="text-sm font-medium mb-1  drop-shadow-lg">{result.artist}</div>
              <ProgressBar
                completed={result.progressMs}
                maxCompleted={result.durationMs}
                bgColor="#f2f2f2"
                height="6px"
                labelColor="#f2f2f2"
                baseBgColor="#121212"
                transitionDuration="0s"
                className="mt-2"
              />
            </div>
          </a>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-full mb-2">
              <img src="/spotify.png" alt="music" className="w-full rounded-lg drop-shadow-lg" />
            </div>
            <div className="text-lg font-extrabold drop-shadow-2xl">Not Listening - Spotify</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpotifyPlayer
