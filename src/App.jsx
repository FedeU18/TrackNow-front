import SignUp from "./templates/sign-up/SignUp";
import SignIn from "./templates/sign-in/SignIn";
import "./App.css";

function App() {
  // return <SignUp />;
  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <SignIn />
    </div>
  );
}

export default App;
