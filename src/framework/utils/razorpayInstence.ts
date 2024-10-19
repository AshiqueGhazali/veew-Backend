// class razorpayService {
//     generateOrderId(): string {
//         const timestamp = Date.now(); 
//         const randomNum = Math.floor(Math.random() * 1000000); 
//         return `ORD-${timestamp}-${randomNum}`;
//     }

//     const insternce = new Razorpay({
//         key_id: process.env.RAZORPAY_ID_KEY || '',
//         key_secret: process.env.RAZORPAY_SECRET_KEY,
//       });

//       const options = {
//         amount: req.body.amount * 100,
//         currency: "INR",
//         receipt: orderId,
//       };
// }