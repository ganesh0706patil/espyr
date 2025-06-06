import {BrowserRouter as Router , Routes , Route} from "react-router-dom";
import { RedirectToSignIn, SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import MentorAgent from "./pages/MentorAgent";
import Practice from "./pages/Practice";
import MentorPage from "./pages/MentorPage";


function App() {
  
  return (
    <>
      <Router>
        <Routes>
            <Route index element={<Home/>}/>
            <Route path="/problems" element={
              <>
                <SignedIn>
                  <Problems/>
                </SignedIn>
                
                <SignedOut>
                  <RedirectToSignIn/>
                </SignedOut>
              </>
            } />
            <Route path="/mentor-agent" element={<MentorAgent />} />
            <Route path="/practice/:id" element={<Practice />} />
            <Route path="/mentor" element={<MentorPage />} />
        </Routes>
       
      </Router>
    </>
  )
}

export default App
