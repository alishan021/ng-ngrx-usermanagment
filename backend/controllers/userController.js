
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, generateAccessToken, generateRefreshToken } = require('../middlewares/authMiddleware')
const RefreshToken = require('../models/refreshToken');

const User = require('../models/user');


// Register new user
exports.registerUser = async (req, res) => {

  
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ result: false, message: 'User already exists', data: null });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const role = (req.body?.role === 'admin')? 'admin' : 'user';
    const profileImage = req.file.path; 
    const user = new User({ username, email, password: hashedPassword, role, profileImage });
    await user.save();

    res.status(201).json({
      result: true,
      message: "user registration successful",
      data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateToken(user._id, user.role)
        }
      });

    } catch (err) {
      console.log('error Message : ' + err.message);
      res.status(500).json({ result: false, message: err.message, data: null });
  }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) return res.status(401).json({ result: false, message: 'Invalid credentials ( Email )' , data: null });
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) return res.status(401).json({ result: false, message: 'Invalid credentials ( Password )', data: null });

      const refreshToken = generateRefreshToken(user._id, user.role);
      await RefreshToken.create({ 
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
      })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
  
      res.status(200).json({
        message: "Login successful",
        result: true,
        data:{
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateAccessToken(user._id, user.role),
          profileImage: user.profileImage
        }
      });
    } catch (err) {
      console.log('error Message : ' + err.message);
      res.status(500).json({ message: err.message, result: false, data: null  });
    }
  };

  

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ result: true, message: 'Get user successful', data: users });
  } catch (err) {
      console.log('error Message : ' + err.message);
    res.status(500).json({ result: false, message: err.message, data: null });
  }
};


exports.createUser = async ( req, res ) => {

  const { username, email, password } = req.body;
  console.log(req.file);

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ result: false, message: 'User already exists', data: null });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const role = (req.body?.role === 'admin')? 'admin' : 'user';
    const profileImage = req.file.path || ""; 
    const user = new User({ username, email, password: hashedPassword, role, profileImage });
    await user.save();

    res.status(201).json({
      result: true,
      message: "user registration successful",
      data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        }
      });

    } catch (err) {
      console.log('error Message createUser : ' + err.message);
    res.status(500).json({ result: false, message: err.message, data: null });
  }  
}


exports.editUser = async ( req, res ) => {

  const userId = req.params.id;
  const updates = req.body;
  if(req.file.path) updates.profileImage = req.file.path;

  try {

   
    if(updates.password.trim() === "") {
      delete updates.password;
    }else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);  
      updates.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,       // return the updated document
      runValidators: true // validate updates against schema
    });

    if (!updatedUser) {
      return res.status(404).json({ result: false, message: 'User not found', data: null });
    }

    res.json({ result: true, message: 'User updated successfully', data: updatedUser });
  } catch (error) {
      console.log('error Message editUser : ' + err.message);
    res.status(500).json({ result: false, message: `Something went wrong${error}`, data: null });
  }
};


exports.deleteUser = async ( req, res ) => {

  const userId = req.params.id

  try {
    const deletedUser = await User.deleteOne({ _id: userId });

    if(!deletedUser) return res.status(404).json({ result: false, message: 'User not found ( delete )', data: null });

    res.json({ result: true, message: 'User deleted successfully', data: deletedUser });

  } catch (error) {
      console.log('error Message deleteUser : ' + err.message);
    res.status(500).json({ result: false, message: `Something went wrong${error}`, data: null });
  }

}


exports.switchRole = async (req, res) => {
  try {
    const userId = req.params.id;
    let role = req.body.role;

    if (!userId) {
      return res.status(400).json({ result: false, message: 'User ID is required', data: null });
    }

    if (!role) {
      return res.status(400).json({ result: false, message: 'Role is required', data: null });
    }

    role = (role === 'admin') ? 'user' : 'admin';
    const result = await User.updateOne({ _id: userId }, { role });

    if (result.matchedCount === 0) {
      return res.status(404).json({ result: false, message: 'User not found', data: null });
    }

    return res.status(200).json({ result: true, message: 'User role updated successfully', data: {result, role} });
  } catch (error) {
    // console.error(error);
      console.log('error Message switchRole : ' + err.message);
    return res.status(500).json({ result: false, message: 'Something went wrong', data: null });
  }
};


exports.refreshAccessToken = async ( req, res) => {

  console.log('----------- refresh token called ---------------------------- ');
  const tokenFromCookie = req.cookies.refreshToken;
  if (!tokenFromCookie) return res.status(401).json({ result: false, message: 'No refresh token found', data: null });

  try {

      const tokenInDB = await RefreshToken.findOne({ token: tokenFromCookie });
      if(!tokenInDB || tokenInDB.expiresAt < new Date()) {
          if(tokenInDB.expiresAt < new Date()) await RefreshToken.deleteOne({ token: tokenInDB });
          return res.status(403).json({ result: false, message: 'Refresh token invalid or expired', data: null });
      } 
      const decodeToken = jwt.verify(tokenFromCookie, process.env.JWT_REFRESH_SECRET );
      const accessToken = jwt.sign({ id: decodeToken.id, role: decodeToken.role }, process.env.JWT_ACCESS_SECRET );
      res.status(201).json({ result: true, message: 'New access token created', data: { token: accessToken }});

  }catch(err) {
    console.log(err);
     console.log('error Message refreshAccessToken : ' + err.message);
    return res.status(500).json({ result: false, message: 'Something went wrong', data: null });
  }
}