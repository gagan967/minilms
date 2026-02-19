import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';

export function Dashboard() {
  const { user, api } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    const path = user?.role === 'student' ? '/dashboard/student' : user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/instructor';
    setLoading(true);
    api(path).then((r) => r.json()).then(setData).catch(console.error).finally(() => setLoading(false));
  }, [user?.role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Layout><div className="flex items-center justify-center py-12">Loading...</div></Layout>;

  if (user?.role === 'student') {
    return (
      <Layout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <button onClick={fetchData} className="px-3 py-1.5 text-sm rounded-lg border border-indigo-300 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">Refresh</button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Enrolled Courses</h2>
            {data?.enrolledCourses?.length ? (
              <ul className="space-y-2">
                {data.enrolledCourses.map((e) => (
                  <li key={e.id} className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <Link to={`/courses/${e.Course?.id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">{e.Course?.title}</Link>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{e.Course?.Assignments?.length || 0} assignments</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">No enrolled courses. <Link to="/courses" className="text-indigo-600 dark:text-indigo-400 hover:underline">Browse courses</Link></p>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">Submitted Assignments</h2>
            {data?.submissions?.length ? (
              <ul className="space-y-2">
                {data.submissions.map((s) => (
                  <li key={s.id} className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="font-medium">{s.Assignment?.title}</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{s.Assignment?.Course?.title}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">No submissions yet.</p>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  if (user?.role === 'instructor' || user?.role === 'admin') {
    return (
      <Layout>
        <h1 className="text-2xl font-bold mb-6">{user.role === 'admin' ? 'Admin' : 'Instructor'} Dashboard</h1>
        <h2 className="text-lg font-semibold mb-3">Courses</h2>
        {data?.courses?.length ? (
          <ul className="space-y-2">
            {data.courses.map((c) => (
              <li key={c.id} className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Link to={`/courses/${c.id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">{c.title}</Link>
                <p className="text-sm text-slate-500 dark:text-slate-400">{c.Instructor?.name} - {c.Assignments?.length || 0} assignments</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">No courses. <Link to="/courses" className="text-indigo-600 dark:text-indigo-400 hover:underline">Create one</Link></p>
        )}
        {user.role === 'admin' && data?.users && data.users.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">All Users</h2>
            <ul className="space-y-2">
              {data.users.map((u) => (
                <li key={u.id} className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  {u.name} - {u.email} - {u.role}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Layout>
    );
  }

  return <Layout><div>Unknown role</div></Layout>;
}
