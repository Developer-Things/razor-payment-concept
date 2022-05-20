// Inside app.js
const express = require('express');
const app = express();

const Razorpay = require('razorpay');
const bodyParser=require('body-parser')
const crypto=require('crypto')
// This razorpayInstance will be used to
// access any resource from razorpay
const razorpayInstance = new Razorpay({
	// Replace with your key_id
	key_id: 'your_cloud_id',
	// Replace with your key_secret
	key_secret: 'your_cloud_secret'
});

const PORT = process.env.PORT || '6000';


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Inside app.js
app.post('/createOrder', (req, res)=>{

	// STEP 1:
	const {amount,currency,receipt, notes} = req.body;	
		
	// STEP 2:	
	razorpayInstance.orders.create({amount, currency, receipt, notes},
		(err, order)=>{
		
		//STEP 3 & 4:
		if(!err)
			res.json(order)
		else
			res.send(err);
		}
	)
});

//Inside app.js
app.post('/verifyOrder', (req, res)=>{
	
	// STEP 7: Receive Payment Data
	const {order_id, payment_id} = req.body;	
	const razorpay_signature = req.headers['x-razorpay-signature'];

	// Pass yours key_secret here
	const key_secret = 'your_cloud_secret'	

	// STEP 8: Verification & Send Response to User
	
	// Creating hmac object
	let hmac = crypto.createHmac('sha256', key_secret);

	// Passing the data to be hashed
	hmac.update(order_id + "|" + payment_id);
	
	// Creating the hmac in the required format

	const generated_signature = hmac.digest('hex');
	console.log(generated_signature)
	console.log(razorpay_signature)
	if(razorpay_signature===generated_signature){
		res.json({success:true, message:"Payment has been verified"})
	}
	else
	res.json({success:false, message:"Payment verification failed"})
});


// Here we will create two routes one
// /createOrder and other /verifyOrder
// Replace these comments with the code
// provided later in step 2 & 8 for routes

app.listen(PORT, ()=>{
	console.log("Server is Listening on Port ", PORT);
});
