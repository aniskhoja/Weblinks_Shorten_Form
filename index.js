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
    const allUrl = await Url.find()
    res.render('index', { url: allUrl})

    
}),

app.post('/url', async (req, res) => {
    await Url.create({
        url: req.body.url
    })

    res.redirect('/')
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