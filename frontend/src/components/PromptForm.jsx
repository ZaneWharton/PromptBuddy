import { useState } from 'react';
import { analyzePrompt, revisePrompt } from '../api';
import ResultCard from './ResultCard';

const PromptForm = () => {
    const [prompt, setPrompt] = useState("");
    const [revisedPrompt, setRevisedPrompt] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    //aAnalyze prompt from user
    const handleAnalyze = async () => {
        if (!prompt.trim()) return;

        setError("");
        setLoading(true);
        
        try {
            const res = await analyzePrompt(prompt);
            setResult(res.data);
        } catch (err) {
            setError( err.response?.data?.error || "Analysis failed. Please try again.");
            console.error(err)
        } finally {
            setLoading(false);
        }
    };

    //Produce a revision for the user's prompt
    const handleRevise = async () => {
        if (!prompt.trim()) return;

        setError("");
        setLoading(true);

        try{
            const res = await revisePrompt(prompt);
            setRevisedPrompt(res.data);
        } catch (err) {
            setError("Revision failed. Please try again");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //Reset state
    const handleReset = () => {
        setPrompt("");
        setResult(null);
        setRevisedPrompt("");
        setError("");
    };

    return (
        <div className="max-w-2xl text-black flex flex-col items-center p-4 focus:outline-none">
            {/* Show form if no result yet */}
            {!result ? (
                <>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder='Please enter your prompt...'
                        rows={6}
                        className="w-full text-white rounded-3xl bg-white/20 p-4 mb-4 shadow-2xl shadow-blue-500/20 focus:outline-none"
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !prompt.trim()}
                        className="w-2/3 bg-blue-600 text-white py-2 rounded hover:bg-blue-500 cursor-pointer disabled:opacity-50 disabled:bg-blue-600 disabled:cursor-not-allowed"
                    >
                        {loading ? "Analyzing..." : "Analyze Prompt"}
                    </button>

                    {/* Show error if any */}
                    {error && <p className="text-red-600 mt-4">{error}</p>}
                </>
            ) : (
                <>
                    <div className="flex flex-col items-center w-full focus:outline-none">
                        {/* Show result or revised prompt */}
                        {!revisedPrompt && (
                            <div className="w-full max-w-2xl">
                                <ResultCard data={result} />
                            </div>
                        )}
                        {revisedPrompt && (
                            <div className="w-full max-w-2xl bg-white/10 rounded-3xl text-white p-4 shadow-2xl shadow-blue-500/20">
                                <h1 className="text-xl font-bold text-center mb-2">Revised Prompt</h1>
                                <p>{revisedPrompt}</p>
                            </div>
                        )}

                        {/* Brings user back to initial form, resetting the state variables */}
                        <button
                            onClick={handleReset}
                            className="w-2/3 bg-blue-600 text-white py-2 mt-4 rounded cursor-pointer hover:bg-blue-500"
                        >
                            Analyze Another Prompt
                        </button>

                        {/* Optional revision after the prompt has been analyzed */}
                        {!revisedPrompt && (
                            <button
                                onClick={handleRevise}
                                disabled={loading}
                                className="w-1/3 bg-green-600 text-white py-2 mt-4 rounded-full cursor-pointer hover:bg-green-500 disabled:opacity-50 disabled:bg-green-400 disabled:cursor-not-allowed"
                            >
                                {loading ? "Revising..." : "Revise Your Prompt"}
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default PromptForm;