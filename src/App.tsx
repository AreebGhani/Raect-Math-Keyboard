import "./App.css";
import LatexEditor from "./components/LatexEditor";
import FirebaseProvider from "./providers/FirebaseProvider";

const App = () => {
  return (
    <FirebaseProvider>
      <LatexEditor />
    </FirebaseProvider>
  );
};

export default App;
