const express =require('express');
const router =express.Router(); //using router provided by express
const ITEM = require("../models/item");
// const checkToken =require("./../middleware/check-token");

router.get("", (req, res, next) => {
  console.log("get-items rq::"+JSON.stringify(req.query));

  let fetchedItems;
  const itemQuery = ITEM.find({"seller_id":req.query.merchant_id });
  itemQuery
  .then((documnets)=>{
    console.log("{itemroute}{get-items}documnets:"+documnets)
    fetchedItems=documnets;
    res.status(200).json({
      message: "Items fetched successfully!",
      items: fetchedItems
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
  console.log("get-specific-item rq::"+JSON.stringify(req.query));

  if(!req.query.item_id && req.item_id!="" ){
    res.status(500).json({
      message:"No item ID received",
      status:"SOME_ERROR",
      status:500
    })
  }

  let fetchedItem;
  const itemQuery = ITEM.findById(req.query.item_id);
  itemQuery
  .then((documnet)=>{
    fetchedItem=documnet;
    res.status(200).json({
      message: "specific_item fetched successfully!",
      specific_item: fetchedItem
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
