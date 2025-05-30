import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePrompt } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import ProgressSteps from '../components/ProgressSteps';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await generatePrompt(prompt);
      navigate('/result', { state: { result: data.enhanced_prompt } });
    } catch (err) {
      setError('Failed to generate prompt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center">CodeWeaver</h1>
      <ProgressSteps currentStep={0} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Enter your prompt</span>
          <textarea
            className="mt-1 w-full p-2 border rounded"
            rows="5"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here..."
            required
          />
        </label>
        {error && <p className="text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Processing...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
}
