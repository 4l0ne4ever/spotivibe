import {Song} from "../models/song.model.js"
export const getAllSongs = async (req, res, next) => {
    try {
        const songs = await Song.find().sort({createdAt: -1});
        res.status(200).json(songs);
    } catch (error) {
        next(error);
    }
}
// TODO: build an algorithm (ML) to get the songs that made for you, trending and featured one
export const getFeaturedSongs = async (req, res, next) => {
    try{
        // for now, i just get randomly 6 songs from db
        const songs = await Song.aggregate([{
            $sample: { size: 6 }
        }, {
            $project:{
                _id: 1,
                title: 1,
                artist: 1,
                imageUrl:1,
                audioUrl:1,
            }
        }])
        res.status(200).json(songs);
    }
    catch (error) {
        next(error);
    }
}
export const getMadeForYouSongs = async (req, res, next) => {
    try{
        // for now, i just get randomly 4 songs from db
        const songs = await Song.aggregate([{
            $sample: { size: 4 }
        }, {
            $project:{
                _id: 1,
                title: 1,
                artist: 1,
                imageUrl:1,
                audioUrl:1,
            }
        }])
        res.status(200).json(songs);
    }
    catch (error) {
        next(error);
    }
}
export const getTrendingSongs = async (req, res, next) => {
    try{
        // for now, i just get randomly 4 songs from db
        const songs = await Song.aggregate([{
            $sample: { size: 4 }
        }, {
            $project:{
                _id: 1,
                title: 1,
                artist: 1,
                imageUrl:1,
                audioUrl:1,
            }
        }])
        res.status(200).json(songs);
    }
    catch (error) {
        next(error);
    }
}