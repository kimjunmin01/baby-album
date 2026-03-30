import { useState } from "react";
import Intro from "./components/Intro";
import Home from "./pages/Home";

function App() {
  const [isIntroDone, setIsIntroDone] = useState(false);

  return (
    <>
      {!isIntroDone ? (
        <Intro onFinish={() => setIsIntroDone(true)} />
      ) : (
        <Home />
      )}
    </>
  );
}

export default App;