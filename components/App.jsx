"use client";
import React from "react";
import Rules from "./Rules";
import GoalPicker from "./GoalPicker";
import FactPicker from "./FactPicker";
import Database from "./Database";
import { toast } from "react-hot-toast";
const App = () => {
  const [selectedFacts, setSelectedFacts] = React.useState([]);
  const [selectedGoal, setSelectedGoal] = React.useState("");
  const [databaseContent, setDatabaseContent] = React.useState([]);
  const [infferedFacts, setInfferedFacts] = React.useState([]);
  const [forwardChaining, setForwardChaining] = React.useState(false);

  React.useEffect(() => {
    setDatabaseContent(selectedFacts);
  }, [selectedFacts]);
  React.useEffect(() => {
    setInfferedFacts(
      databaseContent.filter((fact) => !selectedFacts.includes(fact))
    );
  }, [databaseContent]);

  const handleFactClick = (fact) => {
    setSelectedFacts((prev) => {
      if (prev.includes(fact)) {
        return prev.filter((f) => f !== fact);
      }
      if (fact.startsWith("temperature")) {
        return [...prev.filter((f) => !f.startsWith("temperature")), fact];
      }

      if (fact.includes("nasal breathing")) {
        return [...prev.filter((f) => !f.includes("nasal breathing")), fact];
      }
      return [...prev, fact];
    });
  };

  const forwardChain = () => {
    let newRuleFired = true;
    let firedRules = [];
    let updatedDatabaseContent = [...databaseContent];

    while (newRuleFired) {
      newRuleFired = false;
      rules.forEach((rule) => {
        const [conditionPart, result] = rule.split("THEN");

        if (
          conditionPart.includes(" AND ") &&
          !firedRules.includes(rule.trim()) &&
          !updatedDatabaseContent.includes(result.trim()) &&
          !rule.includes("temperature")
        ) {
          const conditions = conditionPart
            .split("IF")[1]
            .split(" AND ")
            .map((condition) => condition.trim());
          let allConditionsTrue = true;
          conditions.map((condition) => {
            if (condition.startsWith("not")) {
              if (
                updatedDatabaseContent.includes(
                  condition.split("not")[1].trim()
                )
              ) {
                allConditionsTrue = false;
              }
            } else if (!updatedDatabaseContent.includes(condition.trim())) {
              allConditionsTrue = false;
            }
          });
          if (allConditionsTrue && !updatedDatabaseContent.includes(result)) {
            firedRules.push(rule.trim());
            updatedDatabaseContent.push(result.trim());
            newRuleFired = true;
          }
        } else {
          updatedDatabaseContent.forEach((fact) => {
            if (
              rule.split("IF")[1].split("THEN")[0].trim() === fact.trim() &&
              !firedRules.includes(rule.trim()) &&
              !updatedDatabaseContent.includes(result.trim())
            ) {
              firedRules.push(rule.trim());
              updatedDatabaseContent.push(result.trim());
              newRuleFired = true;
            }
          });
        }
      });
    }

    setDatabaseContent(updatedDatabaseContent);
    const infferedFacts = updatedDatabaseContent.filter(
      (databaseContent) => !selectedFacts.includes(databaseContent)
    );
    setInfferedFacts(infferedFacts);
    console.log("infferedFacts", infferedFacts);
  };
  const backwardChain = (
    parentGoal,
    ruleOfGoal,
    knownFacts,
    setKnownFacts,
    rules,
    visitedGoals = [],
    canReachGoal = true
  ) => {
    console.log("RECURSED");
    console.log("parentGoal", parentGoal);
    console.log("ruleOfGoal", ruleOfGoal);
    console.log("knownFacts", knownFacts);
    let localKnownFacts = [...knownFacts];

    if (!canReachGoal) {
      console.log("CAN'T REACH GOAL. RETURNING");
      return localKnownFacts;
    }
    // Avoid revisiting goals
    visitedGoals = [...visitedGoals, ruleOfGoal];
    console.log("visitedGoals", visitedGoals);

    if (visitedGoals.length === 0) {
      console.log("VISITED GOALS IS EMPTY. RETURNING");
      return localKnownFacts;
    }

    let allConditionsTrue = true;
    let unfulfilledConditions = [];
    let conditionPartOfRuleOfGoal = "";
    let conditions = [];

    const infer = (rule) => {
      //unreachable goal
      if (!canReachGoal) {
        console.log("CAN'T REACH GOAL. RETURNING");
      }
      // If the goal is already in the knownFacts, we can return
      if (localKnownFacts.includes(parentGoal[0].split("THEN")[1].trim())) {
        console.log("PARENT GOAL IS NOW KNOWN. RETURNING");
        return localKnownFacts;
      }
      //start infference engine
      if (rule) console.log("INFER START. CHECKING RULE: ", rule);
      conditionPartOfRuleOfGoal = rule.split("IF")[1].split("THEN")[0];
      conditions = conditionPartOfRuleOfGoal.includes("temperature")
        ? [conditionPartOfRuleOfGoal]
        : conditionPartOfRuleOfGoal.split("AND").map((condition) => condition);

      allConditionsTrue = true;
      unfulfilledConditions = [];
      conditions.forEach((condition) => {
        //checks if a condition is negated or a temperature (special) condition
        if (condition.includes("not") && !condition.includes("temperature")) {
          console.log("NEGATED CONDITION", condition.split("not")[1].trim());
          //if a negated condition is present in the database, we can't reach the goal
          if (localKnownFacts.includes(condition.split("not")[1].trim())) {
            console.log(
              "NEGATED CONDITION PRESENT IN DATABASE, CANNOT REACH GOAL"
            );
            canReachGoal = false;
            allConditionsTrue = false;
          }

          //if a non negated condition is not present in the database, add it to the unfulfilled conditions
        } else if (!localKnownFacts.includes(condition.trim())) {
          unfulfilledConditions.push(condition);
          console.log(
            "NEEDED CONDITION ABSENT: ADDING TO UNFULLFILLED",
            condition
          );
          allConditionsTrue = false;
        }
      });

      //idk why this works but it does

      if (unfulfilledConditions)
        if (allConditionsTrue) {
          console.log("CONDITION", conditionPartOfRuleOfGoal, "IS TRUE");

          const newFact = rule.split("THEN")[1].trim();
          if (!localKnownFacts.includes(newFact)) {
            localKnownFacts.push(newFact);
          }
          console.log(
            "ALL CONDITIONS MET. LOCALNEWFACTS AFTER PUSH",
            localKnownFacts
          );
          console.log("VISITED GOALS AFTER POP", visitedGoals);
          return;
        }
    };

    // for the first goal, we need to find the rule that can infer the goal, and so unfulfilledConditions is set
    console.log("RULE OF GOAL", ruleOfGoal);
    infer(ruleOfGoal[0]);

    // If the conditions are not in the knownFacts, we need to find the rules that can infer the conditions
    unfulfilledConditions.forEach((unfulfilledCondition) => {
      // Find the rule that can infer the unfulfilled condition
      const ruleThatCanInfer = rules.filter((rule) =>
        rule.includes("THEN " + unfulfilledCondition.trim())
      );
      console.log("ruleThatCanInfer", ruleThatCanInfer);

      // If there is a rule that can infer the unfulfilled condition, we call the recursion
      if (ruleThatCanInfer.length > 0) {
        console.log("CALLING RECURSION");
        const newFacts = backwardChain(
          parentGoal,
          ruleThatCanInfer,
          localKnownFacts,
          setKnownFacts,
          rules,
          visitedGoals,
          canReachGoal
        );
        console.log("RESULT OF RECURSION", newFacts);
        if (newFacts.length > localKnownFacts.length) {
          localKnownFacts = newFacts;
          infer(ruleThatCanInfer[0]);
          if (allConditionsTrue) {
            console.log("NEWLY INFERRED FACTS AFTER INFER():", localKnownFacts);
            console.log("CHECKING PARENT GOAL WITH INFER");
            infer(parentGoal[0]);
            console.log("VISITED GOALS AFTER POP", visitedGoals);
          }
        }

        // If there is no rule that can infer the unfulfilled condition, we can't reach the goal
      } else {
        canReachGoal = false;
        return;
      }
    });
    return localKnownFacts;
  };

  const facts = [
    "temperature is <37",
    "temperature is >37 AND temperature <38",
    "temperature is >38",
    "cough",
    "headache",
    "cold",
    "sore throat",
    "light nasal breathing",
    "heavy nasal breathing",
    "antibiotics allergy",
  ];
  const goals = [
    "no fever",
    "low fever",
    "high fever",
    "nasal discharge",
    "sinus membranes swelling",
    "cold",
    "treat",
    "don't treat",
    "give medication",
    "don't give medication",
    "give Tylenol",
    "give antibiotics",
  ];

  const rules = [
    "IF temperature is <37 THEN no fever",
    "IF temperature is >37 AND temperature <38 THEN low fever",
    "IF temperature is >38 THEN high fever",
    "IF light nasal breathing THEN nasal discharge",
    "IF heavy nasal breathing THEN sinus membranes swelling",
    "IF low fever AND headache AND nasal discharge AND cough THEN cold",
    "IF cold AND sore throat THEN treat",
    "IF cold AND not sore throat THEN don't treat",
    "IF treat THEN give medication",
    "IF don't treat THEN don't give medication",
    "IF give medication AND antibiotics allergy THEN give Tylenol",
    "IF give medication AND not antibiotics allergy THEN give antibiotics",
  ];
  const notify = () => {
    if (databaseContent.length === 0) {
      toast.error("No symptoms selected");
      return;
    }
    if (selectedGoal === "") {
      toast.error("No goal selected");
      return;
    }
    databaseContent.includes(selectedGoal)
      ? toast.success("Goal reached")
      : toast.error("Goal not reached");
  };

  return (
    <div className="glassmorphism flex gap-2 w-full h-screen">
      <div className="flex-1 gap-2 flex-col max-h-full">
        <FactPicker
          facts={facts}
          selectedFacts={selectedFacts}
          handleFactClick={handleFactClick}
        />
        <GoalPicker
          goals={goals}
          setSelectedGoal={setSelectedGoal}
          selectedGoal={selectedGoal}
        />
      </div>

      <div className="flex flex-col flex-1 h-full">
        <Rules rules={rules} />
      </div>

      <div className="flex flex-1 flex-col gap-2 h-full">
        <div className="flex flex-col flex-1">
          <h1 className="text-lg font-bold font-inter">Database</h1>
          <Database
            databaseContent={databaseContent}
            inferredFacts={infferedFacts}
          />
        </div>
        <h1 className=" font-inter font-bold ">Inference</h1>

        <div className="items-center flex gap-2">
          <div
            className={`flex flex-1 border border-gray-400 rounded-lg items-center justify-center px-4 py-2 duration-200 ease-in-out cursor-pointer ${
              forwardChaining ? "bg-blue-300 hover:bg-blue-300" : ""
            }`}
            onClick={() => setForwardChaining(true)}
          >
            Forward Chaining
          </div>
          <div
            className={`flex flex-1 border border-gray-400 rounded-lg items-center justify-center px-4 py-2 duration-200 ease-in-out cursor-pointer ${
              forwardChaining ? "" : "bg-blue-300 hover:bg-blue-300"
            }`}
            onClick={() => setForwardChaining(false)}
          >
            Backward Chaining
          </div>
          {forwardChaining ? (
            <button
              className="bg-orange-400 rounded-lg px-4 py-2"
              onClick={() => {
                forwardChain();
                notify();
                console.log("FC");
              }}
            >
              Start
            </button>
          ) : (
            <button
              className="bg-orange-400 rounded-lg px-4 py-2"
              onClick={() => {
                setDatabaseContent(
                  backwardChain(
                    rules.filter((rule) =>
                      rule.split("THEN")[1].includes(selectedGoal)
                    ),
                    rules.filter((rule) =>
                      rule.split("THEN")[1].includes(selectedGoal)
                    ),
                    selectedFacts,
                    setSelectedFacts,
                    rules
                  )
                );
                console.log("BC");
                notify();
              }}
            >
              Start
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
