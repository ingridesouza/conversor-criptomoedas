import { useLocation, Link } from 'react-router-dom';
import ProgressSteps from '../components/ProgressSteps';
import Button from '../components/Button';

export default function ResultPage() {
  const location = useLocation();
  const result = location.state?.result || '';

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Result</h1>
      <ProgressSteps currentStep={3} />
      {result ? (
        <pre className="whitespace-pre-wrap p-4 bg-gray-100 dark:bg-gray-800 rounded mb-4 border">
          {result}
        </pre>
      ) : (
        <p className="text-gray-600">No result available.</p>
      )}
      <Button as={Link} to="/" className="w-full text-center">
        Back
      </Button>
    </div>
  );
}
