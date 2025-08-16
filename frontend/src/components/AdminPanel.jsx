import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6 font-outfit" style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`
        :root { --bg:#0b0f14; --header:#111827ee; --panel:rgba(17,24,39,.55); --border:#2a2f3a; --text:#e5e7eb; --muted:#9ca3af; --accent:#22c55e; --warn:#eab308; --danger:#ef4444; --neon:#22d3ee; --glass-blur:12px; }
        .glass{ background:var(--panel); backdrop-filter:blur(var(--glass-blur)); -webkit-backdrop-filter:blur(var(--glass-blur)); border:1px solid var(--border) }
        .neon-btn, .neon-input{ border:1px solid var(--border); transition: transform .22s ease, box-shadow .22s ease }
        .neon-btn:hover{ transform: translateY(-1px) scale(1.03); box-shadow: 0 8px 20px rgba(0,0,0,.3), 0 0 18px var(--neon) }
      `}</style>
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text)' }}>Create New Problem</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card glass p-6" style={{ backgroundColor: 'var(--panel)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>Basic Information</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text" style={{ color: 'var(--text)' }}>Title</span>
              </label>
              <input
                {...register('title')}
                className="input border neon-input focus:outline-none transition-all duration-200"
                style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
              {errors.title && (
                <span className="text-sm mt-1" style={{ color: 'var(--warn)' }}>{errors.title.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text" style={{ color: 'var(--text)' }}>Description</span>
              </label>
              <textarea
                {...register('description')}
                className="textarea border neon-input focus:outline-none transition-all duration-200 h-32"
                style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
              {errors.description && (
                <span className="text-sm mt-1" style={{ color: 'var(--warn)' }}>{errors.description.message}</span>
              )}
            </div>

            <div className="flex gap-4">
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text" style={{ color: 'var(--text)' }}>Difficulty</span>
                </label>
                <select
                  {...register('difficulty')}
                  className="select border neon-input focus:outline-none transition-all duration-200"
                  style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text" style={{ color: 'var(--text)' }}>Tag</span>
                </label>
                <select
                  {...register('tags')}
                  className="select border neon-input focus:outline-none transition-all duration-200"
                  style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div className="card glass p-6" style={{ backgroundColor: 'var(--panel)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>Test Cases</h2>
          
          {/* Visible Test Cases */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium" style={{ color: 'var(--text)' }}>Visible Test Cases</h3>
              <button
                type="button"
                onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                className="btn btn-sm font-semibold transition-all duration-200 hover:scale-105 neon-btn"
                style={{ backgroundColor: 'var(--accent)', color: '#0b0f15', border: 'none' }}
              >
                Add Visible Case
              </button>
            </div>
            
            {visibleFields.map((field, index) => (
              <div 
                key={field.id} 
                className="border p-4 rounded-lg space-y-2 glass"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeVisible(index)}
                    className="btn btn-xs font-semibold transition-all duration-200 hover:scale-105 neon-btn"
                    style={{ backgroundColor: 'var(--danger)', color: '#fff', border: 'none' }}
                  >
                    Remove
                  </button>
                </div>
                
                <input
                  {...register(`visibleTestCases.${index}.input`)}
                  placeholder="Input"
                  className="input border neon-input focus:outline-none transition-all duration-200 w-full"
                  style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
                
                <input
                  {...register(`visibleTestCases.${index}.output`)}
                  placeholder="Output"
                  className="input border neon-input focus:outline-none transition-all duration-200 w-full"
                  style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
                
                <textarea
                  {...register(`visibleTestCases.${index}.explanation`)}
                  placeholder="Explanation"
                  className="textarea border neon-input focus:outline-none transition-all duration-200 w-full"
                  style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </div>
            ))}
          </div>

          {/* Hidden Test Cases */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium" style={{ color: 'var(--text)' }}>Hidden Test Cases</h3>
              <button
                type="button"
                onClick={() => appendHidden({ input: '', output: '' })}
                className="btn btn-sm font-semibold transition-all duration-200 hover:scale-105 neon-btn"
                style={{ backgroundColor: 'var(--accent)', color: '#0b0f15', border: 'none' }}
              >
                Add Hidden Case
              </button>
            </div>
            
            {hiddenFields.map((field, index) => (
              <div 
                key={field.id} 
                className="border p-4 rounded-lg space-y-2 glass"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeHidden(index)}
                    className="btn btn-xs font-semibold transition-all duration-200 hover:scale-105 neon-btn"
                    style={{ backgroundColor: 'var(--danger)', color: '#fff', border: 'none' }}
                  >
                    Remove
                  </button>
                </div>
                
                <input
                  {...register(`hiddenTestCases.${index}.input`)}
                  placeholder="Input"
                  className="input border neon-input focus:outline-none transition-all duration-200 w-full"
                  style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
                
                <input
                  {...register(`hiddenTestCases.${index}.output`)}
                  placeholder="Output"
                  className="input border neon-input focus:outline-none transition-all duration-200 w-full"
                  style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Code Templates */}
        <div className="card glass p-6" style={{ backgroundColor: 'var(--panel)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>Code Templates</h2>
          
          <div className="space-y-6">
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium" style={{ color: 'var(--text)' }}>
                  {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                </h3>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text" style={{ color: 'var(--text)' }}>Initial Code</span>
                  </label>
                  <pre 
                    className="p-4 rounded-lg glass"
                    style={{ backgroundColor: 'var(--panel)' }}
                  >
                    <textarea
                      {...register(`startCode.${index}.initialCode`)}
                      className="w-full bg-transparent font-mono border neon-input focus:outline-none transition-all duration-200"
                      style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                      rows={6}
                    />
                  </pre>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text" style={{ color: 'var(--text)' }}>Reference Solution</span>
                  </label>
                  <pre 
                    className="p-4 rounded-lg glass"
                    style={{ backgroundColor: 'var(--panel)' }}
                  >
                    <textarea
                      {...register(`referenceSolution.${index}.completeCode`)}
                      className="w-full bg-transparent font-mono border neon-input focus:outline-none transition-all duration-200"
                      style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                      rows={6}
                    />
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="btn w-full font-semibold transition-all duration-200 hover:scale-105 neon-btn"
          style={{ backgroundColor: 'var(--accent)', color: '#0b0f15', border: 'none' }}
        >
          Create Problem
        </button>
      </form>
    </div>
  );
}

export default AdminPanel;