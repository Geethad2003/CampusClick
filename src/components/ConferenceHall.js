import React from "react";
import { Link } from "react-router-dom";

const ConferenceHall = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Conference Hall List</h1>
      <ul className="list-disc">
        {["Hall A", "Hall B", "Hall C"].map((hall, i) => (
          <li key={i} className="text-lg">{hall}</li>
        ))}
      </ul>
      <Link to="/staff-dashboard" className="mt-6 text-blue-600 hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default ConferenceHall;
