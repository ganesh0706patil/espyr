import {BrowserRouter as Router , Routes , Route} from "react-router-dom";
import { RedirectToSignIn, SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import Practice from "./pages/Practice";
import MentorPage from "./pages/MentorPage";
import Dashboard from "./pages/Dashboard";


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
            <Route path="/practice/:id" element={<Practice />} />
            <Route path="/mentor/:id" element={<MentorPage />} />
            <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
       
      </Router>
    </>
  )
}

export default App
