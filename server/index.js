// Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors");

// Routes
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const commentRoutes = require("./routes/comment");

const PORT = 4000;

// Server Setup
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// const corsOptions = {
// 	origin: ['http://localhost:3000'], 
// 	credentials: true, 
// 	optionsSuccessStatus: 200
// }

// app.use(cors(corsOptions));


//MongoDB database
mongoose.connect("mongodb+srv://mico_cali:pass123@cluster0.4ipfp.mongodb.net/blog-API?retryWrites=true&w=majority&appName=Cluster0");

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

// Backend Routes 
app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);
app.use("/comment", commentRoutes);

// Server Gateway Response
if(require.main === module){
	app.listen(PORT || 3000, ()=> {
		console.log(`API is now online on port ${PORT || 3000}`)
	})
}

module.exports = {app, mongoose}