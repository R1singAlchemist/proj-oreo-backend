const express = require('express');
const connectDB = require('./config/db');
const cookieParser=require('cookie-parser');

const dotenv = require('dotenv');
const carbookings = require ('./routes/carbookings');
const providers = require ('./routes/providers');
const app = express();
const auth = require('./routes/auth');

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();


const PORT = process.env.PORT || 5003;

//Body Parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

app.use('/api/v1/auth', auth)

app.use('/api/v1/carbookings',carbookings);

app.use('/api/v1/providers', providers)

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

//Handle unhandled promise rejections
process.on('unhandledRejected',(err,promise)=>{
  console.log(`Error: ${err.message}`);
  //Close server & exit process
  server.close(()=>process.exit(1));

})
