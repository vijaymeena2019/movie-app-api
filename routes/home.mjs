import express from  'express';

const router = express.Router();


router.get('/',(req,res)=>{
    return res.send("Nothing here in home please define");
})

export default router;