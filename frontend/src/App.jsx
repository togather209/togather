import { useEffect } from "react";
import "./App.css";
import UnderBar from "./components/common/UnderBar";
import { useFirebase } from "./firebaseContext";
import TokenRefresher from "./utils/TokenRefresher";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const { onMessageListener } = useFirebase();

  useEffect(() => {
    onMessageListener()
      .then((payload) => {

      })
      .catch((err) => console.error("failed: ", err));
  }, [onMessageListener]);

  return (
    <TokenRefresher>
      <AppRoutes />
      <UnderBar />
    </TokenRefresher>
  );
}

export default App;
