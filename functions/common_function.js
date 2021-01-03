var unirest = require("unirest");


function createSendSMSRequest(msisdn_list,key_list,value_list,template_id){

// console.log("{order}{createSendSMSRequest}::msisdn_list:"+JSON.stringify(msisdn_list)+"::keys:"+JSON.stringify(keys)+"::values:"+JSON.stringify(values))

// msisdn_str="";
// msisdn_list.forEach((msisdn,index) => {
//   msisdn_str=""+msisdn;
//   if(index < msisdn_list.length-1){
//     msisdn_str=msisdn_str+",";
//   }
// });

// key_str="";
// key_list.forEach((key,index)=>{
//   key_str+=""+key;
//   if(index < key_list.length-1){
//     key_str=key_str+"|";
//   }
// });

// value_str="";
// value_list.forEach((value,index)=>{
//   value_str+=""+value;
//   if(index < value_list.length-1){
//     value_str=value_str+"|";
//   }
// });




var req = unirest("POST", "https://www.fast2sms.com/dev/bulk");

req.headers({
  "content-type": "application/x-www-form-urlencoded",
  "cache-control": "no-cache",
  "authorization": "Q7ZgvHOP5hIY2jlpn40yWxUzeXs6aS381JAkMCT9qDmGEbKwdBe4F7rifaZRIKz5Q9CcgqNG1ldnshxu"
});
// msisdn=""+msisdn;
req.form({
  "sender_id": "FSTSMS",
  "language": "english",
  "route": "qt",
  "numbers": msisdn_list,
  "message": template_id,
  "variables": key_list,
  "variables_values": value_list
});

console.log("final_reuest::"+JSON.stringify(req));
return req;

}


module.exports={createSendSMSRequest}
