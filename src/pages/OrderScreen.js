import React, { useEffect } from "react";

import { useSelector } from "react-redux";

// Play Sound
import useSound from "use-sound";

// Components
import OrderTable from "../components/order/OrderTable";

import pairAudio from "../asset/pair.mp3";
import appealAudio from "../asset/static.mp3";

const DashBoardScreen = () => {
  // const [appealIsPlaying, setAppealIsPlaying] = useState(false);
  // const [pairIsPlaying, setPairIsPlaying] = useState(false);

  // eslint-disable-next-line
  const [appealPlay, { stop: appealStop, sound: appealSound }] = useSound(
    appealAudio,
    { loop: true }
  );

  // eslint-disable-next-line
  const [pairPlay, { stop: pairStop, sound: pairSound }] = useSound(pairAudio, {
    loop: true,
  });

  const { alertList } = useSelector((state) => state.alert);

  const { pair, appeal } = alertList || {};

  // useEffect(() => {
  //   appealSound?.on("stop", () => setAppealIsPlaying(false));
  //   appealSound?.on("play", () => setAppealIsPlaying(true));
  //   appealSound?.on("end", () => setAppealIsPlaying(false));
  //   appealSound?.on("pause", () => setAppealIsPlaying(false));
  // }, [appealSound]);

  // useEffect(() => {
  //   pairSound?.on("stop", () => setPairIsPlaying(false));
  //   pairSound?.on("play", () => setPairIsPlaying(true));
  //   pairSound?.on("end", () => setPairIsPlaying(false));
  //   pairSound?.on("pause", () => setPairIsPlaying(false));
  // }, [pairSound]);

  // Alert Sound
  useEffect(() => {
    if (!pair.length) return;

    if (pair.length) {
      pairPlay();
    }
    return () => {
      pairStop();
    };
  }, [pairPlay, pairStop, pair]);

  useEffect(() => {
    if (!appeal.length) return;

    if (pair.length) return;

    if (appeal.length) {
      appealPlay();
    }

    return () => {
      appealStop();
    };
  }, [appealPlay, appealStop, appeal, pair]);
  return (
    <div>
      <OrderTable />
    </div>
  );
};

export default DashBoardScreen;
