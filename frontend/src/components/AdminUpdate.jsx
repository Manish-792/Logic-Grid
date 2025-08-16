import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';

function AdminUpdatePage() {
    // If your route is /admin/update/:id, you can get the id like this:
    // const { id } = useParams(); 
    
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // You would typically fetch the problem data here using its ID
    // useEffect(() => {
    //   const fetchProblemData = async () => {
    //     try {
    //       setLoading(true);
    //       const { data } = await axiosClient.get(`/problem/problemById/${id}`);
    //       setProblem(data);
    //       setLoading(false);
    //     } catch (err) {
    //       setError('Failed to fetch problem data.');
    //       setLoading(false);
    //     }
    //   };
    //   if (id) {
    //     fetchProblemData();
    //   }
    // }, [id]);

    if (loading) {
        return (
            <div 
                className="text-center p-8 font-outfit" 
                style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}
            >
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div 
                className="text-center p-8 font-outfit" 
                style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}
            >
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 font-outfit" style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
            {/* Scoped theme styles */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet" />
            <style>{`
                :root { --bg:#0b0f14; --header:#111827ee; --panel:rgba(17,24,39,.55); --border:#2a2f3a; --text:#e5e7eb; --muted:#9ca3af; --accent:#22c55e; --neon:#22d3ee; --glass-blur:12px; }
                .glass{ background:var(--panel); backdrop-filter:blur(var(--glass-blur)); -webkit-backdrop-filter:blur(var(--glass-blur)); border:1px solid var(--border) }
                .neon-btn, .neon-input{ border:1px solid var(--border) }
            `}</style>

            <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text)' }}>Update Problem</h1>

            <div className="glass rounded-xl p-6">
                {/* Your update form will go here */}
                <p style={{ color: 'var(--muted)' }}>Update form will be here.</p>
            </div>
        </div>
    );
}

export default AdminUpdatePage;