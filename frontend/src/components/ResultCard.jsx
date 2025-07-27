const ResultCard = ({ data }) => {
  //Return nothing if data is missing
  if (!data) return null;

  return (
    <div className="mt-6 bg-white/10 rounded-3xl text-left text-white p-4 shadow-2xl shadow-blue-500/20">
      <h1 className="text-xl font-bold text-center mb-2">Analysis Result</h1>

      {/* Intent */}
      <div className="text-center mb-2">
        <strong>Intent:</strong> {data.intent || "N/A"}
      </div>

      {/* Ambiguity List */}
      <div className="mb-2">
        <strong>Ambiguity:</strong>
        <ul className="list-disc ml-6">
          {data.ambiguity.length ? data.ambiguity.map((item, i) => (
            <li key={i}>{item}</li>
          )) : <li>None</li>}
        </ul>
      </div>
      
      {/* Risk List */}
      <div className="mb-2">
        <strong>Risks:</strong>
        <ul className="list-disc ml-6">
          {data.risks.length ? data.risks.map((item, i) => (
            <li key={i}>{item}</li>
          )) : <li>None</li>}
        </ul>
      </div>
      
      {/* Suggestions List */}
      <div className="mb-2">
        <strong>Suggestions:</strong>
        <ul className="list-disc ml-6">
          {data.suggestions.length ? data.suggestions.map((item, i) => (
            <li key={i}>{item}</li>
          )) : <li>None</li>}
        </ul>
      </div>

      {/* Confidence Score */}
      <div className="text-center mb-2">
        <strong>Prompt Confidence (0-1):</strong> {data.confidence_score || "N/A"}
      </div>
    </div>
  );
};

export default ResultCard;