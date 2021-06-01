import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser'
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";
import uploadRouter from "./routers/uploadRouter.js";



import stripe from "stripe";
import User from "./models/userModel.js";
import expressAsyncHandler from "express-async-handler";
import Sessions from "./models/stripeSession.js";

dotenv.config({path:'../Bindof/.env'});

const app = express();
const stripeKey = new stripe(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT ;

app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}))

app.use(session({
    secret: "Set this to a random string that is kept secure",
    resave: false,
    saveUninitialized: true,
  }))


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if ('OPTIONS' == req.method) {
       res.sendStatus(200);
     }
     else {
       next();
}});

app.use(express.json());
app.use(express.urlencoded({ extended:true }));


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/Bindof' , {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex: true,
})

app.use('/api/users' , userRouter);
app.use('/api/products' , productRouter);
app.use('/api/orders' , orderRouter);
app.use('/api/uploads' , uploadRouter);

const __dirname = path.resolve();
app.use('/uploads' , express.static(path.join(__dirname,'/uploads')));


app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

/* Stripe stuff */
app.post("/create-stripe-person", expressAsyncHandler(async(req,res) =>{
  try {
    const user = await User.findOne({email:req.body.email});

    if (!user.stripeID){
        const account = await stripeKey.accounts.create({
            type: "custom",
            country: 'SG',
            capabilities : {
            card_payments: {requested: true},
            transfers: {requested: true},
            }
        })
        await User.updateOne({email : req.body.email} , {stripeID: account.id})
    }
    req.session.accountID = user.stripeID;
    res.status(201).send({message: 'User updated'})

  }catch(err){
    res.status(400).send({
        error:err.message
    })
  }
}))

app.get("/onboard-user/refresh", async (req, res) => {
    try {
        
        const origin = `${req.secure ? "https://" : "https://"}${req.headers.host}`;
        const accountLink = await stripeKey.accountLinks.create({
            account: req.session.accountID,
            success_url: 'http://localhost:3000/placeorder',
            refresh_url: `${origin}/onboard-user/refresh`,
            failure_url: 'http://localhost:5000?failure',
            collect: 'eventually_due',
            type: 'account_onboarding',
        })
        res.send(accountLink);
    } catch (err) {
      res.status(400).send({
        error: err.message
      });
    }
  });

app.post("/stripe-checkout", expressAsyncHandler(async (req, res) =>{
    const orderedItems = req.body.orderedItems
    const orderId = req.body._id
    const lineItems = itemHandler(orderedItems)
    const sellerDetails = await User.findById(req.body.seller)

    const destinationID = sellerDetails.stripeID
    if(payoutEnabledCheck(destinationID)){
      const session = await stripeKey.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
          payment_intent_data: {
            // The account receiving the funds, as passed from the client.
            transfer_data: {
              destination: destinationID,
            },
          },
          // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
          success_url: `http://localhost:3000/order-success/{CHECKOUT_SESSION_ID}?${orderId}`,
          cancel_url: `http://localhost:3000/order/${orderId}`,
        });

    res.send({
          sessionId: session.id,
    });
    } else{
      res.status(400).send({message:'Payouts not enabled, please go to Stripe Onboarding to enable account'})
    }


}))
const payoutEnabledCheck = async(accountID) =>{
  const account = await stripeKey.accounts.retrieve(accountID);
  if(account.payouts_enabled){
    return true;
  }else{
    return false;
  }
}

app.post("/api/get-stripe-user" , async(req, res) =>{
  try{
    const user = await User.findOne({email:req.body.email});
    const account = await stripeKey.accounts.retrieve(user.stripeID)
    res.send(account); 
  }catch(err){
    res.status(400).send({
      error: err.message
    });
  }

})



app.post("/create-stripe-account" , async(req, res) =>{
    try {
      const user = await User.findOne({email:req.body.email});

      if (!user.stripeID){
          const account = await stripeKey.accounts.create({
              type: "custom",
              country: 'SG',
              capabilities : {
              card_payments: {requested: true},
              transfers: {requested: true},
              }
          })
          await User.updateOne({email : req.body.email} , {stripeID: account.id})
      }

        const accountLink = await stripeKey.accountLinks.create({
            account: user.stripeID,
            success_url: 'http://localhost:3000/stripe-onboarding-success',
            refresh_url: 'http://localhost:3000/stripe-user-creation',
            failure_url: 'http://localhost:3000/stripe-user-creation',
            collect: 'eventually_due',
            type: 'account_onboarding',
        })
        res.send(accountLink);
    } catch (err) {
        res.status(400).send({
            error:err.message
        })
    }  
})
app.post("/edit-stripe-account" , async(req,res) => {
  try {
    const user = await User.findOne({email:req.body.email});
    const accountLink = await stripeKey.accountLinks.create({
        account: user.stripeID,
        success_url: 'http://localhost:3000/stripe-onboarding-success',
        refresh_url: 'http://localhost:3000/stripe-user-creation',
        failure_url: 'http://localhost:3000/stripe-user-creation',
        collect: 'eventually_due',
        type: 'account_update',
    })
    res.send(accountLink);
} catch (err) {
    res.status(400).send({
        error:err.message
    })
}  
})

app.post("/stripe-account-post" , expressAsyncHandler(async(req,res) =>{
  try {
    const user = await User.findOne({email:req.body.email});
    const updatedAccount = await stripeKey.accounts.update(
        user.stripeID,{
          business_profile:{
            product_description:user.seller.description,
            url:user.seller.businessURL,
            support_phone:user.seller.businessPhone,
            support_email:user.seller.businessEmail,
            name:user.seller.name,
          }
        })
    res.send(updatedAccount);
} catch (err) {
    res.status(400).send({
        error:err.message
    })
}  
}))

app.post("/api/stripe-create-bank-account" ,expressAsyncHandler(async(req,res) =>{
  try {
    const user = await User.findOne({email:req.body.email});
    const bankAccount = await stripeKey.accounts.createExternalAccount(
      user.stripeID,
      {
        external_account: req.body.token.id,
      }
    );

    res.status(201).send(bankAccount)
} catch (err) {
    res.status(400).send({
        error:err.message
    })
}  
}))
const endpointSecret = "whsec_iyRFYe9x96l6YYOvWNoz4HumlK2DMB6k"
// when stripe is completed, theyll send it into here and then you'll get the success call ,
//do NOT import this from your front end client! because you will lack the signature!

app.post('/webhook', (req, res) => {


  const payload = req.rawBody;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripeKey.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Fulfill the purchase...
    handleCompletedCheckoutSession(session);
  }

  res.status(200);
});

app.post('/api/stripe-session' , expressAsyncHandler(async(req,res) => {
  try{
    const session = await Sessions.find({id: req.body.id})
    res.send(session);
  } catch (err){
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}))

const handleCompletedCheckoutSession = async(session) => {
  // Fulfill the purchase.
  const sessionStore = new Sessions({
    id: session.id,
    payment_status: session.payment_status,
  })

  await sessionStore.save();

}


app.get('/',(req,res) => {
    res.send('Server is ready');
});



app.use((err,req,res,next) =>{
    res.status(500).send({ message: err.message });
})

const itemHandler = (orderItems) =>{
    var result = [];
    orderItems.map((item) => {
        const itemPrice = item.price * 100
        var indivObject = {
            name: item.name,
            amount: itemPrice,
            currency: 'sgd',
            quantity: item.qty,
            images: item.img,
        }
        result.push(indivObject)
    })
    return result;
}

app.listen(port , () => {
    console.log(`server hosted on port 5000${port}`)
})