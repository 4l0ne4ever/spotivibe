import {Song} from "../models/song.model.js";
import {Album} from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";
const uploadtoCloudinary = async (file) =>{
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath,{
            resource_type: "auto",
        });
    
    return result.secure_url;
}
    catch (err) {
        console.log("Error uploading to Cloudinary", err);
        throw new Error("Error uploading to Cloudinary");
    }
}
export const createSong = async (req,res,next)=>{
    try{
        if(!req.files || !req.files.audioFile || !req.files.imageFile){
            return res.status(400).json({message: "Please upload both audio and image files"});
        }
        const {title, artist, album, duration} = req.body;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        const audioUrl = await uploadtoCloudinary(audioFile);
        const imageUrl = await uploadtoCloudinary(imageFile);

        const song = new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId : albumId || null,
        })

        await song.save();
        // if song belongs to an album, update the album
        if(albumId){
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id },
            });
        }
        res.status(201).json({
            message: "Song created successfully",
            song,
        });
    } catch(err){
        console.error(err);
        next(err);
    }
}

export const deleteSong = async (req,res,next)=>{
    try{
        const {id} = req.params;
        const song = await Song.findById(id);
        // if song belongs to an album, update the album
        if(song.albumId){
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id },
            });
        }
        await Song.findByIdAndDelete(id);
        res.status(200).json({
            message: "Song deleted successfully",
        });
    } catch(err){
        console.error(err);
        next(err);
    }
}

export const createAlbum = async (req,res,next)=>{
    try{
        const {title, artist, releaseYear} = req.body;
        const {imageFile} = req.files;

        const imageUrl = await uploadtoCloudinary(imageFile);

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear,
        });
        await album.save();
        res.status(201).json(album);
    } catch(err){
        console.error(err);
        next(err);
    }
}
export const deleteAlbum = async (req,res,next)=>{
    try{
        const {id} = req.params;
        await Song.deleteMany({albumId: id});
        await Album.findByIdAndDelete(id);
        res.status(200).json({
            message: "Album deleted successfully",
        });
    } catch(err){
        console.error(err);
        next(err);
    }
}

export const checkAdmin = async (req,res,next)=>{
    res.status(200).json({ admin: true});
}