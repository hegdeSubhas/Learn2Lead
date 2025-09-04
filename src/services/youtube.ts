
export interface YouTubeVideo {
    videoId: string;
    title: string;
    description: string;
    channelTitle: string;
    thumbnail: string;
}

const MOCK_YOUTUBE_VIDEOS: YouTubeVideo[] = [
    {
        videoId: '2LhoCfjm8R4',
        title: 'Learn JavaScript - Full Course for Beginners',
        description: 'This complete 134-part JavaScript tutorial for beginners will teach you everything you need to know to get started with the JavaScript programming language.',
        channelTitle: 'freeCodeCamp.org',
        thumbnail: 'https://i.ytimg.com/vi/2LhoCfjm8R4/hqdefault.jpg'
    },
    {
        videoId: '8hly31xKli0',
        title: 'Java Full Course for free ☕',
        description: 'Java is one of the most popular programming languages. This video provides a complete introduction to Java, helping you master the language from scratch.',
        channelTitle: 'Bro Code',
        thumbnail: 'https://i.ytimg.com/vi/8hly31xKli0/hqdefault.jpg'
    },
    {
        videoId: 'G3e-cpL7ofc',
        title: 'Python for Beginners - Full Course [Programming Tutorial]',
        description: 'This Python course provides a complete introduction to Python. It is designed for beginners and covers all the fundamental concepts.',
        channelTitle: 'freeCodeCamp.org',
        thumbnail: 'https://i.ytimg.com/vi/G3e-cpL7ofc/hqdefault.jpg'
    }
]

const videoCategoryQueries: Record<string, string> = {
    general: 'indian student programming tutorials',
    web: 'web development tutorials for beginners india',
    data: 'data science tutorials for beginners india',
    mobile: 'mobile app development tutorials india',
    ai: 'ai and machine learning tutorials india',
    cybersecurity: 'cybersecurity tutorials for beginners india',
    commerce: 'commerce and finance tutorials for indian students',
    arts: 'arts and humanities educational videos for indian students',
};


export async function getYoutubeVideos(category: string = "general"): Promise<YouTubeVideo[]> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const query = videoCategoryQueries[category] || videoCategoryQueries['general'];

    if (!apiKey) {
        console.warn("YOUTUBE_API_KEY is not set. Returning mock data.");
        return MOCK_YOUTUBE_VIDEOS;
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=8&key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`YouTube API error: ${errorData.error.message}`);
        }
        const data = await response.json();
        
        return data.items.map((item: any) => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            channelTitle: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.high.url,
        }));

    } catch (error) {
        console.error("Error fetching from YouTube API:", error);
        throw error;
    }
}
