import {create} from 'zustand';
import { Song } from '@/types';

// TODO: Shuffer and smart shuffer, smart queue, loop, repeat
interface PlayerStore {
    currentSong : Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;

    initializeQueue: (songs: Song[]) => void;
    playAlbum: (songs: Song[], startIndex?: number) => void;
    setCurrentSong: (song: Song | null) => void;
    togglePlay: () => void;
    nextSong: () => void;
    previousSong: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,

    initializeQueue: (songs: Song[]) =>{
        set({
            queue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
        })
    },
    playAlbum: (songs: Song[], startIndex=0) =>{
        if(songs.length === 0) return;
        const song = songs[startIndex];
        set({
            queue: songs,
            currentSong: song,
            currentIndex: startIndex,
            isPlaying: true,
        })
    },
    setCurrentSong: (song: Song | null) => {
        if(!song) return;
        const songIndex = get().queue.findIndex(s => s._id === song._id);
        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
        })
    },
    togglePlay: () => {
        const willStartPlaying = !get().isPlaying;

        set({
            isPlaying: willStartPlaying,
        })
    },
    nextSong: () => {
        const {currentIndex, queue} = get()
        const nextIndex = currentIndex + 1;

        if(nextIndex < queue.length){
            const nextSong = queue[nextIndex];
            set({
                currentSong: nextSong,
                currentIndex: nextIndex,
                isPlaying: true,
            })
        } else {
            // If we reach the end of the queue, we can either loop or stop
            // For now, we will just stop
            set({
                isPlaying: false,
            })
        }
    },
    previousSong: () => {
        const {currentIndex, queue} = get()
        const previousIndex = currentIndex - 1;

        if(previousIndex >= 0){
            const previousSong = queue[previousIndex];
            set({
                currentSong: previousSong,
                currentIndex: previousIndex,
                isPlaying: true,
            })
        } else {
            // If we reach the beginning of the queue, we can either loop or stop
            // For now, we will just stop
            set({
                isPlaying: false,
            })
        }
    },

}))