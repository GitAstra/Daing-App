const router = require('express').Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');

const User = require('../models/User');

const JWT_SECRET = "aalongaksljdf123129jasdf123123s";

router.get('/find', async(req, res)=>{
    try{
        const users = await User.find({}).select("-password");
        res.status(200).json(users);
    }
    catch(err){
        res.status(400).json(err);
    }
})



router.get('/findAll', verifyToken, async(req, res)=>{
    try{
        // const users = await User.find({_id: {$ne: req.user.userInfo._id}}).select("-password");
        // res.status(200).json(users);

        let { page = 1, size = 20 } = req.query
        page = parseInt(page)
        size = parseInt(size)
        const query = {};
    
        // Counts the Documents in DB
        const totalData = await User.find().estimatedDocumentCount()
        // Fetching Posts
        const data = await User.find({_id: {$ne: req.user.userInfo._id}}).skip((page - 1) * size).limit(size).exec()
    
    
        const pageNumber = Math.ceil(totalData / size)
        const results = {
            currentPage: page,
            prevPage: page <= 1 ? null : page - 1,
            nextPage: page >= pageNumber ? null : page + 1,
            length: data.length,
            data
        }
        res.json(results);

    }
    catch(err){
        res.status(400).json(err);
    }
})

router.post('/register', async(req, res)=>{
    const {email, name, password, image} = req.body;
        try{
            // Checking if USER with the same email already exists
            let user = await User.findOne({email: email});
            if(user){
                res.status(200).json("User With that Email already Exists");
            }
            else{
            // Hashing Password And Adding Salt
            const hashedPassword = await bcrypt.hash(password, 10);
            // Creating a new USER

            user = new User({
                    name: name,
                    email: email,
                    password: hashedPassword,
                    image: image
                })
                const saveUser = await user.save();    
                res.status(200).json({success: true})
            }
        }
        catch(err){
            res.status(200).json({success: false})
        }
})

router.post('/login', async(req, res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user){
            res.status(200).json("Invalid Credentials");
        }
        else{
        const checkPass = await bcrypt.compare(req.body.password, user.password, (err, success)=>{
                if(success){
                const {password, ...others} = user._doc;
                const authToken = jwt.sign(
                    {userInfo: {...others}}, JWT_SECRET, {expiresIn: '3h'}
                )
                res.status(200).json({userInfo: {...others}, authToken, success: true})
                }
                else{
                    res.status(400).json({success: false, error: true})
                }
        })
    }      
    }catch(err){
        res.status(200).json(err)
    }
})

router.post('/like/:id',verifyToken, async(req, res)=>{{
    const userID = req.params.id;
    try{
        const user = await User.findById(userID);
        if(!user.likes.includes(req.user.userInfo._id)){
            await user.updateOne({$push: {likes: req.user._id}});
            res.status(200).json("User Liked");
        }
        else{
            await user.updateOne({$pull: {likes: req.user._id}});
            res.status(200).json("User Disliked")
        }
    }
    catch(err){
        res.status(400).json(err)
    }


}})


router.get('/test', verifyToken, (req, res)=>{
    res.send(req.user.userInfo._id)
})


module.exports = router;