"use client";
import React from "react";

const FactPicker = ({ facts, selectedFacts, handleFactClick }) => {
  return (
    <div className="flex flex-col w-full h-1/2 mb-3">
      <h1 className="font-inter font-bold text-left text-lg">
        What are your symptoms?
      </h1>
      <div className="flex-1 border border-gray-400 rounded-lg p-2 overflow-auto">
        {facts.map((fact) => (
          <Fact
            key={fact}
            fact={fact}
            handleFactClick={handleFactClick}
            isSelected={selectedFacts.includes(fact)}
          />
        ))}
      </div>
    </div>
  );
};

const Fact = ({ fact, handleFactClick, isSelected, isDisabled }) => {
  return (
    <div
      className={`flex border border-gray-300 rounded-lg px-2 py-2 transition-all ease-in mb-2 cursor-pointer ${
        isSelected ? "bg-blue-300" : "bg-transparent"
      }`}
      onClick={!isDisabled ? () => handleFactClick(fact) : undefined}
    >
      {fact}
    </div>
  );
};

export default FactPicker;
