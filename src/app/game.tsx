"use client"

import Groq from "groq-sdk";
import { useState, useEffect } from "react";
import { generateImageFal } from "./ai";
import ReactPlayer from "react-player";
import { aiReturn } from "./ai";

// const groq_key = process.env["NEXT_PUBLIC_GROQ"];

// const groq = new Groq({
//   apiKey: groq_key,
//   dangerouslyAllowBrowser: true,
// });

export default function LostInShanghai() {
  const defaultGameState = {
    population: 200000,
    economy: 10000000,
    technologyValue: 10,
    culturalAndReligiousValue: 1000,
    residentHappiness: 50,
    year: 1843,
    event: "The year is 1843, and Shanghai whispers tales of ages past at the dawn of a transformative epoch. This ancient metropolis, cradled by centuries of Han wisdom and the mystic legacies of countless dynasties, stands on the threshold of an unseen future. As the chosen steward of its stories and streets, you wield the power to meld tradition with the winds of change. Will you shield the sacred relics of history or forge a path of innovation, casting new light on old shadows? The echoes of the dragon's legacy call to you. Embark on a journey where myth and reality converge to weave the fabric of Shanghai's destiny. Welcome to 'Eternal Tapestry: The Chronicles of Shanghai.",
    actions: ["Start","",""],
    selectedAction: "",
  };

  const [game, setGame] = useState(defaultGameState);
  const [img, setImg] = useState("");
  const [fetching, setFetching] = useState(false);

  const generateImage = async (imageDescription:string) => {
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
      const imageDescription = `Aim to create a visually stunning and immersive representation of Shanghai's cultural heritage during this specific era. Based on the game year: ${game.year} game event: ${game.event}, game state: ${JSON.stringify(game)}, and the selected action: ${game.selectedAction}. Ray-traced street scene of modern City that captures the essence of the current game state. The image should showcase beautiful Chinese timber architecture with intricate details and ornate decorations. Incorporate a festive Chinese New Year atmosphere with traditional red lanterns, banners, and decorations.`;
      generateImage(imageDescription);
    }, 8000);

    return () => clearInterval(interval);
  }, [game]);

  async function handleClick(buttonText:string) {
    const systemPrompt = `You are an AI assistant for the game "Eternal Tapestry: The Chronicles of Shanghai". The user will provide you with a JSON object describing the current game state and an action they wish to take. Update the JSON object based on the user's action, considering the impact on population, economy, cultural and religious value and resident happiness. Always modify the variable values based on the chosen decision to reflect the consequences of the player's choices.

    Always provide exactly 4 options for the player to choose from. Make sure the game keeps going and there are always 4 decisions available.

    Provide engaging events and strategic options for the player. The options should be diverse, thought-provoking, and potentially controversial to create an immersive and challenging experience. Indicate the specific changes in variable values for each decision in the decision text itself.

    Please ensure that the JSON object you generate is valid and properly formatted. Use double quotes for property names and string values. Escape any double quotes or backslashes within string values. Do not include comments or any other text outside the JSON object.

    Format the JSON object as follows:
    {
      "population": number,
      "economy": number,
      "technologyValue": number,
      "culturalAndReligiousValue": number,
      "residentHappiness": number,
      "year": number,
      "event": "string",
      "actions": [
        "string",
        "string",
        "string",
        "string"
      ],
      "selectedAction": "string"
    }

    Adjust the population each time a decision is made. Generate events and options that reflect the characteristics and challenges of each era.

    Progress the year by 10 years each time a decision is made. Generate events and options that reflect the characteristics and challenges of each era.

    Only output the JSON object with no other text or explanation. JSON OBJECT: {`;

    const userPrompt = `Current game state: ${JSON.stringify(
      game,
      null,
      2
    )}. The user wants to take the action: ${buttonText}`;

    const gameState = await aiReturn(userPrompt, 3000, systemPrompt);

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



  return (
    <div className="background">
      {
        typeof window !== "undefined" && (<ReactPlayer
                                           url="https://soundcloud.com/xumengyuan/china-g?in=xumengyuan/sets/china-series-1&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
                                           playing={true}
                                           loop={true}
                                           width="0"
                                           height="0"
                                           volume={0.1}
                                         />)
      }
      
        <div className="title">WORLD ENGINE</div>
      <div className="navbar">
        <div>Year: {game.year}</div>
        <div>Population: {game.population}</div>
        <div>Economy: ${game.economy}</div>
        <div>Technology Value: {game.technologyValue}</div>
        <div>Cultural And Religious Value: {game.culturalAndReligiousValue}</div>
        <div>Resident Happiness: {game.residentHappiness}%</div>
      </div>
      <div>{game.event}</div>

      <div className="row hero">
        <div className="GameTitleC">永恒织锦: 世纪之城</div>
        <div className="GameTitle">The Chronicles of Shanghai</div>
        {img && <img className="HeroImage" src={img} alt="Generated Image" />}
      </div>

      {/* {fetching && <div className="loading">Loading...</div>} */}
      {game.actions.map((action, index) => (
        <button key={index} onClick={() => handleClick(action)}>
          {typeof action === 'string' ? action : action.name}
        </button>    
      ))}

      <div className="empty_space">
      </div>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} LOST IN SHANGHAI. ALL RIGHTS RESERVED.</p>
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