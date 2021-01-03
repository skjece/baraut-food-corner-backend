const express =require('express');
const router =express.Router(); //using router provided by express
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ORDER = require("../models/order");
const checkMerchantToken = require('../middleware/check-merchant-token');
const { error } = require('console');
const { Schema } = require('mongoose');


router.post("/add",checkMerchantToken,(req,res,next)=>{
  console.log("{order}{add}:"+(req)+"::body:"+JSON.stringify(req.body));
  let msisdn=req.userData.msisdn;
  if(msisdn==undefined||msisdn==""||msisdn==null){
    return res.status(500).json({message:"msisdn not in token",status:"ADD_ERROR"});
  }

  req.body.msisdn=req.userData.msisdn;

   let orderDocument=ORDER({});

   req.body.orderFlow.placed=new Date();
    orderDocument['delivery_details']=req.body.delivery_details;
    orderDocument['items']=req.body.items;
    orderDocument['orderFlow']=req.body.orderFlow;

    orderDocument['msisdn']=req.userData.msisdn;
    orderDocument['lastActivity']=new Date();
    orderDocument['merchant_id']=req.body.items[0]['seller_id'];

    console.log("{order route}{create}orderDociment:"+JSON.stringify(orderDocument))
    orderDocument.save()
    .then((response)=>{
      console.log("{ordersroute}{add}after adding:"+JSON.stringify(response));
        return res.status(200).json({
          message:"order added successfully",
          status:"ORDER_ADDED",
          added_order:orderDocument
        })
    })
    .catch(err => {
      console.log("{ordersroute}{add}errafter adding:"+JSON.stringify(err));
      res.status(500).json({
        message:"Some error occured",
        error:err,
        status:"SOME_ERROR"
      })
    })



});


router.post("/update",checkMerchantToken,(req,res,next)=>{
  console.log("{merchant-order}{update}:"+(req)+"::body:"+JSON.stringify(req.body.order._id));
  let msisdn=req.userData.msisdn;
  let merchant_id=req.userData.merchant_id;

  let recivedOrder=req.body.order;
  let recivedOrderId=req.body.order._id;

  if(msisdn==undefined||msisdn==""||msisdn==null ||merchant_id==undefined||merchant_id==null){
    return res.status(500).json({message:"msisdn/merch_id not in token",status:"UPDATE_ERROR"});
  }

  //editig a already saved entry
  ORDER.deleteOne({_id:recivedOrderId})
  .then((delete_resp)=>{

    console.log("{merchant order}{updateroute}:delete_resp:"+JSON.stringify(delete_resp));


    if(!delete_resp)
    return res.status(500).json({message:"unable to delte old entry",status:"UPDATE_ERROR"});



    let updated_order=ORDER(recivedOrder);

    updated_order.orderFlow.placed=new Date(updated_order.orderFlow.placed)

    updated_order.save()
    .then((response)=>{
      console.log("{merchant update route}{update}after uptaing:"+JSON.stringify(response));
        return res.status(200).json({
            message:"order updatd successfully",
            status:"ORDER_UPDATED",
            updated_order:updated_order
        })

      })
      .catch(err => {
        console.log("{merchant update route}{update}errafter uptaing:"+JSON.stringify(err));
        res.status(500).json({
          message:"Some error occured",
          error:err,
          status:"SOME_ERROR"
        })
      })

  })

});



router.post("/fetchOrders", checkMerchantToken,(req, res, next) => {
  console.log("merchant fetchOrders rq::body::"+JSON.stringify(req.body));

  console.log("merchant fetchOrders rq::req.userData.merchant_id::"+JSON.stringify(req.userData.merchant_id));
  console.log("merchant fetchOrders rq:date"+new Date().toISOString());
  let fetchedOrders;

  var date = new Date();
  var year=date.getFullYear();
  var month= date.getMonth();
  var date_new=date.getDate();
  var finalDate=new Date(year, month,date_new);
  console.log("{fetch merchant order}finalDate:"+finalDate);
  //date.setDate(date.getDate() - 1);
  //date ; //# => Thu Mar 31 2011 11:14:50 GMT+0200 (CEST)
  var orderQuery;
  if(req.body.requiredStatuses.length>0){
     orderQuery = ORDER
    .find({merchant_id:req.userData.merchant_id ,
      "orderFlow.currentStatus": req.body.requiredStatuses,
      "orderFlow.placed":{$gte : finalDate}
    })
    .sort({"orderFlow.placed":-1});
  }
  else{
     orderQuery = ORDER
    .find({merchant_id:req.userData.merchant_id ,
      // "orderFlow.currentStatus": req.body.requiredStatuses,
      "orderFlow.placed":{$gte : new Date(year, month,date_new)}
    })
    .sort({"orderFlow.placed":-1});
  }

                      // .getFilter
                      // .limit(15);
  orderQuery
  .then((documnets)=>{
    console.log("{merchant -oredr}{fetched}:"+JSON.stringify(documnets))
    fetchedOrders=documnets;
    res.status(200).json({
      message: "Orders fetched successfully!",
      orders_list: fetchedOrders
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



router.get("/specific", checkMerchantToken,(req, res, next) => {
  console.log("get-specific-order rq::"+JSON.stringify(req.query));

  if(!req.query.order_id && req.order_id!="" ){
    return  res.status(500).json({
      message:"No order ID received",
      status:"SOME_ERROR",
      status:500
    })
  }

  let fetchedOrder;
  const orderQuery = ORDER.findById(req.query.order_id);
  orderQuery
  .then((documnet)=>{
    fetchedOrder=documnet;
    res.status(200).json({
      message: "specific_order fetched successfully!",
      specific_order: fetchedOrder
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
