import { getGroqCompletion, getGroqCompletionParallel } from "@/ai/groq";
import { useEffect, useState } from "react";

export default function Aboriginal({
  initState,
  systemPrompts,
  maxTokens,
  handleResponse,
  runSystemPrompts
}: {
  initState: any;
  systemPrompts: string[];
  maxTokens: number;
  runSystemPrompts: string[];
  handleResponse: (response: any) => void;
}) {
  const [state, setState] = useState<any>(initState);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [generating, setGenerating] = useState<boolean>(false);

  useEffect(() => {
    runPrompts();
  }, [runSystemPrompts]);

  const runPrompts = async () => {
    setGenerating(true);

    const responses = await getGroqCompletionParallel(
      [JSON.stringify(state)],
      maxTokens,
      systemPrompts
    );

    const newState = await updateAnalysis(responses);
    setState(newState);
    setAnalysis(responses);
    handleResponse(newState);
    setGenerating(false);
  };

  const updateAnalysis = async (analysis: string[]) => {
    const { annualReport, ...currentState } = state;
    const stateString = JSON.stringify(currentState);
    const newState = await getGroqCompletion(
      `State JSON: ${stateString}, SWOT analysis from stakeholders: ${analysis.join(
        ","
      )}`,
      maxTokens,
      `You will be provided with the current state of a forestry project as well as 
      A series of SWOT analysis of the project from the point of view of different stakeholder groups. 
      Use the analysis to predict changes in the project state JSON object. 
      Include a summary of your reasoning in the annualReport field. Only return the JSON object with no other text or explanation.`,
      true
    );
    return JSON.parse(newState);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between w-full flex-wrap">
        {systemPrompts.map((t, i) => (
          <div
            key={i}
            className="flex flex-col rounded-lg p-2 hover:shadow m-2"
          >
            <span className="font-semibold my-2">{systemPrompts[i]}</span>
            <span>{generating ? "Generating..." : analysis[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}