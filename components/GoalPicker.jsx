"use client";
import React from "react";

const GoalPicker = ({ goals, setSelectedGoal, selectedGoal }) => {
  return (
    <div className="flex flex-col w-full h-[48.5%]">
      <h1 className="font-inter font-bold text-left text-lg">
        What do you want me to diagnose?
      </h1>
      <div className="flex-1 border border-gray-400 rounded-lg p-2 overflow-auto ">
        {goals.map((goal) => (
          <Goal
            key={goal}
            goal={goal}
            setSelectedGoal={setSelectedGoal}
            selected={selectedGoal === goal}
          />
        ))}
      </div>
    </div>
  );
};

const Goal = ({ goal, setSelectedGoal, selected }) => {
  return (
    <div
      className={`flex border border-gray-300 rounded-lg px-2 py-2 transition-all ease-in mb-2 cursor-pointer
        ${selected ? "bg-blue-300" : "bg-transparent"}`}
      onClick={() => {
        setSelectedGoal(goal);
      }}
    >
      {goal}
    </div>
  );
};

export default GoalPicker;
