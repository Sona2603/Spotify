import {v2 as cloudinary} from 'cloudinary'
import albumModel from "../models/albumModel.js"
import fs from "fs"
import songModel from '../models/songModel.js';

const addAlbum = async (req, res) => {
    try {
        const { name, desc, bgColour } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: "Image file is required" });
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

        const albumData = {
            name,
            desc,
            bgColour,
            image: imageUpload.secure_url
        };

        const album = new albumModel(albumData);
        await album.save();

        res.json({ success: true, message: "Album added" });
    } catch (error) {
        console.log("Error:", error.message); // Log the error
        res.json({ success: false, message: error.message });
    }
};


const listAlbum = async (req,res) =>{
       try {
        const album = await albumModel.find({});
        res.json({success:true,albums:album,message:"Albums are listed"})
       } catch (error) {
        res.json({success:false})
       }
}

const removeAlbum = async (req,res) => {
    try {
        const album = await albumModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Album removed"})
    } catch (error) {
        res.json({success:false})
    }
}

export {addAlbum,listAlbum,removeAlbum};