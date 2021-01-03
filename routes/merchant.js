const express =require('express');
const router =express.Router(); //using router provided by express
const MERCHANT = require("../models/merchant");
const common_lib=require("../functions/common_function")
// const checkToken =require("./../middleware/check-token");

router.get("", (req, res, next) => {
  console.log("get-merchants rq::"+JSON.stringify(req.query));
  // msisdn_list="8527976369";
  // key_list="{#DD#}|{#AA#}|{#BB#}";
  // value_list="XYZ shop|345|40min"
  // let sms_req=common_lib.createSendSMSRequest(msisdn_list,key_list,value_list,42425);
  // sms_req.then((resp)=>{
  //   console.log("resp:"+JSON.stringify(resp))
  // })
  // .catch(err=>{
  //   console.log("err:"+JSON.stringify(err))
  // })

  //return;
  let fetchedMerchants;
  const merchantQuery = MERCHANT.find().sort({overall_rating:-1});
  merchantQuery
  .then((documnets)=>{
    console.log("{merchantroute}{get-metchant}documnets:"+documnets)
    fetchedMerchants=documnets;
    res.status(200).json({
      message: "Merchants fetched successfully!",
      merchants: fetchedMerchants
    })
  })
  .catch(err=>{
    res.status(500).json({
      message:"Some error occured",
      status:500,
      status:"SOME_ERROR"
    })
  })
});

router.get("/specific", (req, res, next) => {
  console.log("get-specific-merchant rq::"+JSON.stringify(req.query));

  // for(var i=0;i<1000000000;i++){
  //   i++;
  // }

  if(!req.query.merchant_id && req.merchant_id!="" ){
    res.status(500).json({
      message:"No merchant ID received",
      status:"SOME_ERROR",
      status:500
    })
  }

  let fetchedMerchant;
  const merchantQuery = MERCHANT.findById(req.query.merchant_id);
  merchantQuery
  .then((documnet)=>{
    fetchedMerchant=documnet;
    res.status(200).json({
      message: "specific_merchant fetched successfully!",
      specific_merchant: fetchedMerchant
    })
  })
  .catch(err=>{
    res.status(500).json({
      message:"Some error occured",
      statusMsg:"SOME_ERROR",
      status:500
    })
  })
});

module.exports = router;
