import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';

export function Courses() {
  const { user, api } = useAuth();
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const canCreate = ['admin', 'instructor'].includes(user?.role);

  const fetchCourses = () => {
    setLoading(true);
    api(`/courses?page=${page}&limit=10`)
      .then((r) => r.json())
      .then((d) => {
        setCourses(d.courses || []);
        setTotalPages(d.totalPages || 1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchCourses(), [page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api('/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (res.ok) {
        setShowCreate(false);
        setTitle('');
        setDescription('');
        fetchCourses();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed');
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this course?')) return;
    try {
      const res = await api(`/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCourses();
      } else {
        alert('Failed to delete');
      }
    } catch (e) {
      alert('Error');
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        {canCreate && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {showCreate ? 'Cancel' : 'Create Course'}
          </button>
        )}
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-6 p-4 rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20">
          <h3 className="font-semibold mb-3">New Course</h3>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-2 px-4 py-2 rounded-lg border border-white/30 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 shadow-inner"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-2 px-4 py-2 rounded-lg border border-white/30 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 shadow-inner"
          />
          <button type="submit" disabled={creating} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">
            Create
          </button>
        </form>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ul className="space-y-4">
            {courses.map((c) => (
              <li key={c.id} className="p-4 rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20">
                <Link to={`/courses/${c.id}`} className="text-lg font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                  {c.title}
                </Link>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{c.description || 'No description'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                  Instructor: {c.Instructor?.name || 'N/A'}
                </p>
                {(user?.role === 'admin' || user?.id === c.instructorId) && (
                  <button onClick={() => handleDelete(c.id)} className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
                    Delete Course
                  </button>
                )}
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="mt-4 flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 rounded border disabled:opacity-50">
                Prev
              </button>
              <span className="py-1">Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 rounded border disabled:opacity-50">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
