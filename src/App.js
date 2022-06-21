import { useEffect } from "react";

// Router
import { HashRouter as Router } from "react-router-dom";

// Routes
import PermissionRoute from "./components/PermissionRoute";

// Redux
import { useDispatch, useSelector } from "react-redux";

// Actions
import { setUserInfo } from "./store/actions/userActions";

// Helpers
import { _getToken } from "./lib/helper";

// Websocket
import { connectWithChatSocket } from "./lib/chatSocket"; // Chat
import { connectWithLiveOrderSocket } from "./lib/liveOrderSocket"; // Live order

// Helpers
import { _animateTitle } from "./lib/helper";

// Audio
// import audio from './asset/tip.mp3';

// Style
import "./App.scss";

// let playSound = new Audio(audio);

const App = () => {
  // Redux
  const dispatch = useDispatch();
  const { unReadMessage } = useSelector((state) => state.message);

  const stopAnimationTitleFn = () => {
    _animateTitle("K-CMS", false);
  };

  const animationTitleFn = () => {
    _animateTitle("🔥🔥 new message 🔥🔥", true);
  };

  useEffect(() => {
    const userInfo = _getToken("token");

    if (userInfo) {
      dispatch(setUserInfo(userInfo));
    }
  }, [dispatch]);

  useEffect(() => {
    connectWithChatSocket();
    connectWithLiveOrderSocket();
  }, []);
  

  useEffect(() => {
    if (unReadMessage?.length) {
      // console.log(unReadMessage.length);
      unReadMessage.forEach((el) => {
        if (el.count - localStorage.getItem(el.token) > 0) {
          animationTitleFn();
          // playSound.play();
        }
      });
    } else {
      stopAnimationTitleFn();
    }
  }, [unReadMessage]);

  return (
    <Router>
      <PermissionRoute />
    </Router>
  );
};

export default App;
