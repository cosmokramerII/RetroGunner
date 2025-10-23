import { useEffect } from "react";
import { useAudio } from "../lib/stores/useAudio";

const SoundManager = () => {
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    // Load and setup audio files
    const backgroundMusic = new Audio('/sounds/background.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    setBackgroundMusic(backgroundMusic);

    const hitSound = new Audio('/sounds/hit.mp3');
    hitSound.volume = 0.5;
    setHitSound(hitSound);

    const successSound = new Audio('/sounds/success.mp3');
    successSound.volume = 0.6;
    setSuccessSound(successSound);

    // Cleanup
    return () => {
      backgroundMusic.pause();
      hitSound.pause();
      successSound.pause();
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return null; // This component doesn't render anything
};

export default SoundManager;
