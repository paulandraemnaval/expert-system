"use client";
import React from "react";

const Rules = ({ rules, currentlyInferringRule }) => {
  return (
    <div className="flex flex-col flex-1">
      <h1 className="text-lg font-bold font-inter mb-2">Rules</h1>
      <div className="flex-1 p-2 backdrop-blur bg-gray-100 rounded-md border border-gray-400 gap-2 min-h-max overflow-auto max-h-[100%]">
        <ul className=" space-y-1">
          {rules.map((rule, index) => (
            <li
              className={`min-w-4 p-2 rounded-lg border border-gray-300 ${
                rule === currentlyInferringRule ? "bg-blue-200" : ""
              }`}
              index={index}
              key={rule}
            >
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Rules;
