import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken , isAdmin, isAuth } from '../utils/utils.js';



const userRouter = new express.Router();



userRouter.get('/seed' , 
expressAsyncHandler(async(req,res)=> {
    // await User.remove({});
    const createUsers = await User.insertMany(data.users);
    res.send({createUsers});
})
);

userRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post('/register',expressAsyncHandler(async (req, res)=>{
  const user = new User({
    name:req.body.name,
    email:req.body.email,
    password:bcrypt.hashSync(req.body.password, 8),
    isSeller: req.body.isSeller,
    seller:{
      _id : new ObjectId(),
      name:req.body.businessName,
      description: req.body.businessDescription,
      businessURL: req.body.businessURL,
      businessPhone: req.body.businessPhone,
      businessEmail: req.body.businessEmail,
    }
  });
  const createdUser = await user.save();
  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isSeller:user.isSeller,
    token: generateToken(createdUser),
    });
  })
);

userRouter.get("/:id" , expressAsyncHandler(async(req,res) =>{
  const user = await User.findById(req.params.id);
  if(user){
    res.send(user)
  } else {
    res.status(404).send({message:'User Not Found'})
  }
})
)


userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.isSeller = Boolean(req.body.isSeller);
      user.isAdmin = Boolean(req.body.isAdmin);
      if(user.isSeller) {
        user.seller.name= req.body.sellerName || user.seller.name;
        user.seller.logo = req.body.sellerLogo || user.seller.logo;
        user.seller.description = req.body.sellerDescription || user.seller.description
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(updatedUser),
      });
    }
  })
);

userRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req,res) =>{
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin === true){
      res.status(400).send({ message: ' Cannot delete Admin user! ' })
      return;
    }
    const deleteUser = await user.remove();
    res.send({ message:'User deleted' , user: deleteUser });
  } else {
    res.status(404).send({ message: ' User not found ' });
  }
}))

userRouter.put('/:id' , isAuth , isAdmin, expressAsyncHandler(async(req,res) =>{
  const user = await User.findById(req.paramas.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isSeller = req.body.isSeller === user.isSeller ? user.isSeller : req.body.isSeller;
    user.isAdmin = req.body.isAdmin === user.isAdmin ? user.isAdmin : req.body.isAdmin;
    const updatedUser = await user.save();
    res.send({ message: 'User updated' , user: updatedUser });
  } else {
    res.status(404).send({ message: 'User not found! ' })
  }
}));

userRouter.get('/top-sellers/sellers' , expressAsyncHandler(async (req,res) =>{

  const topSellers = await User.find({isSeller: true}).sort({'seller.rating': -1 }).limit(3);

  res.send(topSellers)
})
);

export default userRouter;