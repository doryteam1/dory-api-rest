const db = require('./db');
const config = require('../config');
const jwt=require('jsonwebtoken');
const auth= require('../middleware/auth');
const express = require('express');
const app = express();
const bcrypt= require('bcrypt');
const mysql = require('mysql2/promise');

const userSchema= new Schema({
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  }
});

userSchema.pre('save',async function(next){
  const hash = await bcrypt.hash(this.password,10);
  this.password=hash;
  next();
  console.log("Entraste Luis");
});


userSchema.methods.isValidPassword= async function(password){
 const user= this;
 const compare= await bcrypt.compare(password,user.password);
 return compare;
}


/*
async function createLogin(user){
  let message='';
  console.log("Logueando usuario...",user);

  if(user.email == "juanluis@gmail.com" && user.password == "123") {
             const payload = {
                 check:  true
                            };
    
                jwt.sign({user},'secretkey',(err,token)=>{
     
                  res.json({
                    message: 'Autenticación correcta',
                       token:token
                      });
                      console.log(" ",message);
             });
     }  
     else {
          res.json({ message: "Usuario o contraseña incorrectos"});/*  res donde lo recibo??
      }
      return {message};
  }

  
  jwt.sign({user},'secretkey',(err,token)=>{
    res.json({
      token
    });
   auth.verifyToken(req,res,next);

  });
 
    return {message};
*/
  

module.exports =  userSchema;
