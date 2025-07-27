import PromptForm from "./PromptForm";

//Home page, includes app desription and prompt analysis form
const Home = () => {
    return (
        <div className="flex w-full max-w-7xl gap-16 mt-8">
            <div className="w-2/5 h-1/2 text-center bg-white/10 rounded-3xl p-12 spacing-y-10 mt-8 shadow-2xl shadow-blue-500/20">
                <h2 className="text-3xl font-bold mb-4">Why PromptBuddy?</h2>
                <p className="mb-3">
                    -PromptBuddy helps you craft smarter, clearer, and more effective prompts for large language models
                    like Gemini, ChatGPT, and Claude.
                </p>
                <p className="mb-3">
                    -It breaks down your input into intent, ambiguity, risks, and improvement suggestions, giving
                    you actionable feedback in real time. Additionally, a prompt confidence score is provided describing how 
                    confident we are that your prompt will produce a desirable output from the LLM.
                </p>
                <p className="mb-3">
                    -We also provide a revise prompt feature if you'd like us to write you a new prompt!
                </p>
                <p>
                    -Whether you're writing prompts for work, coding, creative writing, or API chaining,
                    PromptBuddy makes your prompt engineering sharper and safer.
                </p>
            </div>
            <div className="w-3/5 flex items-center justify-center">
                <div className="w-full max-w-xl mx-auto">
                    <PromptForm />
                </div>
            </div>
        </div>
    );
};

export default Home;