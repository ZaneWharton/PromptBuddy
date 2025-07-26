import './App.css';
import PromptForm from "./components/PromptForm";

function App() {
  return (
    <div className="min-h-screen font-mono text-white bg-gradient-to-bl from-violet-950 via-gray-900 to-violet-950 flex flex-col items-center px-12">
      <h1 className="text-5xl font-extrabold drop-shadow-[0_4px_4px_white] my-8">PromptBuddy</h1>
      <div className="flex w-full text-center gap-4">
        <div className="w-1/3 mt-20">
          <p>Take your AI prompts to the next level with PromptBuddy! This powerful tool helps you craft superior prompts 
            for any use case, whether personal, professional, or API driven. It leads to more accurate and effective 
            AI responses. Ready to improve your prompts? Just paste yours in and click “Analyze Prompt” to get started!</p>
        </div>
        <div className="w-2/3 text-black">
          <PromptForm />
        </div>
      </div>
    </div>
  );
}

export default App;
