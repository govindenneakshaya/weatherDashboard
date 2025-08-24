interface UnitToggleProps {
  unit: 'C' | 'F';
  onToggle: (unit: 'C' | 'F') => void;
}

const UnitToggle = ({ unit, onToggle }: UnitToggleProps) => {
  return (
    <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-gray-200">
      <button
        onClick={() => onToggle('C')}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          unit === 'C'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        °C
      </button>
      <button
        onClick={() => onToggle('F')}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          unit === 'F'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        °F
      </button>
    </div>
  );
};

export default UnitToggle;