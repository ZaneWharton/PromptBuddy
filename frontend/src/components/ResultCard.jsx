const ResultCard = ({ data }) => {
  return (
    <div className="mt-6 bg-gray-100 rounded-3xl text-left p-4">
      <h2 className="text-xl font-bold text-center mb-2">Analysis Result</h2>

      <div className="text-center mb-2">
        <strong>Intent:</strong> {data.intent || "N/A"}
      </div>

      <div className="mb-2">
        <strong>Ambiguity:</strong>
        <ul className="list-disc ml-6">
          {data.ambiguity.length ? data.ambiguity.map((item, i) => (
            <li key={i}>{item}</li>
          )) : <li>None</li>}
        </ul>
      </div>

      <div className="mb-2">
        <strong>Risks:</strong>
        <ul className="list-disc ml-6">
          {data.risks.length ? data.risks.map((item, i) => (
            <li key={i}>{item}</li>
          )) : <li>None</li>}
        </ul>
      </div>

      <div className="mb-2">
        <strong>Suggestions:</strong>
        <ul className="list-disc ml-6">
          {data.suggestions.length ? data.suggestions.map((item, i) => (
            <li key={i}>{item}</li>
          )) : <li>None</li>}
        </ul>
      </div>
      <div className="text-center mb-2">
        <strong>Prompt Confidence:</strong> {data.confidence_score || "N/A"}
      </div>
    </div>
  );
};

export default ResultCard;