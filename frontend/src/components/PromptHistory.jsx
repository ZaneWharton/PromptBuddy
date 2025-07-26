import { useEffect, useState } from "react";
import { API } from "../api";

const PromptHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    API.get("/history")
        .then((res) => setHistory(res.data))
        .catch((err) => console.error("Failed to load prompt history", err))
        .finally(() => setLoading(false));
    }, []);

    return (
        <div className="mt-12 max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center text-white mb-4">Prompt History</h2>
            {loading ? (
                <p className="text-gray-400 text-center text-xl animate-pulse">Loading...</p>
            ) : (
            <div className="overflow-hidden rounded-2xl shadow-2xl border border-white/20">
                <table className="min-w-full bg-white/5 text-white">
                    <thead className="bg-white/10 text-left uppercase border border-white/20">
                    <tr>
                        <th className="py-4 px-6">Prompt</th>
                        <th className="py-4 px-6">Intent</th>
                        <th className="py-4 px-6">Risks</th>
                        <th className="py-4 px-6">Confidence</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                    {history.map((item) => (
                        <tr key={item.id} className="hover:bg-white/10 transition-colors duration-200">
                        <td className="py-4 px-6 max-w-xs truncate">{item.prompt}</td>
                        <td className="py-4 px-6">{item.intent}</td>
                        <td className="py-4 px-6 flex flex-wrap gap-2">
                            {item.risks.length > 0 ? ( 
                                item.risks.map((risk, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 text-xs font-medium bg-red-700/40 text-white rounded-full shadow-sm"
                                    >
                                        {risk}
                                    </span>
                                ))
                            ) : (
                                <span className="px-3 py-1 text-xs font-medium bg-green-700/40 text-white rounded-full shadow-sm">None</span>
                            )}
                        </td>
                        <td className="py-4 px-6">
                            <span
                            className={`font-semibold ${
                                item.confidence_score >= 0.8
                                ? "text-green-600"
                                : item.confidence_score >= 0.5
                                ? "text-yellow-500"
                                : "text-red-600"
                            }`}
                            >
                            {item.confidence_score.toFixed(2)}
                            </span>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    );
};

export default PromptHistory