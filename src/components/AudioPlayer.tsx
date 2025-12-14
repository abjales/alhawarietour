import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// PLACEHOLDER: Replace this URL with your actual audio file
// You can either:
// 1. Import a local file: import audioFile from "@/assets/your-audio.mp3"
// 2. Use a public URL: const AUDIO_URL = "https://your-domain.com/audio.mp3"
const AUDIO_URL = "/audio/promise.mp3"; // Place your MP3 in public/audio/promise.mp3

const PROMISE_TEXT = `As ALHAWARIE TOURS, We specialize in creating good quality, comprehensive, and stress-free packages for the holy pilgrimages of Umrah and Hajj. Our commitment is to ensure your focus remains solely on your spiritual devotion, while we manage all logistics from Global ticketing, visa processing and comfortable accommodation near the Holy Sites to reliable transportation and guidance. We deliver true peace of mind for these life-changing journeys.`;

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(AUDIO_URL);
    
    audioRef.current.addEventListener("ended", () => {
      setIsPlaying(false);
    });

    audioRef.current.addEventListener("error", () => {
      console.log("Audio file not found. Please add your MP3 to public/audio/promise.mp3");
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        // Audio failed to play - show quote anyway for demo
        console.log("Audio playback failed - showing quote for demonstration");
      });
      setIsPlaying(true);
      setShowQuote(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Button
          variant="audioPlay"
          size="lg"
          onClick={togglePlay}
          className="group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-3">
            <motion.span
              animate={{ scale: isPlaying ? [1, 1.2, 1] : 1 }}
              transition={{ repeat: isPlaying ? Infinity : 0, duration: 1 }}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </motion.span>
            <span>{isPlaying ? "Pause" : "Hear Our Promise"}</span>
            {isPlaying && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-0.5"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-1 bg-secondary rounded-full"
                    animate={{ height: [8, 16, 8] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.span>
            )}
          </span>
        </Button>
      </motion.div>

      <AnimatePresence>
        {showQuote && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 32 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="quote-block text-primary-foreground/90 text-sm md:text-base leading-relaxed backdrop-blur-sm bg-primary/30 p-6 rounded-xl border border-gold/20"
            >
              <Volume2 className="h-5 w-5 text-secondary mb-3" />
              <p className="font-serif italic">{PROMISE_TEXT}</p>
              <footer className="mt-4 text-secondary font-semibold text-sm not-italic">
                — ALHAWARIE TOURS
              </footer>
            </motion.blockquote>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
