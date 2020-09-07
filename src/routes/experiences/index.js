const express = require("express");
const router = express.Router();
const experienceModel = require("./schema");

router.get('/:username', async(req,res)=>{
try { 
    const response = await experienceModel.find()
    res.send(response)
} catch (error) {
   console.log(error) 
}
})
router.get('/:username/:id', async(req,res)=>{
    try { 
        const response = await experienceModel.findById(req.params.id)
        res.send(response)
    } catch (error) {
       console.log(error) 
    } 
})
router.post('/:username', async(req,res)=>{
    try {
        const experienceBody = {...req.body , username:req.params.username}
        const newExperience = new experienceModel(experienceBody);
         await newExperience.save();
        res.send(newExperience);
      } catch (error) {
        console.log(error)
      }
})
router.put('/username/:id', async(req,res)=>{
    try {
        const editExperience = await experienceModel.findByIdAndUpdate(req.params.id,req.body)
        res.send(req.body)
    } catch (error) {
        console.log(error)
    }
})
router.delete('/username/:id', async(req,res)=>{
    try {
        const deleteExperience = await experienceModel.findByIdAndDelete(req.params.id)
        res.send("Deleted")
    } catch (error) {
        
    } 
})

module.exports = router