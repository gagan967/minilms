import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';

export function CourseDetail() {
  const { id } = useParams();
  const { user, api } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const fetchCourse = useCallback(() => {
    api(`/courses/${id}`)
      .then((r) => r.json())
      .then((c) => {
        setCourse(c);
        if (user?.role === 'student') {
          api('/dashboard/enrolled-courses')
            .then((r) => r.json())
            .then((list) => setEnrolled(Array.isArray(list) && list.some((e) => e.id === c.id)))
            .catch(() => {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, user?.role]);

  useEffect(() => {
    setLoading(true);
    fetchCourse();
  }, [fetchCourse]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const res = await api(`/courses/${id}/enroll`, { method: 'POST' });
      if (res.ok) {
        setEnrolled(true);
        fetchCourse();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed');
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (!course) return <Layout><div>Course not found</div></Layout>;

  const assignments = course.Assignments || [];
  const canEnroll = user?.role === 'student' && !enrolled;

  return (
    <Layout>
      <Link to="/courses" className="text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block">← Back to courses</Link>
      <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-4">{course.description || 'No description'}</p>
      <p className="text-sm text-slate-500 mb-4">Instructor: {course.Instructor?.name}</p>

      {canEnroll && (
        <button
          onClick={handleEnroll}
          disabled={enrolling}
          className="mb-6 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
        >
          {enrolling ? 'Enrolling...' : 'Enroll in course'}
        </button>
      )}
      {enrolled && <p className="mb-4 text-green-600 dark:text-green-400">You are enrolled in this course.</p>}
      {['admin', 'instructor'].includes(user?.role) && (
        <Link to={`/courses/${id}/assignments`} className="mb-4 inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Manage Assignments</Link>
      )}

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Assignments</h2>
        <button onClick={() => { setLoading(true); fetchCourse(); }} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Refresh</button>
      </div>
      {assignments.length ? (
        <ul className="space-y-2">
          {assignments.map((a) => (
            <li key={a.id} className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Link to={`/courses/${id}/assignments/${a.id}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                {a.title}
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500 dark:text-slate-400">No assignments yet.</p>
      )}
    </Layout>
  );
}
