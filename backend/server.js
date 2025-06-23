// const express = require('express');
// const { connectMongoDB } = require('./config/db');
// const { default: router } = require('./routes/userRoutes');
// require('dotenv').config();

// const app = express();

// app.use('/', router.)


// app.get('/', ( req, res) => {
//     res.end('hai');
// })


// const port = process.env.PORT || 4300;
// app.listen( port , () => {
//     console.log(`App running on http://localhost:${port}`)
// });

// // connectMongoDB();

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4210', credentials: true }));
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
