import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient'

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    }
  };


  if (loading) {
    return (
      <div 
        className="flex justify-center items-center h-64 font-outfit"
        style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}
      >
        <span className="loading loading-spinner loading-lg" style={{ color: 'var(--accent)' }}></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert shadow-lg my-4 glass font-outfit" style={{ border: `1px solid var(--border)` }}>
        <div style={{ color: 'var(--text)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" style={{ color: 'var(--warn)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 font-outfit" style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`
        :root { --bg:#0b0f14; --header:#111827ee; --panel:rgba(17,24,39,.55); --border:#2a2f3a; --text:#e5e7eb; --muted:#9ca3af; --accent:#22c55e; --warn:#eab308; --danger:#ef4444; --neon:#22d3ee; --glass-blur:12px; }
        .glass{ background:var(--panel); backdrop-filter:blur(var(--glass-blur)); -webkit-backdrop-filter:blur(var(--glass-blur)); border:1px solid var(--border) }
        .neon-btn{ border:1px solid var(--border); transition: transform .22s ease, box-shadow .22s ease }
        .neon-btn:hover{ transform: translateY(-1px) scale(1.03); box-shadow: 0 8px 20px rgba(0,0,0,.3), 0 0 18px var(--neon) }
        .tag-sm{ padding:.15rem .5rem; border-radius:9999px; font-weight:600 }
      `}</style>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
          Delete Problems
        </h1>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full glass" style={{ backgroundColor: 'var(--panel)' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--header)' }}>
              <th className="w-1/12" style={{ color: 'var(--text)' }}>#</th>
              <th className="w-4/12" style={{ color: 'var(--text)' }}>Title</th>
              <th className="w-2/12" style={{ color: 'var(--text)' }}>Difficulty</th>
              <th className="w-3/12" style={{ color: 'var(--text)' }}>Tags</th>
              <th className="w-2/12" style={{ color: 'var(--text)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr 
                key={problem._id}
                className=""
                style={{ backgroundColor: index % 2 === 0 ? 'var(--panel)' : 'transparent', color: 'var(--text)' }}
              >
                <th style={{ color: 'var(--text)' }}>{index + 1}</th>
                <td style={{ color: 'var(--text)' }}>{problem.title}</td>
                                  <td>
                    <span className="badge tag-sm" style={{ backgroundColor: problem.difficulty === 'Easy' ? 'var(--accent)' : problem.difficulty === 'Medium' ? 'var(--warn)' : 'var(--danger)', color: '#0b0f15' }}>{problem.difficulty}</span>
                  </td>
                <td>
                  <span className="badge tag-sm" style={{ backgroundColor: 'var(--header)', color: 'var(--muted)', border: `1px solid var(--border)` }}>{problem.tags}</span>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleDelete(problem._id)}
                      className="btn btn-sm font-semibold transition-all duration-200 hover:scale-105 neon-btn"
                      style={{ backgroundColor: 'var(--danger)', color: '#fff', border: 'none' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDelete;