import { analyze_pdf } from "./ai";
import Game from "./game";

// TODO: Adjust the prompt, this will become the description of the game
const prompt =  "Generate a description for agame based on aboriginal"


export default async function Home() {
  // const response = await analyze_pdf("https://drive.google.com/uc?export=download&id=14yRjQYg3kvmqRaKsvrdHix85qHB9Mbt1", prompt);
  // console.log(response);

  // TODO: ASK Teamate:Add vertex AI role to service account in google cloud platform > IAM > Service Account > Add Role      paste response
  return (
    <main className="main">
      <Game description={""}/>                        
    </main>
  );
}
