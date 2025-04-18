import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructor } from '../features/instructor/instructorSlice';

const InstructorProfile = () => {
  const { username } = useParams();
  const dispatch = useDispatch();

  const { instructorInfo, courses, loading, error } = useSelector(
    (state) => state.instructor
  );

  useEffect(() => {
    if (username) {
      dispatch(fetchInstructor(username));
    }
  }, [dispatch, username]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <img
          src={instructorInfo?.profileImage || '/default-avatar.png'}
          alt="Instructor"
          className="w-20 h-20 rounded-full mb-2"
        />
        <h2 className="text-2xl font-bold">{instructorInfo?.name}</h2>
        <p className="text-gray-600">{instructorInfo?.bio}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">Courses</h3>
        {courses?.length === 0 ? (
          <p>No courses published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div key={course._id} className="border p-4 rounded shadow">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h4 className="text-lg font-semibold">{course.title}</h4>
                <p className="text-sm text-gray-600">{course.description}</p>
                <p className="font-medium mt-2">₹{course.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorProfile;
