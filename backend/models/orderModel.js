import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderedItems:[
    {
        name:{type:String, required:true},
        qty: {type:Number,required:true},
        // you have to reenable image when you have image paths
        image: {type:String, required:true},
        price:{type:Number,required:true},
        product:{
            type:mongoose.Schema.Types.ObjectId, 
            ref:'Product', 
            required: true,
        },
    },
],
    shippingAddress:{
        fullName: {type:String, required:true},
        address: {type:String, required:true},
        postalCode: {type:String, required:true},
        country: {type:String, required:true},
    },
    paymentMethod: {type:String, required:true},
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    itemsPrice: {type:Number, required:true},
    shippingPrice: {type:Number, required:true},
    taxPrice: {type:Number, required:true},
    totalPrice: {type:Number, required:true},
    user: {type:mongoose.Schema.Types.ObjectId, ref:'User' , required:true},
    seller: {type: mongoose.Schema.Types.ObjectId,  ref:'User'}
    },
    {
        timestamps:true,
    }
);

const Order = mongoose.model('Order' , orderSchema );
export default Order;