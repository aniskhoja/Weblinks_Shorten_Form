const express = require('express');
const app = express();
const Url = require('./module/url');
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/url-demo')
    .then(() => console.log("Connected"))
    .catch((err) => console.log(err))


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.get('/', async (req, res) => {
   
    const limit = parseInt(req.query.limit) || 2;
    const page = parseInt(req.query.page) || 1;


    const startIndex = (page - 1)*limit
    const endIndex = page * limit
       
    const result = {}
    if(endIndex < await Url.countDocuments().exec()){
        result.next = {
            page : page + 1,
            limit : limit
        }
    }

    if(startIndex > 0){
        result.previous = {
            page : page - 1,
            limit : limit
        }
    }
    const allUrl = await Url.find();
    const urlList = await Url.find().limit(limit).skip(startIndex)
    res.render('index', data = {urlAll : allUrl, url: urlList, next : result.next, previous: result.previous})  
}),

app.post('/url', async (req, res) => {
    await Url.create({
        url: req.body.url
    })

    res.redirect('/?page=1&limit=4')
})

app.get('/:url', async (req, res) => {
    const url = await Url.findOne({ shortUrl : req.params.url})
    if(url == null) return res.status(404).send("sorry")
    url.click++
    await  url.save();
    res.redirect(url.url)
})


const PORT = process.env.PORT || 5000
app.listen(PORT, (err) => {
    if(err) console.log(err)
    console.log("Conneted to port " + PORT)
})