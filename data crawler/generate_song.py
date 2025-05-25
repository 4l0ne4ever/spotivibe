import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import json
# Spotify API credentials (replace with your own from Spotify Developer Dashboard)
CLIENT_ID = 'your_client_id_here'
CLIENT_SECRET = 'your_client_secret_here'


sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET))

def ms_to_seconds(ms):
    """Convert milliseconds to seconds (integer)."""
    return round(ms / 1000)

def fetch_songs(query, limit=10):
    """Fetch songs from Spotify API based on a search query, excluding tracks without preview_url."""
    results = sp.search(q=query, type='track', limit=limit, market='US')
    songs = []
    
    for track in results['tracks']['items']:
        if track['preview_url']:  
            song_data = {
                'title': track['name'],
                'artist': ', '.join(artist['name'] for artist in track['artists']),
                'imageUrl': track['album']['images'][0]['url'] if track['album']['images'] else None,
                'audioUrl': track['preview_url'],
                'duration': ms_to_seconds(track['duration_ms'])
            }
            songs.append(song_data)
    
    return songs

def save_to_js(data, filename='songs.js'):
    """Save song data to a JavaScript file as const songs = [...]."""
    js_content = "const songs = [\n"
    for song in data:
        js_content += f"  {{\n"
        js_content += f"    title: \"{song['title'].replace('\"', '\\\"')}\",\n"
        js_content += f"    artist: \"{song['artist'].replace('\"', '\\\"')}\",\n"
        js_content += f"    imageUrl: \"{song['imageUrl']}\",\n"
        js_content += f"    audioUrl: \"{song['audioUrl']}\",\n"
        js_content += f"    duration: {song['duration']},\n"
        js_content += "  },\n"
    js_content += "];\n\nexport default songs;"
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"Saved {len(data)} songs to {filename}")

def main():
    query = 'genre:pop year:2023-2024'
    limit = 50
    
    try:
        songs = fetch_songs(query, limit)
        if not songs:
            print("No songs found with valid preview URLs. Try a different query.")
            return
        print("Fetched songs:")
        for song in songs:
            print(f"Title: {song['title']}, Artist: {song['artist']}, Duration: {song['duration']}s")
        
        # Save to JavaScript file
        save_to_js(songs)
    
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()