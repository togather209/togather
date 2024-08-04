import "./App.css";
import UnderBar from "./components/common/UnderBar";
import TokenRefresher from "./utils/TokenRefresher";
function App() {
  return (
    <TokenRefresher>
      <UnderBar />
    </TokenRefresher>
  );
}

export default App;
