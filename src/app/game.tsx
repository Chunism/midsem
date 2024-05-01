"use client"

import Groq from "groq-sdk";
import { useState, useEffect } from "react";
import { generateImageFal } from "./ai";
import ReactPlayer from "react-player";

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

export default function AlternateTides() {
  const defaultGameState = {
    year: 1770,
    economy: 10000,
    AboriginalProportion: 100,
    culturalHeritageValue: 1000,
    residentHappiness: 80,
    event: "The year is 1770, and the continent of Australia is home to a thriving Aboriginal population with rich cultural traditions. As European explorers arrive on the shores, a pivotal moment in history emerges. The collision of two vastly different worlds sets the stage for a complex and often tragic narrative. The Aboriginal people face the threat of dispossession, disease, and cultural erosion, while the colonizers grapple with the moral dilemmas of their actions. As a key figure in this unfolding story, your decisions will shape the future of Australia and its people. Will you champion the cause of the Aboriginal people, fighting for their rights and preserving their heritage? Or will you prioritize the interests of the colonizers, seeking to establish a new society at any cost? The path you choose will have far-reaching consequences, echoing through generations. Brace yourself for a journey that will test your resolve, challenge your beliefs, and forever alter the course of history. Welcome to 'Alternate Tides: A New Dawn for Australia'.",
    actions: [
      "Establish a treaty with the Aboriginal people, recognizing their sovereignty and land rights.",
      "Prioritize colonial expansion and resource exploitation, disregarding Aboriginal claims.",
      "Introduce policies to 'civilize' and assimilate Aboriginal people into European society.",
      "Advocate for the preservation of Aboriginal culture and the protection of sacred sites."
    ],
    selectedAction: "",
  };

  const [game, setGame] = useState(defaultGameState);
  const [img, setImg] = useState("");
  const [fetching, setFetching] = useState(false);
  const [analysis, setAnalysis] = useState<{ [key: string]: string }>({});

  const generateImage = async (imageDescription: string) => {
    setFetching(true);
    try {
      const response = await generateImageFal(imageDescription);
      const imageUrl = response;
      setImg(imageUrl);
      setFetching(false);
    } catch (error) {
      console.error("Error generating image:", error);
      setFetching(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const imageDescription = `Generate an image that represents the state of Aboriginal culture and society in Australia during the year ${game.year}. Show the influence of European contact and the effects of the decisions made in the game. Highlight the unique aspects of Aboriginal art, architecture, and way of life. Depict the level of cultural preservation and the interactions between Aboriginal people and European settlers based on the game state: ${JSON.stringify(game)}, the game event: ${game.event}, and the selected action: ${game.selectedAction}.`;
      generateImage(imageDescription);
    }, 10000);

    return () => clearInterval(interval);
  }, [game]);

  useEffect(() => {
    const generateAnalysis = async () => {
      const analysisPromises = game.actions.map(async (action) => {
        const analysisPrompt = `Analyze the consequences of selecting the action "${action}" in the current game state: ${JSON.stringify(game, null, 2)} within 100 words`;

        const MAX_RETRIES = 3;
        let retries = 0;
        let analysisResponse = "";

        while (retries < MAX_RETRIES) {
          try {
            analysisResponse = await ai(analysisPrompt, 1024, "");
            break;
          } catch (error) {
            console.error("Error generating analysis:", error);
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
          }
        }

        if (retries === MAX_RETRIES) {
          analysisResponse = "Failed to generate analysis. Please try again later.";
        }

        return { action, analysis: analysisResponse };
      });

      const analysisResults = await Promise.all(analysisPromises);
      const updatedAnalysis: { [key: string]: string } = {};
      analysisResults.forEach(({ action, analysis }) => {
        updatedAnalysis[action] = analysis;
      });

      setAnalysis(updatedAnalysis);
    };

    generateAnalysis();
  }, [game.actions]);

  async function handleClick(buttonText: string) {
    const analysisText = analysis[buttonText] || "";

    const systemPrompt = `You are an AI assistant for the game "Alternate Tides: A New Dawn for Australia". The user will provide you with a JSON object describing the current game state, an action they wish to take, and an analysis of the consequences of that action. Update the JSON object based on the user's action and the analysis, considering the impact on year, economy, Aboriginal proportion, cultural heritage value, and resident happiness. Modify the variable values to reflect the consequences of the player's choices accurately.

    Always provide exactly 4 options for the player to choose from. Ensure that the gameplay continues dynamically, with a range of decisions available at each point.

    Provide engaging events and strategic options for the player. The options should be diverse, thought-provoking, and reflective of the cultural and historical context of the game scenario. Consider the complex realities of colonization, the struggles of the Aboriginal people, and the moral dilemmas faced by various actors. Explore themes such as dispossession, cultural erosion, resistance, assimilation, and the fight for rights and recognition. Present choices that have significant consequences and shape the trajectory of Australia's history.

    Generate a new event for the game, which should be around 100 words and create a complex scenario based on the decision and analysis provided. The event should reflect the consequences of the player's choice and introduce new challenges or opportunities.

    Indicate the specific changes in variable values for each decision in the decision text itself. Adjust key variables like economy, cultural heritage value, and resident happiness based on the nature and impact of the choices made. Reflect the tensions, trade-offs, and long-term effects of the decisions.

    Ensure that the JSON object you generate is valid and properly formatted. Use double quotes for property names and string values. Escape any double quotes or backslashes within string values. Do not include comments or any other text outside the JSON object.

    Format the JSON object as follows:
    {
      "year": number,
      "economy": number,
      "AboriginalProportion": number,
      "culturalHeritageValue": number,
      "residentHappiness": number,
      "event": "string",
      "actions": [
        "string",
        "string",
        "string",
        "string"
      ],
      "selectedAction": "string"
    }

    Progress the year by 10 years each time a decision is made. This simulates long-term effects and developments, aligning with historical contexts and potential alternative outcomes.

    Only output the JSON object with no other text or explanation. JSON OBJECT: {`;

    const userPrompt = `Current game state: ${JSON.stringify(
      game,
      null,
      2
    )}. The user wants to take the action: ${buttonText}. Analysis of the consequences: ${analysisText}`;

    const gameState = await ai(userPrompt, 3000, systemPrompt);

    if (gameState) {
      try {
        const updatedGameState = JSON.parse(gameState);
        setGame(prevState => ({
          ...prevState,
          ...updatedGameState,
          actions: updatedGameState.actions || [],
          selectedAction: buttonText,
          year: prevState.year + 10,
        }));
      } catch (error) {
        console.error("Failed to parse game state:", error);
      }
    } else {
      console.error("Failed to update game state");
    }
  }

  async function ai(userPrompt, max_tokens, systemPrompt = "") {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        model: "mixtral-8x7b-32768",
        max_tokens: max_tokens,
      });

      return completion.choices[0]?.message?.content || "Oops, something went wrong.";
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // Rate limit exceeded, wait for the specified time before retrying
        const retryAfter = error.response.data.error.message.match(/Please try again in (\d+\.\d+)s/)[1];
        await new Promise((resolve) => setTimeout(resolve, parseFloat(retryAfter) * 1000));
        return ai(userPrompt, max_tokens, systemPrompt); // Retry the request
      } else {
        throw error;
      }
    }
  }

  return (
    <div className="background">
      <ReactPlayer
        url="https://www.youtube.com/watch?v=Jf-jHCdafZY"
        playing={true}
        loop={true}
        width="0"
        height="0"
        volume={0.3}
      />
      <div className="title">WORLD ENGINE</div>
      <div className="navbar">
        <div>Year: {game.year}</div>
        <div>Economy: ${game.economy}</div>
        <div>Aboriginal Proportion: {game.AboriginalProportion}%</div>
        <div>Cultural Heritage Value: {game.culturalHeritageValue}</div>
        <div>Resident Happiness: {game.residentHappiness}%</div>
      </div>
      <div>{game.event}</div>

      <div className="row hero">
        <div className="GameTitleC">Alternate Tides</div>
        <div className="GameTitle">A New Dawn for Australia</div>
        {img && <img className="HeroImage" src={img} alt="Generated Image" />}
      </div>

      {game.actions.map((action, index) => (
        <div key={index}>
          <button onClick={() => handleClick(action)}>
            {typeof action === 'string' ? action : action.name}
          </button>
          <div>{analysis[action] || 'Loading analysis...'}</div>
        </div>
      ))}

      <div className="empty_space">
      </div>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Alternate Tides. ALL RIGHTS RESERVED.</p>
          <nav className="footer-nav">
            <div>WORLD ENGINE STUDIO</div>
            <div>CHUN HO LAU, YUSHAN WANG, TIMOTHY JINZHI NG</div>
            <div>RMIT ARCHITECTURE</div>
          </nav>
        </div>
      </footer>
    </div>
  );
}