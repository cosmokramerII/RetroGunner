import { useEffect } from "react";
import { useAudio } from "../lib/stores/useAudio";
import { retroMusic } from "../lib/audio/retro-music";

const SoundManager = () => {
  const { setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    // Use the 80s retro music generator instead of MP3
    retroMusic.setVolume(0.4);
    retroMusic.setTempo(128); // Classic 80s tempo
    
    // Keep the sound effects
    const hitSound = new Audio('/sounds/hit.mp3');
    hitSound.volume = 0.5;
    setHitSound(hitSound);

    const successSound = new Audio('/sounds/success.mp3');
    successSound.volume = 0.6;
    setSuccessSound(successSound);

    // Cleanup
    return () => {
      retroMusic.stop();
      hitSound.pause();
      successSound.pause();
    };
  }, [setHitSound, setSuccessSound]);

  return null; // This component doesn't render anything
};

export default SoundManager;
