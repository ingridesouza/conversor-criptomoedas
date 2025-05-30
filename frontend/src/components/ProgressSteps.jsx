const steps = ['Prompt Enhancer', 'Scrum Master', 'Dev Agents', 'QA'];

export default function ProgressSteps({ currentStep = 0 }) {
  return (
    <ol className="flex space-x-4 mb-4">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center">
          <span
            className={`h-6 w-6 flex items-center justify-center rounded-full mr-2 ${
              index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300'
            }`}
          >
            {index + 1}
          </span>
          <span className={index <= currentStep ? 'font-semibold' : ''}>{step}</span>
        </li>
      ))}
    </ol>
  );
}
