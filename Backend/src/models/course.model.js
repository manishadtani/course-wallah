// backend/src/models/Course.js
import mongoose from 'mongoose';

// Sub-schema for Lectures within a Section
const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Lecture title is required'],
        trim: true,
    },
    videoKey: { // Identifier for the video (e.g., S3 object key, YouTube ID, etc.)
        type: String,
        // Consider making required later if video is the primary content
    },
    textContent: { // Optional text content for a lecture (like notes, code snippets)
        type: String,
        trim: true,
    },
    duration: { // Optional: Estimated duration (e.g., in minutes)
        type: Number,
    },
    isFreePreview: { // Can students view this lecture before buying?
        type: Boolean,
        default: false,
    }
    // Add other fields if needed: resources (links/files), order within section
}, { _id: true }); // Ensure lectures get their own IDs if needed

// Sub-schema for Sections within a Course
const sectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Section title is required'],
        trim: true,
    },
    lectures: [lectureSchema] // Array of lectures
    // Add other fields if needed: order within course
}, { _id: true }); // Ensure sections get their own IDs

// Main Course Schema
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
        unique: true // Good practice to keep titles unique
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Course price is required'],
        min: [0, 'Price cannot be negative'],
        default: 0,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Reference to the User model (IMPORTANT: Use 'User' or 'user' based on what you used in mongoose.model for User)
                     // If you used mongoose.model('user', ...), use 'user' here.
                     // If you used mongoose.model('User', ...), use 'User' here.
                     // Let's assume you'll stick to 'user' for now:
                     // ref: 'user',
        required: true
    },
    thumbnail: { // URL or identifier for the course's main image
      type: String,
      // Maybe add a default thumbnail later
    },
    sections: [sectionSchema], // Array of course sections
    isPublished: { // Allows instructor to keep course hidden while working on it
        type: Boolean,
        default: false
    },
    category: { // Optional field for grouping courses
        type: String,
        trim: true
    },
    language: { // Optional: Language of the course
        type: String,
        default: 'English'
    },
    // Maybe add average rating, number of students later
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Indexing (Optional but good for performance later)
// Create an index on the instructor field for faster lookups of courses by instructor
courseSchema.index({ instructor: 1 });
// Create an index on isPublished for filtering published courses quickly
courseSchema.index({ isPublished: 1 });


// Use 'Course' (PascalCase) as the model name - standard convention
const course = mongoose.model('course', courseSchema);

export default course;