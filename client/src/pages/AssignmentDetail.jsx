import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';

export function AssignmentDetail() {
  const { id, assignmentId } = useParams();
  const { user, api } = useAuth();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mySubmission, setMySubmission] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const courseRes = await api(`/courses/${id}`);
        const c = await courseRes.json();
        const a = c.Assignments?.find((x) => x.id === assignmentId);
        setAssignment(a);

        if (['admin', 'instructor'].includes(user?.role)) {
          const subRes = await api(`/submissions/assignment/${assignmentId}`);
          const subs = await subRes.json();
          setSubmissions(Array.isArray(subs) ? subs : []);
        }
        if (user?.role === 'student') {
          const myRes = await api('/submissions/my');
          const list = await myRes.json();
          const m = Array.isArray(list) ? list.find((s) => s.Assignment?.id === assignmentId) : null;
          setMySubmission(m || null);
          setContent(m?.content ?? '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, assignmentId, user?.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    try {
      const res = await api('/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, assignmentId }),
      });
      const d = await res.json();
      if (res.ok) {
        setMySubmission(d);
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        setSubmitError(d.error || 'Submission failed');
      }
    } catch (err) {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!assignment) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <Link to={`/courses/${id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block">Back to course</Link>
      <h1 className="text-2xl font-bold mb-2">{assignment.title}</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-4">{assignment.description}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Due: {new Date(assignment.dueDate).toLocaleString()}</p>

      {user?.role === 'student' && (
        <form onSubmit={handleSubmit} className="mb-8">
          <label className="block font-medium mb-2">Your submission (text)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="Enter your assignment submission..."
            className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
          {submitSuccess && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">Submission saved successfully!</p>
          )}
          {submitError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{submitError}</p>
          )}
          <button type="submit" disabled={submitting} className="mt-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50">
            {submitting ? 'Submitting...' : mySubmission ? 'Update submission' : 'Submit'}
          </button>
        </form>
      )}

      {['admin', 'instructor'].includes(user?.role) && submissions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Submissions</h2>
          <ul className="space-y-2">
            {submissions.map((s) => (
              <li key={s.id} className="p-4 rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20">
                <p className="font-medium">{s.User?.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{s.User?.email}</p>
                <pre className="mt-2 text-sm whitespace-pre-wrap">{s.content}</pre>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
}
