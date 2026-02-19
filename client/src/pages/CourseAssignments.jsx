import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';

export function CourseAssignments() {
  const { id } = useParams();
  const { user, api } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [creating, setCreating] = useState(false);

  const canCreate = ['admin', 'instructor'].includes(user?.role);

  useEffect(() => {
    api(`/courses/${id}`).then((r) => r.json()).then(setCourse);
    api(`/assignments/course/${id}`).then((r) => r.json()).then(setAssignments).finally(() => setLoading(false));
  }, [id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api('/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, dueDate, courseId: id }),
      });
      if (res.ok) {
        setShowCreate(false);
        setTitle('');
        setDescription('');
        setDueDate('');
        const list = await api(`/assignments/course/${id}`).then((r) => r.json());
        setAssignments(list);
      } else {
        const d = await res.json();
        alert(d.error || 'Failed');
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <Layout>
      <Link to={`/courses/${id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block">Back to course</Link>
      <h1 className="text-2xl font-bold mb-6">{course?.title || 'Assignments'}</h1>
      {canCreate && (
        <button onClick={() => setShowCreate(!showCreate)} className="mb-4 px-4 py-2 rounded-lg bg-indigo-600 text-white">
          {showCreate ? 'Cancel' : 'Create Assignment'}
        </button>
      )}
      {showCreate && (
        <form onSubmit={handleCreate} className="mb-6 p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mb-2 px-4 py-2 rounded border" required />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mb-2 px-4 py-2 rounded border" />
          <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full mb-2 px-4 py-2 rounded border" required />
          <button type="submit" disabled={creating} className="px-4 py-2 rounded bg-indigo-600 text-white">Create</button>
        </form>
      )}
      {loading ? <div>Loading...</div> : (
        <ul className="space-y-2">
          {assignments.map((a) => (
            <li key={a.id} className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Link to={`/courses/${id}/assignments/${a.id}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">{a.title}</Link>
              <p className="text-sm text-slate-500 dark:text-slate-400">Due: {new Date(a.dueDate).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
