const mongoose = require('mongoose')
 const url="mongodb+srv://deedat5:Portable24198@cluster0-tkvnj.mongodb.net/Election?retryWrites=true&w=majority" 
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})    