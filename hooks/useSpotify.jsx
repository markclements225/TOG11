import { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'

const SpotifyAPI = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
})

function useSpotify() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session) {
      if (session.error === 'RefreshAccessTokenError') {
        signIn()
      }

      SpotifyAPI.setAccessToken(session.user.accessToken)
    }
  }, [session])

  return SpotifyAPI
}

export default useSpotify
