import { useEffect } from "react";
import "./App.css";
import UnderBar from "./components/common/UnderBar";
import { useFirebase } from "./firebaseContext";
import TokenRefresher from "./utils/TokenRefresher";

function App() {
  const { onMessageListener } = useFirebase();

  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        console.log("Message received. ", payload);
        // 알림을 사용자에게 표시하는 로직 추가
      })
      .catch((err) => console.log("failed: ", err));
  }, [onMessageListener]);

  return (

      <TokenRefresher>
        <UnderBar />
      </TokenRefresher>
  );
}

export default App;
