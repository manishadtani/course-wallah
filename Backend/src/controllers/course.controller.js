import Course from '../models/course.model.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    thumbnail,
    category,
    language,
    sections,
    isPublished // optionally sent from frontend
  } = req.body;

  const instructorId = req.user._id; // assuming auth middleware adds `req.user`

  const newCourse = new Course({
    title,
    description,
    price,
    thumbnail,
    category,
    language,
    sections,
    isPublished: isPublished || false,
    instructor: instructorId
  });

  const savedCourse = await newCourse.save();

  res.status(201).json({
    success: true,
    data: savedCourse,
  });
});
