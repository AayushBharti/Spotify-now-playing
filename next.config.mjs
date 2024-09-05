const nextConfig = {
  reactStrictMode: true,
  env: {
    // Environment variables accessible on the client side
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
    NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN: process.env.NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN,
  },
}

export default nextConfig
