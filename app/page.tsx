
import { LandingPage } from "@/components/landing-page";
import { Redirect } from "./components/Redirect";



export default function Home() {
  return (
   <div>
     <Redirect />
     <LandingPage />
   </div>
  );
}
