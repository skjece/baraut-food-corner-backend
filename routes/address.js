const express =require('express');
const router =express.Router(); //using router provided by express
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ADDRESS = require("../models/address");
const checkToken = require('../middleware/check-token');
const { error } = require('console');


router.post("/add",checkToken,(req,res,next)=>{
  console.log("{address}{add}:"+(req)+"::body:"+JSON.stringify(req.body));
  let msisdn=req.userData.msisdn;
  if(msisdn==undefined||msisdn==""||msisdn==null){
    return res.status(500).json({message:"msisdn not in token",status:"ADD_ERROR"});
  }



  req.body.msisdn=req.userData.msisdn;

  //editig a already saved entry
  ADDRESS.findOne({_id:req.body.id})
  .then((addressDocument)=>{

    if(!addressDocument)
    {
      addressDocument=ADDRESS({});
    }

    addressDocument['name']=req.body.name;
    addressDocument['address']=req.body.address;
    addressDocument['alternate_number']=req.body.alternate_number;
    addressDocument['msisdn']=req.userData.msisdn;
    addressDocument['street']=req.body.street;
    addressDocument['lastActivity']=new Date();

    addressDocument.save()
    .then((response)=>{
      console.log("{addressroute}{add}after adding:"+JSON.stringify(response));
        return res.status(200).json({
          message:"address added successfully",
          status:"ADDRESS_ADDED",
          added_address:addressDocument
        })
    })
    .catch(err => {
      console.log("{addressroute}{add}errafter adding:"+JSON.stringify(err));
      res.status(500).json({
        message:"Some error occured",
        error:err,
        status:"SOME_ERROR"
      })
    })

  })

});


router.post("/update",checkToken,(req,res,next)=>{
  console.log("{address}{update}:"+(req)+"::body:"+JSON.stringify(req.body));
  let msisdn=req.userData.msisdn;
  if(msisdn==undefined||msisdn==""||msisdn==null){
    return res.status(500).json({message:"msisdn not in token",status:"UPDATE_ERROR"});
  }

  if(req.body.id==null || req.body.id==undefined ||req.body.id=="" ){
    return res.status(500).json({message:"id not in request",status:"UPDATE_ERROR"});

  }

  req.body.msisdn=req.userData.msisdn;

  //editig a already saved entry
  ADDRESS.findOne({_id:req.body.id})
  .then((addressDocument)=>{

    if(!addressDocument)
    return res.status(500).json({message:"entry not found",status:"EDIT_ERROR"});

    addressDocument['name']=req.body.name;
    addressDocument['address']=req.body.address;
    addressDocument['alternate_number']=req.body.alternate_number;
    addressDocument['msisdn']=req.userData.msisdn;
    addressDocument['lastActivity']=new Date();
    addressDocument['street']=req.body.street;

    addressDocument.save()
    .then((response)=>{
      console.log("{addressroute}{update}after uptaing:"+JSON.stringify(response));
        return res.status(200).json({
          message:"address updatd successfully",
          status:"ADDRESS_UPDATED",
          updated_address:addressDocument
        })
    })
    .catch(err => {
      console.log("{addressroute}{update}errafter uptaing:"+JSON.stringify(err));
      res.status(500).json({
        message:"Some error occured",
        error:err,
        status:"SOME_ERROR"
      })
    })

  })

});



router.get("/fetchAddress", checkToken,(req, res, next) => {
  console.log("fetchAddress rq::");

  let fetchedAddresses;
  const addressQuery = ADDRESS
                        .find({msisdn:req.userData.msisdn})
                        .sort({lastActivity:-1})
                        .limit(10);
  addressQuery
  .then((documnets)=>{
    fetchedAddresses=documnets;
    res.status(200).json({
      message: "Addresses fetched successfully!",
      address_list: fetchedAddresses
    })
  })
  .catch(err=>{
    res.status(500).json({
      message:"Some error occured",
      error:err,
      status:"SOME_ERROR"
    })
  })
});



router.post("/delete",checkToken,(req,res,next)=>{
  console.log("{address}{delete}:"+(req)+"::body:"+JSON.stringify(req.body));
  let msisdn=req.userData.msisdn;
  if(msisdn==undefined||msisdn==""||msisdn==null){
    return res.status(500).json({message:"msisdn not in token",status:"DELETE_ERROR"});
  }

  if(req.body.id==null || req.body.id==undefined ||req.body.id=="" ){
    return res.status(500).json({message:"id not in request",status:"DELETE_ERROR"});

  }

  req.body.msisdn=req.userData.msisdn;

  //editig a already saved entry


  ADDRESS.deleteOne({_id:req.body.id ,msisdn:req.userData.msisdn})
  .then(response=>{
    console.log("{addressroute}{delte}after deleting:"+JSON.stringify(response));

    //if(response.n>0){
      return res.status(200).json({
        message:"address deleted successfully",
        status:"ADDRESS_DELETED",
        deleted_id:req.body.id
       })
    // }else{
    //   throw error("manual thrown");
    // }

  })
  .catch(err => {
    console.log("{addressroute}{delete}errafter deletng:"+JSON.stringify(err));
    res.status(500).json({
      message:"Some error occured",
      error:err,
      status:"SOME_ERROR"
    });

  })

})



module.exports = router;
