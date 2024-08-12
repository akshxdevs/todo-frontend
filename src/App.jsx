import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import { Signup } from "./Components/Signup";
import { UserTodos } from "./Components/UserTodos";
import { Home } from "./Components/Home";
function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/usertodos" element={<UserTodos/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
