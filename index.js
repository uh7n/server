import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Model/UserModel.js";
import AdminModel from "./Model/AdminModel.js";
import EventModel from "./Model/EventModel.js";
import PostsModel from "./Model/PostModel.js";
import bcrypt from 'bcrypt';



var api = express();
api.use(cors());
api.use(express.json());

const connection =
  "mongodb+srv://sasa:sasa123@mycluster.koxjysl.mongodb.net/EventBooking?retryWrites=true&w=majority&appName=myCluster";
mongoose.connect(connection);

// npm run dev
api.listen(8080, () => {
  console.log("Server Up & Running...");
});

api.post("/insertUser", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("Email already exists.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash password
    const newUser = new UserModel({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword, // Store hashed password
      image: req.body.image,
    });

    await newUser.save();
    res.status(201).send("User added successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


api.get("/allUser", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json({
      users});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

api.post("/Login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", { email, password }); // Debug incoming request

    const user = await UserModel.findOne({ email });

    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({
        message: "User Not Found.",
      });
    }

    console.log("Stored password hash:", user.password); // Debug stored password

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({
        message: "Invalid Credentials.",
      });
    }

    console.log("Successful login for user:", email);

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      message: "Login successful.",
    });
  } catch (err) {
    console.error("Error in /Login:", err);
    return res.status(500).json({
      message: "An error occurred. Please try again later.",
    });
  }
});



api.post("/AdminLogin", async (req, res) => {
  try {
    const Admin = await AdminModel.findOne({ email: req.body.email });
    if (!Admin) {
      return res.status(501).json({
        message: "Admin Not Found..",
      });
    } else {
      if (Admin.password === req.body.password) {
        return res.status(200).json({
          Admins: Admin,
          message: "success",
        });
      } else {
        return res.status(401).json({
          message: "Invalid Credentials..",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
});

api.post("/insertEvent", async (req, res) => {
  try {
    const Event = await EventModel.findOne({ name: req.body.name });
    if (Event) {
      res.status(400).send("Event Already Exists..");
    } else {
      const new_Event = new EventModel({
        name: req.body.name,              
        description: req.body.description, 
        date: req.body.date,              
        location: req.body.location,      
        type: req.body.type,              
        price: req.body.price,            
        tickets: req.body.tickets,        
        image: req.body.image,            
        schedule: req.body.schedule,      
        organizer: req.body.organizer,    
        contact: req.body.contact,        
        status: req.body.status,          
        notes: req.body.notes             
    });
      await new_Event.save();
      res.status(201).send("Event Added Successfully..");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});



api.get("/getEvents", async (req, res) => {
  try {
    const events = await EventModel.find();
    res.json({
      events});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


api.get("/getEvent/:id", async (req, res) => {
  try {  
    const event = await EventModel.findById(req.params.id);
    if (!event){
      return res.status(404).json({ message: "Event not found" });
    }
    else{
      res.json(event);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});



api.put("/updateEvent", async (req, res) => {
  try {
    const eventId = req.body.eventId;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }
    const {
      name,description,date,location,type,price,tickets,
      image,schedule,organizer,contact,status,notes,
    } = req.body;
    const event = await EventModel.findOne({ _id: eventId });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.name = name || event.name;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.type = type || event.type;
    event.price = price || event.price;
    event.tickets = tickets || event.tickets;
    event.image = image || event.image;
    event.schedule = schedule || event.schedule;
    event.organizer = organizer || event.organizer;
    event.contact = contact || event.contact;
    event.status = status || event.status;
    event.notes = notes || event.notes;

    await event.save();
    res.status(200).send({ event, message: "Event updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




api.delete("/deleteEvent/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const delEvent = await EventModel.findOneAndDelete({ _id: eventId });
    if (delEvent) {
      res.send({ message: "Event Deleted" });
    } else {
      res.status(404).send({ message: "Event Not Found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


api.delete("/deleteUser/:UserId", async (req, res) => {
  try {
    const UserId = req.params.UserId;
    const delUser = await UserModel.findOneAndDelete({ _id: UserId });
    if (delUser) {
      res.send({ message: "User Deleted" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});







api.get("/getEventDetails/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const event = await EventModel.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.schedule = Array.isArray(event.schedule) ? event.schedule : [];
    res.json(event);
  } catch (error) {
    console.error("Error fetching event details:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch event details. " + error.message });
  }
});



api.post("/logout", async (req, res) => {
  try { 
    res.send({ message: "Logged Out Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

api.post("/savePost",async(req,res)=>{
  try{
      const newPosts=new PostsModel({
          postMsg:req.body.postMsg,
          email:req.body.email,
          rating:req.body.rating,
          // lat:req.body.lat,
          // lug:req.body.lug,
      });
      await newPosts.save();
      res.status(201).send({post:newPosts,message:"Posted"});
      // res.send({post:newPosts,message:"Posted"});
     }
     catch(err){
         res.status(500).json({massage:err});
     }
 });


api.get("/getPosts", async(req,res)=>{
try{
  const postsWithUser = await PostsModel.aggregate([
      {
          $lookup:{
              from:"PostIt",
              localField:"email",
              foreignField:"email",
              as:"users",
              },
      },
      {
          $sort:{createdAt:-1}
      },
      {
          "$project":{
              "users.password":0,
              "users.email":0,
          }
      },
  ]);
  res.json({posts:postsWithUser});
}catch(err){
  res.status(500).json({massage:err});
}
});


// const saltRounds = 10;
// api.put("/updateUserPassword", async (req, res) => {
//   const { currentPassword, newPassword } = req.body;
//   const userId = req.user.id; // Assuming you have user authentication and can get the user ID

//   try {
//       const user = await UserModel.findById(userId);
//       if (!user) {
//           return res.status(404).json({ message: "User not found" });
//       }

//       // Check if the current password is correct
//       const isMatch = await bcrypt.compare(currentPassword, user.password);
//       if (!isMatch) {
//           return res.status(401).json({ message: "Current password is incorrect" });
//       }

//       // Validate new password
//       if (newPassword.length < 8) {
//           return res.status(400).json({ message: "Password must be at least 8 characters long" });
//       }

//       // Update the password
//       user.password = await bcrypt.hash(newPassword, saltRounds);
//       await user.save();
//       res.status(200).json({ message: "Password updated successfully" });
//   } catch (error) {
//       res.status(500).json({ message: error.message });
//   }
// });


api.put("/updateUserName", async (req, res) => {
  console.log("Request Body:", req.body); // Log the request body for debugging
  const { email, newName } = req.body;

  if (!email || !newName || newName.trim().length < 3) {
    return res
      .status(400)
      .json({ message: "Invalid input: Email and a valid name are required." });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.name = newName.trim();
    await user.save();

    res.status(200).json({
      message: "Name updated successfully",
      name: user.name,
    });
  } catch (error) {
    console.error("Error in /updateUserName:", error);
    res.status(500).json({ message: "An error occurred while updating the name." });
  }
});


api.put("/resetPassword", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, current password, and new password are required." });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    console.log("Stored password hash:", user.password);
    console.log("Provided current password:", currentPassword);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log("Password reset successfully for user:", user.email);
    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error in /resetPassword:", error);
    res.status(500).json({ message: "An error occurred while resetting the password." });
  }
});