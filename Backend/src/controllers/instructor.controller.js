import User from '../models/user.model.js';
import Course from '../models/course.model.js';

export const getInstructorByUsername = async (req, res) => {
  console.log(req.params.username)
  const { username } = req.params;

  const instructor = await User.findOne({ brandSlug: username, role: 'Instructor', isApproved: true }).select('-password');
  console.log(instructor)
  if (!instructor) {
    return res.status(404).json({ message: 'Instructor not found or not approved' });
  }

  const courses = await Course.find({ instructor: instructor._id, isPublished: true });

  res.status(200).json({
    success: true,
    data: {
      instructor: {
        name: instructor.name,
        bio: instructor.bio,
        profileImage: instructor.profileImage,
      },
      courses,
    },
  });
};
