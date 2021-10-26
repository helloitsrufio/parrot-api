const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
// const cors = require('cors')
const multer = require('multer')
const cloudinary = require('cloudinary')

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'Parrot'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology : true})
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
app.set('view engine', 'ejs')
app.use(express.static('public'))//lets you use files in your public folder
app.use(express.urlencoded({ extended : true}))//method inbuilt in express to recognize the incoming Request Object as strings or arrays. 
app.use(express.json())//method inbuilt in express to recognize the incoming Request Object as a JSON Object.

app.get('/', (request, response) => {
    db.collection('Parrot').find().toArray()
    .then(data => {
        console.log(data)
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.get('/addParrot', (req,res) =>{
        res.render('inputParrot.ejs')
})

app.post('/addParrot', async (req,res) =>{
    //Get the file name and extension with multer
    const storage = multer.diskStorage({
        filename: (req, file, cb) => {
            const fileExt = file.originalname.split('.').pop()
            const filename = `${new Date().getTime()}.${fileExt}`
            cb(null, filename)
        }
    })

    //Set the storage, file filter, and file size with multer
    const upload = multer({
        storage,
        limits: {
            fieldNameSize: 200,
            fileSize: 30 * 1024 * 1024
        },
    }).single('image')

    upload(req,res, (err)=> {
        if(err){
            return res.send(err)
        }
    })
    
    //Send file to cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    const { path } = req.file; 
    console.log('Here is req.file', req.file)//file becomes available in req at this point

    const fName = req.file.originalname.split('.')[0]
    cloudinary.uploader.upload(
        path,
        {
            resource_type: 'image',
            public_id: `ImageUploads/${fName}`,
            eager: [ //unlike a lazy transformation, which generates stored images on demand, an eager transformation is transformed during asset upload process.
                {
                  width: 300,
                  height: 300,
                //   crop: "pad",
                },
                {
                  width: 160,
                  height: 100,
                  crop: "crop",
                //   gravity: "south",
                },
              ],
        },

        //Send cloudinary res or catch error
        (err, video) => {
            if (err) return res.send(err)
            fs.unlinkSync(path)
            return res.send(image)
        }
    )


    createPost: async (req, res) => {
        try {
          // Upload image to cloudinary
          const result = await cloudinary.uploader.upload(req.file.path);
    
          await Post.create({
            title: req.body.title,
            image: result.secure_url,
            cloudinaryId: result.public_id,
            caption: req.body.caption,
            likes: 0,
            user: req.user.id,
          });
          console.log("Post has been added!");
          res.redirect("/profile");
        } catch (err) {
          console.log(err);
        }
      }


    db.collection('parrots').insertOne({parrotImage: req.file.parrotImage, parrotName: req.body.parrotName, parrotColor: req.body.parrotColor, naturalHabitat: req.body.naturalHabitat, definingCharacteristic: req.body.definingCharacteristic})
    .then(res => {
        console.log('Parrot Added')
        res.redirect('/')
    })
    .catch(error => console.error(error))
})

// let cockatiel = {
//     'colors' : 'white and gray, yellow, white, and gray, white',
//     'natural habitat' : 'Australia',
//     'defining characteristics' : 'crest on top of head, orange circles on cheeks',
// }



// app.get('/:id', (request, response)=>{
//     buttonClick; 
// })

const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})