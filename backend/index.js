import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwttkon from "jsonwebtoken"
"868Q5s1fQKy6nKBv"
const saltRounds = 10;
import cors from "cors"
mongoose.connect("mongodb+srv://joyboy:868Q5s1fQKy6nKBv@cluster0.etdaqe8.mongodb.net/").then(found=>{
    console.log("connected to database")
}).catch(err=>{
    console.log(err)
})
const userschema=new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
})

const user=mongoose.model("users",userschema);
const app=express()
app.use(bodyParser.json({extended:true}));
app.use(cors());
let success=false;
let logitem="nexusproject"

app.post("/api/auth/sign-up",async (req,res)=>{
    const{username,email,password}=req.body
    let hashpassword
    hashpassword=await bcrypt.hash(password, saltRounds)
    if(await user.findOne({email:email})){
        res.json(success)
    }else{
        const newuser=new user({
            email:email,
            username:username,
            password:hashpassword
        })
        newuser.save().then(found=>{
            console.log("detail saved")
            success=true
            res.json(success)
        }).catch(err=>{
            console.log(err)
        })
    }
  
    
})

app.post("/api/auth/sign-in",async (req,res)=>{
    const{username,email,password}=req.body
   await user.findOne({email:email}).then(async found=>{
       let resutl= await bcrypt.compare(password, found.password)
       if(resutl==true){
            let secret="kyaboltepublic"
            let data={
                usern:found.username
            }
            const jwtdata=jwttkon.sign(data,secret,{expiresIn:"2d"})
            success=true
            res.json({success,jwtdata})
       }else{
            success=false
            res.json(success)
       }
   }).catch(err=>{
    success=false
    res.json(success)
   })
})











app.listen(5000,()=>{
    console.log("running at port 5000")
})