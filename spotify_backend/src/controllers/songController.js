import {v2 as cloudinary} from 'cloudinary'
import songModel from '../models/songModel.js';
import fs from "fs";

// const addSong = async (req,res) => {
//     try {
//         const name = req.body.name;
//         const desc = req.body.desc;
//         const album= req.body.album;
//         const audioFile = req.files.audio[0];
//         const imageFile= req.files.image[0]; 
//         const audioupload= await cloudinary.uploader.upload(audioFile.path,{resource_type:"video"});
//         const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"});

//         console.log(name,desc,album,audioupload,imageUpload);
        
//     } catch (error) {
        
//     }
// }

// Add Song Endpoint
const addSong = async (req, res) => {
    try {
        // Destructure form data from request body
        const { name, desc, album } = req.body;
  
        // Ensure files are present in the request
        if (!req.files || !req.files.audio || !req.files.image) {
            return res.status(400).json({ message: "Audio and image files are required" });
        }
  
        // Access uploaded files from req.files
        const audioFile = req.files.audio[0];
        const imageFile = req.files.image[0];
  
        // Log file paths for debugging
        console.log("Audio File Path:", audioFile.path);
        console.log("Image File Path:", imageFile.path);
  
        // Upload files to Cloudinary
        const audioupload = await cloudinary.uploader.upload(audioFile.path, { resource_type: "video" });
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
  
        // Log Cloudinary upload results
        console.log("Audio Upload Result:", audioupload);
        console.log("Image Upload Result:", imageUpload);
  
        // Calculate duration for audio file (e.g., 3 minutes 45 seconds)
        const duration = `${Math.floor(audioupload.duration / 60)}:${Math.floor(audioupload.duration % 60)}`;
  
        // Prepare song data to save in the database
        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioupload.secure_url,
            duration
        };
  
        // Delete temp files after upload
        fs.unlinkSync(audioFile.path);
        fs.unlinkSync(imageFile.path);
  
        // Log the final song data
        console.log("Song Data:", songData);
  
        // Save to the database
        const newSong = new songModel(songData);
        await newSong.save();
  
        // Respond to the client with success message and new song data
        res.status(201).json({
            success: true,
            message: "Song uploaded successfully",
            newSong
        });
    } catch (error) {
        // Handle any errors that occur during file upload or database operations
        res.status(500).json({ message: error.message });
    }
};

// List Songs Endpoint
const listSong = async (req, res) => {
    try {
        const songs = await songModel.find({});
        res.status(200).json({success:true,songs:songs});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeSong = async (req,res) =>{
  try {
    await songModel.findByIdAndDelete(req.body.id);
    res.json({success:true,message:"song removed"})
  } catch (error) {
    res.json({success:false});
  }
}

export { addSong, listSong,removeSong };
