import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils/utils.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
const orderRouter = express.Router();

orderRouter.get('/mine' , isAuth, expressAsyncHandler(async(req,res) =>{
  const orders = await Order.find({user:req.user._id})
  res.send(orders);
}))

orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({message:' Order not found! ' });
    }
  })
);

orderRouter.get('/', isAuth, isSellerOrAdmin , expressAsyncHandler(async (req,res) => {
  const seller = req.query.seller || '';
  const sellerFilter = seller ? {seller} : {};

  const orders = await Order.find({...sellerFilter}).populate('user' , 'name');
  res.send(orders);
})
)

orderRouter.post('/', isAuth , expressAsyncHandler(async(req,res) =>{
    if(req.body.orderedItems.length === 0){
        res.status(400).send({message: 'Cart is empty'})
    } else {

        const order = new Order({
            seller: req.body.orderedItems[0].seller,
            orderedItems : req.body.orderedItems,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user._id,
        });
        const createdOrder = await order.save();
        
        res.status(201).send({ message:'New Order Created!' , order: createdOrder });
    }
})
);

orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);

      if (order) {
        res.send(order);
      } else {
        res.status(404).send({ message:' Order not found! ' });
      }
    })
);

orderRouter.put('/:id/pay', expressAsyncHandler(async(req,res) => {
  const order = await Order.findById(req.body._id);

  const productList = req.body.orderedItems;

  productList.map(async (product) =>{

    const item = await Product.findById(product.product)

    if(item) {
      if(item.countInStock != 0){
        item.countInStock -= product.qty
        await item.save();
      }
    }
  })
  if(order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    res.send({message:'Order Paid' , order: updatedOrder});
  } else {
    res.status(404).send({message:' Order not found! '});
  }
}));

orderRouter.delete('/:id' , isAuth, isAdmin, expressAsyncHandler(async(req,res) => {
  const order = await Order.findById(req.params.id);
  if(order) {
    const deleteOrder = await order.remove();
    res.send({ message: 'Order deleted' , order: deleteOrder})
  } else {
    res.send(404).send({ message:' Order not found! '})
  }


}));

orderRouter.put('/:id/deliver' , isAuth, isAdmin , expressAsyncHandler(async(req,res) => {
  const order = await Order.findById(req.params.id);
  if(order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save()
    res.send({ message: 'Order delivered' , order: updatedOrder})
  } else {
    res.send(404).send({ message:' Order not found! '})
  }
}));

export default orderRouter