var express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

var app   = express();
// const postRoutes = require("./routes/posts");
// const userRoutes = require("./routes/user");
const otpRoutes = require("./routes/otp");
// const authRoutes = require("./routes/auth");
// const userDataRoutes = require("./routes/userdata");
const ItemRoutes = require("./routes/item");
const MerchantRoutes = require("./routes/merchant");
// const OrderRoutes = require("./routes/order_routes");
const CartRoutes = require("./routes/cart");
const AddressRoutes = require("./routes/address");
const OrderRoutes = require("./routes/order");
const MerchantOrderRoutes = require("./routes/merchant-order");

const logger = require("./logger");


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


mongoose
  .connect(
      "mongodb+srv://SAURABH:zzqP7ChJTqESP4lW@cluster0.06klg.mongodb.net/baraut-food-corner?retryWrites=true&w=majority"     )
  .then(() => {
    console.log("Connected to database!");
    console.log("current server time:"+new Date().toISOString())
  })
  .catch((err) => {
    console.log("Connection failed!:"+err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {

  console.log("inside server");
//logTest(req,res)

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept ,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH,PUT, DELETE, OPTIONS"
  );



  next();
  //res.json("sending hello from server");
});

//logging middleware
app.use((request,response,next)=>{

  //logger.log('info',"hellow");

  const requestStart = Date.now();

  const { rawHeaders, httpVersion, method, socket, url } = request;
  let resp_body="";
  let req_body=request.body;

  let oldSend=response.send;//original send function
  response.send= function(data){
    // console.log("printing res data"+data);
    resp_body=data;
    oldSend.apply(response,arguments);

  }

  request.on("error", error => {
    errorMessage = error.message;
  });

  response.on("finish", () => {
    const headers = response.getHeaders();

    // resp_body=JSON.parse(resp_body)
    // logger.log('debug',
    //   ({
    //     timestamp: Date.now(),
    //     processingTime: Date.now() - requestStart,
    //     req_body,
    //     resp_body,
    //     url,
    //     method,
    //     rawHeaders
    //   })
    // );

    logger.log('info',
      ({
        timestamp: Date.now(),
        processingTime: Date.now() - requestStart,
        // req_body:JSON.parse(req_body),
        // resp_body,
        url,
        method,
        rawHeaders
      })
    )


  });

  next();
  return;



  // let errorMessage = null;
  // let body = [];
  // // let req_body=request;
  // let req_query=request.query;
  // request.on("data", chunk => {
  //   body.push(chunk);
  // });
  // request.on("end", () => {
  //   body = Buffer.concat(body).toString();
  // });
  // request.on("error", error => {
  //   errorMessage = error.message;
  // });



  // response.on("finish", () => {
  //   const { rawHeaders, httpVersion, method, socket, url } = request;
  //   const { remoteAddress, remoteFamily } = socket;

  //   const { statusCode, statusMessage ,body} = response;
  //   const headers = response.getHeaders();

  //   // let response_body=response.getBody();
  //   let request_body= request.body;


  //   // console.log("response->"+JSON.stringify(response));
  //   console.log(
  //     JSON.stringify({
  //       timestamp: Date.now(),
  //       processingTime: Date.now() - requestStart,
  //       rawHeaders,
  //       body,
  //       request_body,
  //       // response_body,
  //       // request,
  //       // response,
  //       errorMessage,
  //       httpVersion,
  //       method,
  //       remoteAddress,
  //       remoteFamily,
  //       url,
  //       response: {
  //         statusCode,
  //         statusMessage,
  //         headers,
  //         body
  //       }
  //     })
  //   );
  // });

  // next();
})



// app.use("/api/posts/",postRoutes);
// app.use("/api/users/",userRoutes);
app.use("/api/otp/",otpRoutes);
// app.use("/api/userdata",userDataRoutes);
app.use("/api/items",ItemRoutes);
app.use("/api/merchants",MerchantRoutes);
app.use("/api/address",AddressRoutes);
app.use("/api/orders",OrderRoutes);
app.use("/api/cart",CartRoutes);
app.use("/api/merchant-orders",MerchantOrderRoutes);




module.exports=app;


