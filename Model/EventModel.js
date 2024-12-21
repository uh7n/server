import mongoose from "mongoose";

const EventSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true }, 
    price: { type: Number, required: true },
    tickets: { type: Number, required: true }, 
    image: { type: String, required: true }, 
    schedule: { type: String, required: true },
    organizer: { type: String, required: true },
    contact: { type: String, required: true }, 
    status: { type: String,  required: true },
    notes: { type: String, required: false },
});

const EventModel=mongoose.model("Events",EventSchema,"Events");

export default EventModel;
