const mongoose = require('mongoose');
const express  = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
// middle wares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})
// connection stabilish of mongodb
mongoose.connect('mongodb+srv://englishdocumentry1:KvDsgkWkjNBWPdml@clustertest.0i26y.mongodb.net/?retryWrites=true&w=majority&appName=Clustertest',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(()=>{
        console.log('MongoDB Connected');
    })
.catch((err)=>{
    console.error(err+"not connected");
})
const userschema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    phone:{
        type:String,
        required: true,
    },
    PreferedLanguage:{
        type:String,
        required: true,
    },
    Skills:{
        type:String,
        required: true,
    },
    reg_no:{
        type:String,
        required: true,
    },
    Batch:{
        type:String,
        required: true
    }
})
// post request (issue in storing the data )
app.post('/login', async (req, res) => {
    try{
        const {email, password , name , phone , PreferedLanguage , Skills  , reg_no , Batch } = req.body;
        if (!email || !password || !name || !phone || !PreferedLanguage || !Skills) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const alreadyexistuser = await  user.findOne({email})
        if(alreadyexistuser){
            return res.status(400).json({message:'Already exist'});
        }
        const newUser = new user({ name, email, password, phone, PreferedLanguage, Skills , reg_no , Batch  });
        await newUser.save();
        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (err){
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Something went wrong, please try again!' });
    }
})
const user = mongoose.model('User',userschema);
app.listen(3000,(err) => {
    console.log("server is running on port 3000");
});
