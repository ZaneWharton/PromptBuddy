import { useEffect, useState } from "react";
import { API } from "../api";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, Title, PointElement, LineElement } from "chart.js";

//Register necessary chart components
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

    //Fetch analytics data upon mount
    useEffect(() => {
        API.get("/analytics")
            .then((res) => setAnalytics(res.data))
            .catch((err) => console.error("Failed to load analytics data", err))
            .finally(() => setLoading(false));
        }, []);

    //Show loading screen while data is being fetched ot if structure is invalid
    if (loading || !analytics || !analytics.intents || !analytics.risks) {
        return(
            <p className="text-gray-400 text-center text-xl animate-pulse">Loading...</p>
        )
    }

    //Reusable chart options with optional axis
    const getChartOptions = (titleText, includeScales = false) => {
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "white"
                    }
                },
                title: {
                    display: true,
                    text: titleText,
                    font: {
                        size: 18
                    },
                    color: "white"
                }
            },
        }
        if (includeScales) {
            options.scales = {
                x: {
                    ticks: {
                        color: "white"
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.5)",
                        borderColor: "white"
                    }
                },
                y: {
                    ticks: {
                        color: "white",
                        stepSize: 0.1
                    },
                    min: 0,
                    max: 1,
                    grid: {
                        color: "rgba(255, 255, 255, 0.5)",
                        borderColor: "white"
                    },
                    beginAtZero: true
                }
            };
        }
        return options;
    };

    //Chart data
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

    //Render dashboard UI
    return (
        <div className="max-w-4xl mx-auto p-6 text-white rounded-xl">
            <h1 className="text-3xl font-extrabold text-center mb-4">Analytics Dashboard</h1>
            
            <div className="grid grid-cols-2 gap-5 mt-5">
                <div className="bg-white/10 rounded-xl h-80 flex flex-col justify-center p-4 shadow-lg shadow-blue-500/20">
                    {/* Prompt Intent Distribution Chart */}
                    <Doughnut data={intentData} options={getChartOptions("Prompt Intent Distribution")}/>
                </div>
                <div className="bg-white/10 rounded-xl flex flex-col justify-center p-4 shadow-lg shadow-blue-500/20">
                    {/* Prompt Risk Distribution Chart */}
                    <Doughnut data={riskData} options={getChartOptions("Prompt Risk Distribution")}/>
                </div>
                <div className="bg-white/10 rounded-xl h-80 flex flex-col justify-center p-4 shadow-lg shadow-blue-500/20">
                    {/* Average Confidence per Intent Chart */}
                    <Bar data={avgConfidenceByIntent} options={getChartOptions("Average Confidence by Intent", true)} />
                </div>
                <div className="bg-white/10 rounded-xl flex flex-col justify-center p-4 shadow-lg shadow-blue-500/20">
                    {/* Average Confidence per Risk Chart */}
                    <Line data={avgConfidenceByRisk} options={getChartOptions("Average Confidence by Risk", true)}/>
                </div>
            </div>
            <p className="text-xl font-extrabold text-center mt-8">Total Analyses Performed: {analytics.total}</p>
        </div>
     );
}

export default AnalyticsDashboard;