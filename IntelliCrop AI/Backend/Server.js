const path = require('path');
const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname,'.env') });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'client')));

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname,'client','index.html'));
});

const apiKey = process.env.GEMINI_API_KEY;
if(!apiKey){
  console.error("GEMINI_API_KEY missing in .env!");
  process.exit(1);
}

const ai = new GoogleGenAI({apiKey});

app.post('/chat', async(req,res)=>{
  try{
    const msg = req.body.message;
    if(!msg) return res.status(400).json({error:'Message required'});

    const response = await ai.models.generateContent({
      model:"gemini-2.5-flash",
      contents: msg,
      config:{
        systemInstruction:"You are Intellicrop, expert AI farming assistant. Reply concisely in Hindi or English depending on user input."
      }
    });

    res.json({response: response.text});

  }catch(err){
    console.error(err);
    res.status(500).json({error:'AI assistant failed',details:err.message});
  }
});

app.listen(port,()=>console.log(`Server running at http://localhost:${port}`));
