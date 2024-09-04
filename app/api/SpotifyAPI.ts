import querystring from "querystring";

// Define the endpoint URLs
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

// Fetch environment variables
const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.REACT_APP_SPOTIFY_REFRESH_TOKEN;

if (!client_id || !client_secret || !refresh_token) {
    throw new Error("Spotify credentials are not set in environment variables.");
}

// Helper function to encode credentials to base64
const toBase64 = (str: string): string => Buffer.from(str).toString('base64');

// Define types for the Spotify API responses
interface AccessTokenResponse {
    access_token: string;
}

interface Artist {
    name: string;
}

interface AlbumImage {
    url: string;
}

interface SongItem {
    artists: Artist[];
    external_urls: {
        spotify: string;
    };
    name: string;
    album: {
        images: AlbumImage[];
        name: string;
    };
    duration_ms: number;
}

interface NowPlayingResponse {
    is_playing: boolean;
    item: SongItem;
    progress_ms: number;
}

// Function to get an access token from Spotify
const getAccessToken = async (): Promise<AccessTokenResponse> => {
    const basicAuth = toBase64(`${client_id}:${client_secret}`);

    const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: { 
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: querystring.stringify({ grant_type: "refresh_token", refresh_token }),
    });

    if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    return response.json();
};

// Function to get the currently playing track from Spotify
const fetchNowPlaying = async (accessToken: string): Promise<NowPlayingResponse | false> => {
    const response = await fetch(NOW_PLAYING_ENDPOINT, { 
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status === 204 || response.status > 400) {
        return false;
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch now playing: ${response.statusText}`);
    }

    return response.json();
};

// Function to get the details of the currently playing item
export default async function getNowPlayingItem(): Promise<{
    artist: string;
    isPlaying: boolean;
    songUrl: string;
    title: string;
    albumImageUrl: string;
    progressMs: number;
    durationMs: number;
    albumName: string;
} | false> {
    try {
        const { access_token } = await getAccessToken();
        const nowPlaying = await fetchNowPlaying(access_token);

        if (!nowPlaying) {
            return false;
        }

        const { item, is_playing, progress_ms } = nowPlaying;
        const { artists, external_urls, name, album, duration_ms } = item;
        const albumImageUrl = album.images[0]?.url || "";

        return {
            artist: artists.map(artist => artist.name).join(", "),
            isPlaying: is_playing,
            songUrl: external_urls.spotify,
            title: name,
            albumImageUrl,
            progressMs: progress_ms,
            durationMs: duration_ms,
            albumName: album.name,
        };
    } catch (error) {
        console.error("Error fetching now playing item:", error);
        return false;
    }
}
