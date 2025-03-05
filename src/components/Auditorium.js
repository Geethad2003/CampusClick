import React from "react";
import { Link } from "react-router-dom";

const Auditorium = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Auditorium List</h1>
      <ul className="list-disc">
        {["Main Auditorium", "Mini Auditorium"].map((aud, i) => (
          <li key={i} className="text-lg">{aud}</li>
        ))}
      </ul>
      <Link to="/staff-dashboard" className="mt-6 text-blue-600 hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default Auditorium;
