
import { getGeminiText } from "./ai";
import Game from "./game";

// TODO: Adjust the prompt, this will become the description of the game
const prompt =  "Generate a description for agame based on aboriginal"


export default async function Home() {





  return (
    <main className="main">
      <Game description={""}/>                        
    </main>
  );
}
