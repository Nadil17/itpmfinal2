import React, { useState } from 'react';

function TxtAnalysis() {
  const [cropType, setCropType] = useState('');
  const [soilCondition, setSoilCondition] = useState('');
  const [pestProblem, setPestProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSolution('');
    
    try {
      const response = await fetch('http://localhost:8080/crop-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvData: `${cropType},${soilCondition},${pestProblem}`
        }),
      });
      
      const data = await response.text();
      setSolution(data);
    } catch (error) {
      console.error('Error:', error);
      setSolution('Error fetching solution. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
        
        {/* Title Section */}
        <h1 className="text-2xl font-bold text-center text-white mb-6 bg-green-600 py-4 rounded-md">
          Crop Solution Finder
        </h1>
        
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cropType" className="block text-gray-700 font-medium mb-2">Crop Type</label>
            <input
              type="text"
              id="cropType"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="soilCondition" className="block text-gray-700 font-medium mb-2">Soil Condition</label>
            <input
              type="text"
              id="soilCondition"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={soilCondition}
              onChange={(e) => setSoilCondition(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="pestProblem" className="block text-gray-700 font-medium mb-2">Pest Problem</label>
            <input
              type="text"
              id="pestProblem"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={pestProblem}
              onChange={(e) => setPestProblem(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Getting Solution...' : 'Get Solution'}
          </button>
        </form>
        {solution && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Solution</h2>
            <p className="text-gray-700">{solution}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TxtAnalysis;
