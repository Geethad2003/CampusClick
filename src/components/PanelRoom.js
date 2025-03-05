import React from "react";
import { Link } from "react-router-dom";

const PanelRoom = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Panel Room</h1>
      <ul className="list-disc">
        {["Board Meeting Room", "Faculty Discussion Room"].map((room, i) => (
          <li key={i} className="text-lg">{room}</li>
        ))}
      </ul>
      <Link to="/staff-dashboard" className="mt-6 text-blue-600 hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default PanelRoom;
