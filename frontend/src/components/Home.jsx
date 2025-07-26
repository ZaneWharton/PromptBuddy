import PromptForm from "./PromptForm";

const Home = () => {
    return (
        <div className="flex w-full max-w-7xl gap-16 mt-8">
            <div className="w-1/3 text-md text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Why PromptBuddy?</h2>
                <p className="mb-3">
                    -PromptBuddy helps you craft smarter, clearer, and more effective prompts for large language models
                    like Gemini, ChatGPT, and Claude.
                </p>
                <p className="mb-3">
                    -It breaks down your input into intent, ambiguity, risks, and improvement suggestions, giving
                    you actionable feedback in real time.
                </p>
                <p>
                    -Whether you're writing prompts for work, coding, creative writing, or API chaining,
                    PromptBuddy makes your prompt engineering sharper and safer.
                </p>
            </div>
            <div className="w-2/3 flex items-center justify-center">
                <div className="w-full max-w-xl mx-auto">
                    <PromptForm />
                </div>
            </div>
        </div>
    );
};

export default Home;