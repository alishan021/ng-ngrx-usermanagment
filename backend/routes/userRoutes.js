const express = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback( null, 'uploads/')
    },
    filename : (req, file, callback) => {
        const suffixName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        callback( null, suffixName + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

const router = express.Router();

const { registerUser, getUsers, createUser, editUser, deleteUser, switchRole, refreshAccessToken } = require('../controllers/userController');
const { loginUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');



router.post('/register', upload.single('profile-image'), registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);

router.get('/', protect, getUsers);
router.post('/new-user', protect, adminOnly, upload.single('profile-image'), createUser); 
router.put('/edit-user/:id', protect, upload.single('profile-image'), editUser); 
router.delete('/delete-user/:id', protect, adminOnly, deleteUser); 
router.patch('/switch-role/:id', protect, adminOnly, switchRole); 


// Admin-only
router.get('/all', protect, adminOnly, getUsers); 
// router.post('/new-user', protect, adminOnly, createUser); 
// router.get('/edit-user', protect, adminOnly, editUser); 
// router.get('/delete-user', protect, adminOnly, deleteUser); 
// router.get('/switch-role', protect, adminOnly, switchRole); 

module.exports = router;
