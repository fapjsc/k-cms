import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

// Play Sound
import useSound from "use-sound";

// Components
import OrderTable from "../components/dashboard/OrderTable";

import pairAudio from "../asset/tip.mp3";
import appealAudio from "../asset/static.mp3";

const DashBoardScreen = () => {
  const [appealIsPlaying, setAppealIsPlaying] = useState(false);
  const [pairIsPlaying, setPairIsPlaying] = useState(false);

  const [appealPlay, { stop: appealStop, sound: appealSound }] =
    useSound(appealAudio);

  const [pairPlay, { stop: pairStop, sound: pairSound }] = useSound(pairAudio);

  const { alertList } = useSelector((state) => state.alert);

  const { pair, appeal } = alertList || {};

  useEffect(() => {
    appealSound?.on("stop", () => setAppealIsPlaying(false));
    appealSound?.on("play", () => setAppealIsPlaying(true));
    appealSound?.on("end", () => setAppealIsPlaying(false));
    appealSound?.on("pause", () => setAppealIsPlaying(false));
  }, [appealSound]);

  useEffect(() => {
    pairSound?.on("stop", () => setPairIsPlaying(false));
    pairSound?.on("play", () => setPairIsPlaying(true));
    pairSound?.on("end", () => setPairIsPlaying(false));
    pairSound?.on("pause", () => setPairIsPlaying(false));
  }, [pairSound]);

  // Alert Sound
  useEffect(() => {
    if (pairIsPlaying) return;

    if (pair.length) {
      pairPlay();
    }
  }, [pairPlay, pairStop, pair]);

  useEffect(() => {
    if (appeal.length) {
      if (appealIsPlaying) {
        appealStop();
      }
      appealPlay();
    }

    if (!appeal.length) {
      appealStop();
    }

    return () => {
      appealStop();
    };
  }, [appealPlay, appealStop, appeal]);
  return (
    <div>
      <OrderTable />
    </div>
  );
};

export default DashBoardScreen;
