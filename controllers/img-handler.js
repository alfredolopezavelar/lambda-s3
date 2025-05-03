const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');

// modify the image to upload
const sharp = require('sharp');

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// work with env variables
const dotenv = require('dotenv');

dotenv.config();

const randomImgName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    }
})


const storage = multer.memoryStorage();
const upload = multer({storage : storage}) 



router.post('/', upload.single('image'), async (req, res) => {
    // req.file.buffer is the image file

    // resize image
    const buffer = await sharp(req.file.buffer).resize({height: 600, width: 600, fit: 'cover'}).toBuffer()

    const imageName = randomImgName()

    const params = {
        Bucket: bucketName,
        Key: imageName,
        Body: buffer,
        ContentType: req.file.mimetype,
    }

    const command = new PutObjectCommand(params)
    await s3.send(command)

    // obtain img url 
    const imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${imageName}`;

    res.status(200).send({url: imageUrl})
})

module.exports = router;