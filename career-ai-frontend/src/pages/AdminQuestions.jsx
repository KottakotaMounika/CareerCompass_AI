import React, { useEffect, useState } from "react";

export default function AdminQuestions({ goBack }) {

  const [questions, setQuestions] = useState([]);
  const [careers, setCareers] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([
    { optionText: "", careerId: "", score: 1 }
  ]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQuestions();
    fetchCareers();
  }, []);

  const fetchQuestions = async () => {
    const res = await fetch("http://localhost:8080/api/admin/questions", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setQuestions(data);
  };

  const fetchCareers = async () => {
    const res = await fetch("http://localhost:8080/api/admin/careers", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setCareers(data);
  };

  const handleOptionChange = (index, field, value) => {
    const updated = [...options];
    updated[index][field] = value;
    setOptions(updated);
  };

  const addOptionField = () => {
    setOptions([...options, { optionText: "", careerId: "", score: 1 }]);
  };

  const addQuestion = async () => {

    if (!questionText.trim()) {
      alert("Question text required");
      return;
    }

    const formattedOptions = options.map(opt => ({
      optionText: opt.optionText,
      score: Number(opt.score),
      career: { id: opt.careerId }
    }));

    await fetch("http://localhost:8080/api/admin/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        questionText,
        options: formattedOptions
      })
    });

    setQuestionText("");
    setOptions([{ optionText: "", careerId: "", score: 1 }]);
    fetchQuestions();
  };

  const deleteQuestion = async (id) => {
    await fetch(`http://localhost:8080/api/admin/questions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchQuestions();
  };

  return (
    <div className="p-10 min-h-screen bg-gray-100">

      <button onClick={goBack} className="mb-6 text-blue-600 hover:underline">
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-6">Manage Questions</h2>

      {/* Add Question Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <h3 className="text-lg font-semibold mb-4">Add New Question</h3>

        <input
          type="text"
          placeholder="Enter Question Text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full border p-2 rounded-lg mb-4"
        />

        {options.map((opt, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-3">

            <input
              type="text"
              placeholder="Option Text"
              value={opt.optionText}
              onChange={(e) =>
                handleOptionChange(index, "optionText", e.target.value)
              }
              className="border p-2 rounded-lg"
            />

            <select
              value={opt.careerId}
              onChange={(e) =>
                handleOptionChange(index, "careerId", e.target.value)
              }
              className="border p-2 rounded-lg"
            >
              <option value="">Select Career</option>
              {careers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Score"
              value={opt.score}
              onChange={(e) =>
                handleOptionChange(index, "score", e.target.value)
              }
              className="border p-2 rounded-lg"
            />

          </div>
        ))}

        <div className="flex gap-4 mt-4">
          <button
            onClick={addOptionField}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            + Add Option
          </button>

          <button
            onClick={addQuestion}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Save Question
          </button>
        </div>

      </div>

      {/* Questions Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4">ID</th>
              <th>Question</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {questions.map(q => (
              <tr key={q.id} className="border-t">
                <td className="p-4">{q.id}</td>
                <td className="text-left p-4">
  <div className="font-semibold">{q.questionText}</div>

  {q.options && q.options.map(opt => (
    <div key={opt.id} className="text-sm text-gray-600 ml-4 mt-1">
      • {opt.optionText} 
      (Career: {opt.career?.name}, Score: {opt.score})
    </div>
  ))}
</td>
                <td>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}