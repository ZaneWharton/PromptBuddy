import { useState } from 'react';
import { analyzePrompt } from '../api';
import ResultCard from './ResultCard';

const PromptForm = () => {
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        setError("");
        setLoading(true);
        
        try {
            const res = await analyzePrompt(prompt);
            setResult(res.data);
        } catch (err) {
            setError("Analysis failed. Please try again.");
            console.error(err)
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setPrompt("");
        setResult(null);
        setError("")
    };

    return (
        <div className="max-w-2xl text-black flex flex-col items-center p-4">
            {!result ? (
                <>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder='Please enter your prompt...'
                        rows={6}
                        className="w-full p-4 border rounded-3xl mb-4"
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !prompt.trim()}
                        className="w-2/3 bg-blue-600 text-white py-2 rounded hover:bg-blue-500 cursor-pointer disabled:opacity-50 disabled:bg-blue-600 disabled:cursor-not-allowed"
                    >
                        {loading ? "Analyzing..." : "Analyze Prompt"}
                    </button>
                    {error && <p className="text-red-600 mt-4">{error}</p>}
                </>
            ) : (
                <>
                    <div className="flex flex-col items-center w-full">
                        {result && <div className="w-full max-w-2xl"><ResultCard data={result} /></div>}
                        <button
                            onClick={handleReset}
                            className="w-2/3 bg-blue-600 text-white py-2 mt-4 rounded cursor-pointer hover:bg-blue-500"
                        >
                            Analyze Another Prompt
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PromptForm;