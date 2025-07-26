import { useEffect, useState } from "react";
import { API } from "../api";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, Title, PointElement, LineElement } from "chart.js";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  PointElement,
  LineElement
);

const AnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/analytics")
            .then((res) => setAnalytics(res.data))
            .catch((err) => console.error("Failed to load prompt history", err))
            .finally(() => setLoading(false));
        }, []);

    if (loading) {
        return(
            <p className="text-gray-400 text-center text-xl animate-pulse">Loading...</p>
        )
    }

    const intentData = {
        labels: Object.keys(analytics.intents),
        datasets: [
            {
            label: "Prompt Intents",
            data: Object.values(analytics.intents),
            backgroundColor: [
                "#6366f1",
                "#8b5cf6",
                "#ec4899",
                "#10b981",
                "#f59e0b",
                "#ef4444",
                "#14b8a6",
                ],
            },
        ],
    };

    const riskData = {
        labels: Object.keys(analytics.risks),
        datasets: [
        {
            label: "Prompt Risks",
            data: Object.values(analytics.risks),
                    backgroundColor: [
                    "#f87171",
                    "#fb923c",
                    "#facc15",
                    "#4ade80",
                    "#60a5fa",
                    "#a78bfa",
                    "#f472b6",
                    ],
                },
            ],
        };
    
        const avgConfidenceByIntent = {
            labels: Object.keys(analytics.confidence_by_intent),
            datasets: [
            {
                label: "Avg Confidence by Intent",
                data: Object.values(analytics.confidence_by_intent).map((arr) => {
                const sum = arr.reduce((a, b) => a + b, 0);
                return (sum / arr.length).toFixed(3);
                }),
                backgroundColor: "#6366f1",
                },
            ],
        };

        const avgConfidenceByRisk = {
            labels: Object.keys(analytics.confidence_by_risk),
            datasets: [
            {
                label: "Avg Confidence by Risk",
                data: Object.values(analytics.confidence_by_risk).map((arr) => {
                const sum = arr.reduce((a, b) => a + b, 0);
                return (sum / arr.length).toFixed(3);
                }),
                fill: false,
                borderColor: "#1b6666ff",
                },
            ],
        };


     return (
        <div className="max-w-4xl mx-auto mt-8 p-6 text-black rounded-xl shadow-lg">
            <h1 className="text-3xl font-extrabold text-center text-white mb-4">Analytics Dashboard</h1>
            <p className="text-xl font-extrabold text-center text-white mb-4">Total Analyses: {analytics.total}</p>
            
            <div className="flex gap-24 mt-8 mb-20">
                <div className="bg-white/90 rounded-xl p-4">
                    <Doughnut data={intentData} options={{
                        plugins: {
                            title: {
                                display: true,
                                text: "Prompt Intent Distribution",
                                font: {
                                    size: 18,
                                }
                            },
                            legend: {
                                position: "bottom"
                            }
                        }
                    }}/>
                </div>
                <div className="bg-white/90 rounded-xl p-4">
                    <Doughnut data={riskData} options={{
                        plugins: {
                            title: {
                                display: true,
                                text: "Prompt Risk Distribution",
                                font: {
                                    size: 18,
                                }
                            },
                            legend: {
                                position: "bottom"
                            }
                        }
                    }}/>
                </div>
            </div>
            <div className="flex gap-24">
                <div className="bg-white/90 rounded-xl p-4">
                    <Bar data={avgConfidenceByIntent} />
                </div>
                <div className="bg-white/90 rounded-xl p-4">
                    <Line data={avgConfidenceByRisk} />
                </div>
            </div>
        </div>
     );
}

export default AnalyticsDashboard;