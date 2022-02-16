import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline'
import {
  RewindIcon,
  SwitchHorizontalIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid'
import { debounce } from 'lodash'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSongInfo from '../hooks/useSongInfo'
import useSpotify from '../hooks/useSpotify'

function Player() {
  const SpotifyAPI = useSpotify()
  const { data: session, status } = useSession()
  const [currentTrackId, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(50)
  const songInfo = useSongInfo()

  const fetchCurrentSong = () => {
    if (!songInfo) {
      SpotifyAPI.getMyCurrentPlayingTrack().then((data) => {
        setCurrentIdTrack(data.body?.item.id)

        SpotifyAPI.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing)
        })
      })
    }
  }

  const handlePlayPause = () => {
    SpotifyAPI.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        SpotifyAPI.pause()
        setIsPlaying(false)
      } else {
        SpotifyAPI.play()
        setIsPlaying(true)
      }
    })
  }

  useEffect(() => {
    if (SpotifyAPI.getAccessToken() && !currentTrackId) {
      fetchCurrentSong()
      setVolume(50)
    }
  }, [currentTrackIdState, SpotifyAPI, session])

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      SpotifyAPI.setVolume(volume).catch((err) => {})
    }, 500),
    []
  )

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume)
    }
  }, [volume])

  return (
    <div className="grid h-24 grid-cols-3 justify-between bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
      <div className="flex items-center space-x-4">
        <img
          className="hidden h-10 w-10 md:inline"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button h-10 w-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button h-10 w-10" />
        )}
        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>
      <div className="flex items-center justify-end space-x-3 pr-5 md:space-x-4">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  )
}

export default Player
