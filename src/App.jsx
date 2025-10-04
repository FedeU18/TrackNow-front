import SignUp from "./templates/sign-up/SignUp";
import SignIn from "./templates/sign-in/SignIn";
import "./App.css";

function App() {
  return (
    <div style={{ maxWidth: "1000px", margin: "auto" }}>
      <SignUp />;{/* <SignIn /> */}
    </div>
  );
}

export default App;
