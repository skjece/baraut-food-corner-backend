const express =require('express');
const router =express.Router(); //using router provided by express
const CART = require("../models/cart");

const checkUserToken =require("../middleware/check-token");




router.post("/mergecart",checkUserToken,(req,res,next)=>{
  console.log("inside mergecart:"+JSON.stringify(req.body));
  // let msisdn=req.body.msisdn;
  let msisdn=req.userData.msisdn;

  if(msisdn==undefined||msisdn==""||msisdn==null){
    return res.status(500).json({message:"could not merge",status:"MERGE_ERROR"});
  }

  CART.findOne({msisdn:msisdn})
  .then((cartDocumnet)=>{
    console.log("{CART}{mergecart}cartDoc:"+JSON.stringify(cartDocumnet))
    // if(!cartDocumnet){//if no entry for this msisdn
    //   console.log("{mergecart}-notfound-adding new");


    // }
    let cart=[];
    if(cartDocumnet){
       cart=cartDocumnet.cart;
      //console.log("initial cart from server:")
    }
    else{
      console.log("no entry for this msisdn in cart table");
      //let cart={}
    }

    console.log("cart from server:"+JSON.stringify(cart));

    let localcart=req.body.localcart;
    console.log("local cart:"+JSON.stringify(localcart));


    // let newcart=[...cart,...localcart];
    let newcart=merge(cart, localcart);
    console.log("newcart"+JSON.stringify(newcart));

    let new_cart_entry=null;
    if(cartDocumnet){
      new_cart_entry=cartDocumnet
    }else{
      new_cart_entry=CART({
        msisdn:req.userData.msisdn
      });
    }

    new_cart_entry["cart"]=newcart;
    console.log("new_cart_entry"+JSON.stringify(new_cart_entry));

    new_cart_entry.save()
    .then((response)=>{
      console.log("updated cart in DB"+JSON.stringify(response));
      res.status(200).json({
        message:"cart updatd successfully",
        status:"CART_UPDATED",
        updatedCart:new_cart_entry["cart"]
      })

    })
    .catch(err=>{
      console.log("unable to merge cart in user in DB"+JSON.stringify(err));
      res.status(500).json({
        message:"Some error occured",
        error:err,
        status:"SOME_ERROR"
      })
    })

  })
});


router.post("/savecart",checkUserToken,(req,res,next)=>{
  console.log("inside savecart:"+JSON.stringify(req.body));
  console.log("inside savecart -userdata:"+JSON.stringify(req.userData));
  // let msisdn=req.body.msisdn;
  let msisdn=req.userData.msisdn;
  if(msisdn==undefined||msisdn==""||msisdn==null){
    return res.status(500).json({message:"could not save",status:"SAVE_ERROR"});
  }

  CART.findOne({msisdn:msisdn})
  .then((cartDocument)=>{
    if(!cartDocument){
      console.log("entry not found");
      return res.status(500).json({message:"could not save",status:"SOME_ERROR"});
    }


    let newcart=req.body.varCart;
    console.log("new cart:"+JSON.stringify(newcart));


    let new_cart_entry=cartDocument;
    new_cart_entry["cart"]=newcart;
    console.log("new_cart_entry"+JSON.stringify(new_cart_entry));

    new_cart_entry.save()
    .then((response)=>{
      console.log("updated cart in user in DB"+JSON.stringify(response));
      res.status(200).json({
        message:"cart updatd successfully",
        status:"CART_UPDATED",
        updatedCart:new_cart_entry["cart"]

      })

    })
    .catch(err=>{
      console.log("unable to updat cart in user in DB"+JSON.stringify(err));
      res.status(500).json({
        message:"Some error occured",
        error:err,
        status:"SOME_ERROR"
      })
    })

  })
});

function merge(arr1,arr2){
  let arr3=[];
  let alreadyTakenIds=[];

  for(var i=0;i<arr1.length;i++){
    let item=arr1[i];
    let id=item._id;
    if(!alreadyTakenIds.includes(id)){
      arr3.push(item);
      alreadyTakenIds.push(id);
    }
  }



  for(var i=0;i<arr2.length;i++){
    let item=arr2[i];
    let id=item._id;
    if(!alreadyTakenIds.includes(id)){
      arr3.push(item);
      alreadyTakenIds.push(id);
    }
  }


  // console.log("finalArray:"+JSON.stringify(arr3));
  return arr3;
}


module.exports = router;
