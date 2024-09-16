import React from "react";

const Database = ({ databaseContent, inferredFacts, selectedGoal }) => {
  return (
    <div className="flex border rounded-lg bg-gray-100 border-gray-400 flex-1 p-2 h-80">
      <ul className="flex w-full h-full flex-col overflow-auto scrollbar-hide">
        {databaseContent.map((fact, index) => (
          <li
            key={index}
            className={`p-2 border border-gray-200 rounded-lg w-full ${
              inferredFacts.includes(fact)
                ? fact === selectedGoal
                  ? "bg-green-300"
                  : "bg-blue-300"
                : "bg-orange-300"
            }`}
          >
            {fact}
          </li>
        ))}
        {!databaseContent.includes(selectedGoal) && (
          <li
            className={
              "p-2 border border-gray-200 rounded-lg w-full bg-red-400"
            }
          >
            Goal not found in database
          </li>
        )}
      </ul>
    </div>
  );
};

export default Database;
