import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { clsx } from "clsx";
import BXLg from "../icons/BXLg.jsx";
import BFullscreen from "../icons/BFullscreen.jsx";
import { defaultPlayerOptions, PLAYER } from "../config.js";

const Player = ({ playerId, playerState, setPlayerState }) => {
  const [playerVolume, setPlayerVolume] = useState(defaultPlayerOptions.volume);
  const [playerPosition, setPlayerPosition] = useState(defaultPlayerOptions.position);
  const playerRef = useRef();

  function syncVolume() {
    if (playerRef.current) {
      setPlayerVolume(() => playerRef.current.volume);
    }
  }

  function handlePositionButtonClick() {
    setPlayerPosition((prev) => (prev === "bottom" ? "center" : "bottom"));
    syncVolume();
  }

  return (
    <div
      className={clsx(
        "fixed block",
        playerState === PLAYER.STOP && "!hidden",
        playerPosition === "bottom"
          ? "right-4 bottom-4"
          : "right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2",
      )}
    >
      <div className="mx-1 flex justify-end gap-x-1 py-1">
        <PlayerTopbarButton icon={BFullscreen} onClick={handlePositionButtonClick}>
        </PlayerTopbarButton>
        <PlayerTopbarButton icon={BXLg} onClick={() => setPlayerState(0)}>
        </PlayerTopbarButton>
      </div>

      <div
        className={clsx(
          "transition-shadow",
          { "h-[270px] w-[480px]": playerPosition === "bottom" },
          { "h-[540px] w-[960px] shadow-3xl shadow-black/80": playerPosition === "center" },
        )}
      >
        <ReactPlayer
          ref={playerRef}
          src={`https://www.youtube.com/watch?v=${playerId}`}
          playing={playerState === PLAYER.PLAY}
          width="100%"
          height="100%"
          controls
          volume={playerVolume}
          onSeeking={syncVolume}
          onPlaying={() => {
            setPlayerState(PLAYER.PLAY);
            syncVolume();
          }}
          onPause={() => {
            if (playerState === PLAYER.STOP) return;
            setPlayerState(PLAYER.PAUSE);
            syncVolume();
          }}
        />
      </div>
    </div>
  );
};

const PlayerTopbarButton = ({ onClick, icon: Icon }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-md bg-gray-500 p-1 text-white hover:bg-gray-400 dark:bg-gray-600 hover:dark:bg-gray-500"
    >
      <Icon className="w-4 h-4"></Icon>
    </button>
  );
};

export default Player;
