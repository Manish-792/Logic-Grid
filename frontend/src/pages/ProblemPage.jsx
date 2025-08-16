import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import { logoutUser } from '../authSlice';

// Use the same palette via CSS variables like Homepage (supports future toggles)
const ui = {
  bg: 'var(--bg)',
  panel: 'var(--panel)',
  header: 'var(--header)',
  border: 'var(--border)',
  accent: 'var(--accent)',
  text: 'var(--text)',
  muted: 'var(--muted)',
  codeBg: 'var(--code-bg)',
  passBg: '#0f1f17',
  failBg: '#1f1515',
  danger: 'var(--danger)'
};

const langMap = {
        cpp: 'C++',
        java: 'Java',
        javascript: 'JavaScript'
};


const ProblemPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const [isDark, setIsDark] = useState(() => (localStorage.getItem('theme') ?? 'dark') === 'dark');
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  let {problemId}  = useParams();

  

  const { handleSubmit } = useForm();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

 useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
       
        
        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;

        setProblem(response.data);
        
        setCode(initialCode);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    try {
      monaco.editor.defineTheme('leetcode-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: '', background: '0b0f15', foreground: 'e5e7eb' }
        ],
        colors: {
          'editor.background': '#0b0f15',
          'editor.foreground': '#e5e7eb',
          'editor.lineHighlightBackground': '#1f293733',
          'editor.selectionBackground': '#1f293780',
          'editor.inactiveSelectionBackground': '#1f293730',
          'editorLineNumber.foreground': '#9ca3af',
          'editorLineNumber.activeForeground': '#22c55e',
          'editorCursor.foreground': '#22c55e',
          'editorGutter.background': '#0b0f15',
          'editorWidget.background': '#0b0f15',
          'editorWidget.border': '#2a2f3a',
          'editorIndentGuide.background': '#252b36',
          'editorIndentGuide.activeBackground': '#2f3746',
          'dropdown.background': '#0b0f15',
          'dropdown.border': '#2a2f3a',
          'input.background': '#0b0f15',
          'input.border': '#2a2f3a'
        }
      });
      monaco.editor.defineTheme('leetcode-light', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: '', background: 'ffffff', foreground: '0f172a' }
        ],
        colors: {
          'editor.background': '#ffffff',
          'editor.foreground': '#0f172a',
          'editor.lineHighlightBackground': '#e2e8f033',
          'editor.selectionBackground': '#93c5fd66',
          'editor.inactiveSelectionBackground': '#93c5fd3d',
          'editorLineNumber.foreground': '#64748b',
          'editorLineNumber.activeForeground': '#16a34a',
          'editorCursor.foreground': '#22c55e',
          'editorGutter.background': '#ffffff',
          'editorWidget.background': '#ffffff',
          'editorWidget.border': '#e5e7eb',
          'editorIndentGuide.background': '#e5e7eb',
          'editorIndentGuide.activeBackground': '#cbd5e1',
          'dropdown.background': '#ffffff',
          'dropdown.border': '#e5e7eb',
          'input.background': '#ffffff',
          'input.border': '#e5e7eb'
        }
      });
      
      // Force theme application
      const themeName = isDark ? 'leetcode-dark' : 'leetcode-light';
      monaco.editor.setTheme(themeName);
      
      // Additional fallback to ensure background is applied
      setTimeout(() => {
        try {
          monaco.editor.setTheme(themeName);
        } catch (e) {
          console.warn('Theme reapplication failed:', e);
        }
      }, 100);
    } catch (e) {}
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (monacoRef.current && editorRef.current) {
      try {
        const themeName = isDark ? 'leetcode-dark' : 'leetcode-light';
        monacoRef.current.editor.setTheme(themeName);
        
        // Force a layout update to ensure theme is fully applied
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.layout();
          }
        }, 50);
      } catch (_) {}
    }
  }, [isDark]);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
      
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setSubmitResult(response.data);
      setLoading(false);
      setActiveRightTab('result');
      
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({
        accepted: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return ui.accent;
      case 'medium': return '#eab308';
      case 'hard': return '#ef4444';
      default: return ui.text;
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: '#15150a' }}>
        <span className="loading loading-spinner loading-lg" style={{ color: '#eae244' }}></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-outfit" style={{ backgroundColor: ui.bg }}>
      {/* Scoped theme styles to align with Homepage */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        :root, [data-theme='dark'] { --bg:#0b0f14; --header:#111827ee; --panel:rgba(17,24,39,.55); --border:#2a2f3a; --text:#e5e7eb; --muted:#9ca3af; --accent:#22c55e; --danger:#ef4444; --neon:#22d3ee; --glass-blur:12px; --code-bg:#0b0f15; }
        [data-theme='light'] { --bg:#f6f7fb; --header:rgba(255,255,255,0.7); --panel:rgba(255,255,255,0.65); --border:#e5e7eb; --text:#0f172a; --muted:#475569; --accent:#16a34a; --danger:#dc2626; --neon:#7c3aed; --code-bg:#ffffff; }
        .glass{ background:var(--panel); backdrop-filter:blur(var(--glass-blur)); -webkit-backdrop-filter:blur(var(--glass-blur)); border:1px solid var(--border); box-shadow:0 10px 30px rgba(0,0,0,.25) }
        .neon-btn, .neon-input{ border:1px solid var(--border); box-shadow:0 0 0 rgba(0,0,0,0), 0 0 0 var(--neon); transition: transform .22s ease, box-shadow .22s ease, background-color .22s ease, color .22s ease }
        .neon-btn:hover{ transform: translateY(-1px) scale(1.03); box-shadow:0 8px 20px rgba(0,0,0,.3), 0 0 18px var(--neon) }
        .neon-btn:active{ transform: translateY(0) scale(.98) rotate(-.5deg) }
        .neon-input:hover{ box-shadow:0 0 10px var(--neon) }
        .pulse-neon{ animation:pulseNeon 2.2s ease-in-out infinite }
        @keyframes pulseNeon{0%,100%{box-shadow:0 0 10px var(--neon)}50%{box-shadow:0 0 24px var(--neon)}}
        .tag-sm{ padding:.15rem .5rem; border-radius:9999px; font-weight:600 }
        .tab-strip .tab-btn{ position:relative; color:var(--text); transition: color .2s ease, transform .2s ease }
        .tab-strip .tab-btn:hover{ transform: translateY(-1px) }
        .tab-strip .tab-btn::after{ content:''; position:absolute; left:10px; right:10px; bottom:-6px; height:3px; background:var(--accent); box-shadow:0 0 10px var(--neon); border-radius:2px; transform: scaleX(0); transform-origin: center; transition: transform 240ms ease, box-shadow 240ms ease }
        .tab-strip .tab-btn.active::after{ transform: scaleX(1) }
        .tab-strip .tab-btn:hover::after{ transform: scaleX(1) }
        .nav-anim a { position: relative; }
        .nav-anim a::after { content: ''; position: absolute; left: 0; bottom: -6px; width: 0; height: 2px; background: var(--neon); box-shadow: 0 0 10px var(--neon); transition: width 240ms ease; }
        .nav-anim a:hover::after { width: 100%; }
      `}</style>
      {/* Header */}
      <nav className="navbar px-4 border-b glass nav-anim font-outfit" style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', position: 'sticky', top: 0, zIndex: 50, height: '64px', paddingTop: '0', marginTop: '0' }}>
        <div className="flex-1 flex items-center h-full">
          <NavLink to="/" className="btn btn-ghost text-2xl neon-btn" style={{ color: 'var(--text)', backgroundColor: 'transparent' }}>Problems</NavLink>
        </div>
        
        {/* Logo Section */}
        <div className="flex-1 flex justify-center items-center h-full">
          <div className="font-bold leading-none" style={{ fontSize: '2.5rem', color: 'inherit', fontFamily: 'inherit' }}>
            <span style={{ color: '#22d3ee' }}>LG</span>
            <span style={{ color: 'var(--text)' }}> LogicGrid</span>
          </div>
        </div>
        
        <div className="flex-1 flex justify-end items-center h-full">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost neon-btn" style={{ color: 'var(--text)' }}>
              {user?.firstName || 'User'}
            </div>
            <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content rounded-box w-52 border glass" style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', zIndex: 1000 }}>
              <li>
                <button 
                  onClick={handleLogout}
                  className="neon-btn"
                  style={{ color: 'var(--text)', backgroundColor: 'transparent' }}
                >
                  Logout
                </button>
              </li>
              {user?.role=='admin'&&
                <li>
                  <NavLink 
                    to="/admin"
                    className="neon-btn"
                    style={{ color: 'var(--accent)', backgroundColor: 'transparent' }}
                  >
                    Admin
                  </NavLink>
                </li>
              }
            </ul>
          </div>
        </div>
      </nav>
      <div className="flex flex-1">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r" style={{ borderColor: ui.border }}>
        {/* Left Tabs */}
        <div className="tabs tabs-bordered px-4 glass tab-strip" style={{ backgroundColor: ui.header, borderColor: ui.border }}>
          <button 
            className={`tab tab-btn ${activeLeftTab === 'description' ? 'active' : ''}`}
            style={{ 
              color: ui.text,
              backgroundColor: 'transparent'
            }}
            onClick={() => setActiveLeftTab('description')}
          >
            Description
          </button>
          <button 
            className={`tab tab-btn ${activeLeftTab === 'editorial' ? 'active' : ''}`}
            style={{ 
              color: ui.text,
              backgroundColor: 'transparent'
            }}
            onClick={() => setActiveLeftTab('editorial')}
          >
            Editorial
          </button>
          <button 
            className={`tab tab-btn ${activeLeftTab === 'solutions' ? 'active' : ''}`}
            style={{ 
              color: ui.text,
              backgroundColor: 'transparent'
            }}
            onClick={() => setActiveLeftTab('solutions')}
          >
            Solutions
          </button>
          <button 
            className={`tab tab-btn ${activeLeftTab === 'submissions' ? 'active' : ''}`}
            style={{ 
              color: ui.text,
              backgroundColor: 'transparent'
            }}
            onClick={() => setActiveLeftTab('submissions')}
          >
            Submissions
          </button>

          <button 
            className={`tab tab-btn ${activeLeftTab === 'chatAI' ? 'active' : ''}`}
            style={{ 
              color: ui.text,
              backgroundColor: 'transparent'
            }}
            onClick={() => setActiveLeftTab('chatAI')}
          >
            ChatAI
          </button>


        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: ui.bg }}>
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold" style={{ color: ui.text }}>{problem.title}</h1>
                    <div 
                      className="badge badge-outline tag-sm neon-btn"
                      style={{ 
                        borderColor: getDifficultyColor(problem.difficulty),
                        color: getDifficultyColor(problem.difficulty)
                      }}
                    >
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </div>
                    <div 
                      className="badge tag-sm neon-btn"
                      style={{ 
                        backgroundColor: ui.header,
                        color: ui.muted,
                        border: `1px solid ${ui.border}`
                      }}
                    >
                      {problem.tags}
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <div 
                      className="whitespace-pre-wrap text-sm leading-relaxed"
                      style={{ color: ui.text }}
                    >
                      {problem.description}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: ui.text }}>Examples:</h3>
                    <div className="space-y-4">
                      {problem.visibleTestCases.map((example, index) => (
                        <div 
                          key={index} 
                          className="p-4 rounded-lg border"
                          style={{ backgroundColor: ui.codeBg, borderColor: ui.border }}
                        >
                          <h4 className="font-semibold mb-2" style={{ color: ui.text }}>Example {index + 1}:</h4>
                          <div className="space-y-2 text-sm font-mono" style={{ color: ui.text }}>
                            <div><strong>Input:</strong> {example.input}</div>
                            <div><strong>Output:</strong> {example.output}</div>
                            <div><strong>Explanation:</strong> {example.explanation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === 'editorial' && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4" style={{ color: ui.text }}>Editorial</h2>
                  <div 
                    className="whitespace-pre-wrap text-sm leading-relaxed"
                    style={{ color: ui.text }}
                  >
                    <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/>
                  </div>
                </div>
              )}

              {activeLeftTab === 'solutions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4" style={{ color: ui.text }}>Solutions</h2>
                  <div className="space-y-6">
                    {problem.referenceSolution?.map((solution, index) => (
                      <div 
                        key={index} 
                        className="border rounded-lg"
                        style={{ borderColor: ui.border }}
                      >
                        <div 
                          className="px-4 py-2 rounded-t-lg"
                          style={{ backgroundColor: ui.header }}
                        >
                          <h3 className="font-semibold" style={{ color: ui.text }}>{problem?.title} - {solution?.language}</h3>
                        </div>
                        <div className="p-4" style={{ backgroundColor: ui.bg }}>
                          <pre 
                            className="p-4 rounded text-sm overflow-x-auto"
                            style={{ backgroundColor: ui.codeBg, color: ui.text, border: `1px solid ${ui.border}` }}
                          >
                            <code>{solution?.completeCode}</code>
                          </pre>
                        </div>
                      </div>
                    )) || <p style={{ color: ui.text }}>Solutions will be available after you solve the problem.</p>}
                  </div>
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4" style={{ color: ui.text }}>My Submissions</h2>
                  <div style={{ color: ui.text }}>
                    <SubmissionHistory problemId={problemId} />
                  </div>
                </div>
              )}

              {activeLeftTab === 'chatAI' && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4" style={{ color: ui.text }}>CHAT with AI</h2>
                  <div 
                    className="whitespace-pre-wrap text-sm leading-relaxed"
                    style={{ color: ui.text }}
                  >
                    <ChatAi problem={problem}></ChatAi>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col">
        {/* Right Tabs */}
        <div className="tabs tabs-bordered px-4 glass tab-strip" style={{ backgroundColor: ui.header, borderColor: ui.border }}>
          <button 
            className={`tab tab-btn ${activeRightTab === 'code' ? 'active' : ''}`}
            style={{ 
              color: ui.text,
              backgroundColor: 'transparent'
            }}
            onClick={() => setActiveRightTab('code')}
          >
            Code
          </button>
          <button 
            className={`tab tab-btn ${activeRightTab === 'testcase' ? 'active' : ''}`}
            style={{ 
              color: ui.text,
              backgroundColor: 'transparent'
            }}
            onClick={() => setActiveRightTab('testcase')}
          >
            Testcase
          </button>
          <button 
            className={`tab tab-btn ${activeRightTab === 'result' ? 'active' : ''}`}
            style={{ 
              color: ui.text,
              backgroundColor: 'transparent'
            }}
            onClick={() => setActiveRightTab('result')}
          >
            Result
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col" style={{ backgroundColor: ui.bg }}>
          {activeRightTab === 'code' && (
            <div className="flex-1 flex flex-col">
              {/* Language Selector */}
              <div 
                className="flex justify-between items-center p-4 border-b"
                style={{ borderColor: ui.border }}
              >
                <div className="flex gap-2">
                  {['javascript', 'java', 'cpp'].map((lang) => (
                    <button
                      key={lang}
                      className="btn btn-sm font-semibold transition-all duration-200 hover:scale-105 neon-btn"
                      style={{ 
                        backgroundColor: selectedLanguage === lang ? ui.codeBg : 'transparent',
                        color: ui.text,
                        border: `1px solid ${selectedLanguage === lang ? ui.accent : ui.border}`
                      }}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme={isDark ? 'leetcode-dark' : 'leetcode-light'}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: 'line',
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    mouseWheelZoom: true,
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div 
                className="p-4 border-t flex justify-between"
                style={{ borderColor: ui.border }}
              >
                <div className="flex gap-2">
                  <button 
                    className="btn btn-sm font-semibold transition-all duration-200 hover:scale-105 neon-btn"
                    style={{ 
                      backgroundColor: 'transparent',
                      color: ui.text,
                      border: `1px solid ${ui.border}`
                    }}
                    onClick={() => setActiveRightTab('testcase')}
                  >
                    Console
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-sm font-semibold transition-all duration-200 hover:scale-105 neon-btn"
                    style={{ 
                      backgroundColor: ui.header,
                      color: ui.text,
                      border: `1px solid ${ui.border}`
                    }}
                    onClick={handleRun}
                    disabled={loading}
                  >
                    {loading ? 'Running...' : 'Run'}
                  </button>
                  <button
                    className="btn btn-sm font-semibold transition-all duration-200 hover:scale-105 neon-btn pulse-neon"
                    style={{ 
                      backgroundColor: ui.accent,
                      color: '#0b0f15',
                      border: 'none'
                    }}
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4" style={{ color: ui.text }}>Test Results</h3>
              {runResult ? (
                <div 
                  className="alert mb-4"
                  style={{ 
                    backgroundColor: runResult.success ? ui.passBg : ui.failBg,
                    border: `1px solid ${runResult.success ? ui.accent : ui.danger}`
                  }}
                >
                  <div style={{ color: ui.text }}>
                    {runResult.success ? (
                      <div>
                        <h4 className="font-bold" style={{ color: ui.accent }}>✅ All test cases passed!</h4>
                        <p className="text-sm mt-2">Runtime: {runResult.runtime+" sec"}</p>
                        <p className="text-sm">Memory: {runResult.memory+" KB"}</p>
                        
                        <div className="mt-4 space-y-2">
                          {runResult.testCases.map((tc, i) => (
                            <div 
                              key={i} 
                              className="p-3 rounded text-xs"
                              style={{ backgroundColor: ui.bg, border: `1px solid ${ui.border}` }}
                            >
                              <div className="font-mono" style={{ color: ui.text }}>
                                <div><strong>Input:</strong> {tc.stdin}</div>
                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                <div><strong>Output:</strong> {tc.stdout}</div>
                                <div style={{ color: ui.accent }}>
                                  {'✓ Passed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold" style={{ color: ui.danger }}>❌ Error</h4>
                        <div className="mt-4 space-y-2">
                          {runResult.testCases.map((tc, i) => (
                            <div 
                              key={i} 
                              className="p-3 rounded text-xs"
                              style={{ backgroundColor: ui.bg, border: `1px solid ${ui.border}` }}
                            >
                              <div className="font-mono" style={{ color: ui.text }}>
                                <div><strong>Input:</strong> {tc.stdin}</div>
                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                <div><strong>Output:</strong> {tc.stdout}</div>
                                <div style={{ color: tc.status_id==3 ? ui.accent : ui.danger }}>
                                  {tc.status_id==3 ? '✓ Passed' : '✗ Failed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ color: ui.text }}>
                  Click "Run" to test your code with the example test cases.
                </div>
              )}
            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4" style={{ color: ui.text }}>Submission Result</h3>
              {submitResult ? (
                <div 
                  className="alert"
                  style={{ 
                    backgroundColor: submitResult.accepted ? ui.passBg : ui.failBg,
                    border: `1px solid ${submitResult.accepted ? ui.accent : ui.danger}`
                  }}
                >
                  <div style={{ color: ui.text }}>
                    {submitResult.accepted ? (
                      <div>
                        <h4 className="font-bold text-lg" style={{ color: ui.accent }}>🎉 Accepted</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                          <p>Runtime: {submitResult.runtime + " sec"}</p>
                          <p>Memory: {submitResult.memory + "KB"} </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-lg" style={{ color: ui.danger }}>❌ {submitResult.error}</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ color: ui.text }}>
                  Click "Submit" to submit your solution for evaluation.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProblemPage;