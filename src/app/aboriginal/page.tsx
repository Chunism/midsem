"use client";
import Aboriginal from "@/components/aboriginal";
import { useState } from "react";


const initState = {
  year: 1770,
  economy: 10000,
  AboriginalProportion: 100,
  culturalHeritageValue: 1000,
  residentHappiness: 80,
  event: "The year is 1770, and the continent of Australia is home to a thriving Aboriginal population with rich cultural traditions. As European explorers arrive on the shores, a pivotal moment in history emerges. Will you forge a path of mutual respect and collaboration, or will the dark shadow of colonization engulf the land? The fate of Australia and its indigenous peoples rests in your hands. Welcome to 'Alternate Tides: A New Dawn for Australia'.",
  actions: ["Start", "", ""],
  selectedAction: "",
}


//Examples of macroeconomic experts
const economicExperts = [
  "based on the current state of the project, predict likely changes in the global economy that may impact project revenue over the next 3 years.",
  "based on the current state of the project, predict likely infrastructure costs required to increase supply output by 15% over the next 3 years. ",
  "based on current state of the project, predict bottlenecks in supply logistics over the next 3 years. ",
  "based on current state of the project, predict the most likely 5 environmental challenges that will impact the project over the next 3 years.",
  "based on current state of the project, predict the most likely political and policy barriers to project success over the next 3 years. ",
  "based on current state of the project, predict the most likely economic and financial barriers to project success over the next 3 years. ",
];

// Examples
// const aboriginals = [
//   "based on the game state: ${JSON.stringify(game)}, the game event: ${game.event}, and the selected action: ${game.selectedAction}.
// ]

//Demo of generating a forecast
export default function ExpertPage() {
  const [state, setState] = useState<any>(initState);

  function handleResponse(newState: any) {
    //do something with the new state
    newState.year += 3;
    setState(newState);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col w-full">
          <div>
            {Object.keys(state).map((key) => (
              <div className="flex justify-between" key={key}>
                <span className="font-semibold">{key}: </span>
                <span>{state[key]}</span>
              </div>
            ))}
          </div>
          <Aboriginal
            initState={state}
            systemPrompts={economicExperts}
            maxTokens={512}
            handleResponse={handleResponse}
            runSystemPrompts={economicExperts}
          />
        </div>
      </div>
    </main>
  );
}
