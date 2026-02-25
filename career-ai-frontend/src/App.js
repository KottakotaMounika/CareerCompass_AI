//App.js
import React, { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
export default function App() {

  // ================= STATES =================
  const [currentView, setCurrentView] = useState("login");
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [careerCount, setCareerCount] = useState(0);
  const [popularCareer, setPopularCareer] = useState("");
  
  // ================= CAREER DETAILS DATA =================
  // ✅ MUST BE ABOVE RETURN BLOCKS
  const careerDetailsData = {
    "Software Engineer": {
      skills: ["JavaScript", "React", "Spring Boot", "System Design"],
      salary: "₹6 LPA – ₹25 LPA",
      growth: "Very High – Demand across industries",
      roadmap: [
        "Learn Programming Fundamentals",
        "Master Data Structures & Algorithms",
        "Build Full Stack Projects",
        "Learn System Design",
        "Contribute to Open Source"
      ]
    },
    "Data Scientist": {
      skills: ["Python", "SQL", "Machine Learning", "Statistics"],
      salary: "₹8 LPA – ₹30 LPA",
      growth: "Extremely High – AI Driven Market",
      roadmap: [
        "Learn Python & Pandas",
        "Master Statistics",
        "Learn Machine Learning",
        "Build ML Projects",
        "Deploy Models"
      ]
    }
  };

  // ================= FETCH QUESTIONS =================
  useEffect(() => {
    fetch("http://localhost:8080/api/questions")
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  useEffect(() => {
  if (currentView === "admin") {

    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/admin/users/count", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => setUserCount(data));

    fetch("http://localhost:8080/api/admin/questions/count", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => setQuestionCount(data));

    fetch("http://localhost:8080/api/admin/careers/count", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => setCareerCount(data));

    fetch("http://localhost:8080/api/admin/analytics/popular-career", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.text())
      .then(data => setPopularCareer(data));
  }
}, [currentView]);

  // ================= HANDLERS =================
  const handleSelect = (questionId, optionId) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: optionId
    });
  };

  const handleNext = () => setCurrentIndex(currentIndex + 1);
  const handlePrevious = () => setCurrentIndex(currentIndex - 1);

  const handleSubmit = () => {
  const optionIds = Object.values(selectedOptions);
  setLoading(true);

  fetch("http://localhost:8080/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      optionIds: optionIds
    })
  })
    .then(res => res.json())
    .then(data => {
      setResult(data);
      setLoading(false);
    });
};
const handleLogin = (role) => {
  if (role === "ADMIN") {
    setCurrentView("admin");
  } else {
    setCurrentView("survey");
  }
};
// ================= AUTH CHECK =================
  if (!isLoggedIn) {
  return isRegistering ? (
    <Register onSwitch={() => setIsRegistering(false)} />
  ) : (
    <Login
      onLogin={(role) => {
        setIsLoggedIn(true);
        if (role === "ADMIN") {
          setCurrentView("admin");
        } else {
          setCurrentView("survey");
        }
      }}
      onSwitch={() => setIsRegistering(true)}
    />
  );
}
// ================= ADMIN DASHBOARD =================
if (currentView === "admin") {
  return (
    <AdminDashboard
      onLogout={() => {
        localStorage.clear();
        setIsLoggedIn(false);
        setCurrentView("login");
      }}
    />
  );
}
  // ================= HOME =================
  if (!started) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6">
      <h1 className="text-5xl font-bold mb-4">CareerAI</h1>

      <p className="text-lg text-center max-w-md mb-6">
        Discover the career path that best matches your interests,
        skills, and personality.
      </p>

      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-gray-800">
        <label className="block text-sm font-medium mb-2">
          Enter Your Name
        </label>

        <input
          type="text"
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          disabled={!username}
          onClick={() => setStarted(true)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          Start Survey
        </button>
      </div>
    </div>
  );
}
  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Analyzing your responses...
          </p>
        </div>
      </div>
    );
  }

  // ================= RESULT =================
if (result) {
  const scores = Object.entries(result.scoreBreakdown);
  const maxScore = Math.max(...scores.map(([_, score]) => score));

  const scoreValues = scores.map(([_, score]) => score);
  const difference = scoreValues[0] - (scoreValues[1] || 0);

  let confidence = "Low Confidence";
  if (difference >= 3) confidence = "High Confidence";
  else if (difference >= 1) confidence = "Moderate Confidence";

  const primaryDetails =
    careerDetailsData[result.primaryCareer.name];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-xl transition-all duration-500">

        {/* Personalized Header */}
        <h1 className="text-3xl font-bold mb-2 text-center">
          🚀 {username}, Here’s Your Career Match
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Based on your responses, we analyzed your interests and strengths.
        </p>

        {/* Primary Recommendation */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-xl mb-6 shadow-lg">
          <h2 className="text-xl font-semibold">
            🎯 Primary Recommendation
          </h2>

          <p className="text-lg mt-2 font-bold">
            {result.primaryCareer.name}
          </p>

          <p className="text-sm mt-1 opacity-90">
            {result.primaryCareer.description}
          </p>

          <div className="mt-4 text-sm font-semibold">
            Confidence Level: {confidence}
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            🧠 Insight: Your response pattern strongly aligns with roles that
            require analytical thinking and structured problem-solving skills.
            This makes the recommendation highly suitable for you.
          </p>
        </div>

        {/* Secondary Option */}
        {result.secondaryCareer && (
          <div className="bg-gray-100 p-4 rounded-xl mb-6 border">
            <h2 className="font-semibold text-gray-700">
              Alternative Option
            </h2>
            <p className="mt-1 text-gray-600">
              {result.secondaryCareer.name}
            </p>
          </div>
        )}

        {/* Score Breakdown */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Score Breakdown</h3>

          {scores.map(([career, score]) => (
            <div key={career} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>{career}</span>
                <span>{score} pts</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    career === result.primaryCareer.name
                      ? "bg-blue-600"
                      : "bg-gray-400"
                  }`}
                  style={{
                    width: `${(score / maxScore) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Toggle Career Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mb-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {showDetails ? "Hide Career Details" : "View Career Details"}
        </button>

        {/* Career Details */}
        {showDetails && primaryDetails && (
          <div className="bg-white border rounded-2xl p-6 mb-6 shadow-lg space-y-6 transition-all duration-500">

            <h3 className="text-xl font-bold text-gray-800">
              📊 Career Insights
            </h3>

            {/* Skills */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-700">
                🛠 Required Skills
              </h4>

              <div className="flex flex-wrap gap-2">
                {primaryDetails.skills.map(skill => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Salary */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-700">
                💰 Salary Range
              </h4>

              <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
                {primaryDetails.salary}
              </div>
            </div>

            {/* Growth */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-700">
                📈 Growth Potential
              </h4>
              <p className="text-gray-600">
                {primaryDetails.growth}
              </p>
            </div>

            {/* Roadmap */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-700">
                🗺 Learning Roadmap
              </h4>

              <div className="space-y-3">
                {primaryDetails.roadmap.map((step, index) => (
                  <div
                    key={step}
                    className="bg-gray-50 border p-3 rounded-lg flex items-start gap-3"
                  >
                    <div className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Restart */}
        <button
          onClick={() => {
            setResult(null);
            setStarted(false);
            setCurrentIndex(0);
            setSelectedOptions({});
            setShowDetails(false);
          }}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Start Again
        </button>

      </div>
    </div>
  );
}

  // ================= QUIZ =================
  const currentQuestion = questions[currentIndex];
  const progress =
    ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      {currentQuestion && (
        <div className="bg-white shadow-xl rounded-2xl p-10 w-[500px]">

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-gray-500 mb-2">
            Question {currentIndex + 1} of {questions.length}
          </p>

          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            {currentQuestion.questionText}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map(option => (
              <button
                key={option.id}
                onClick={() =>
                  handleSelect(currentQuestion.id, option.id)
                }
                className={`w-full py-3 rounded-lg transition-all duration-200 ${
                  selectedOptions[currentQuestion.id] === option.id
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {option.optionText}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!selectedOptions[currentQuestion.id]}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!selectedOptions[currentQuestion.id]}
                className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 hover:bg-green-700 transition"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}