import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const quotes = [
  {
    text: "क्रांति से हमारा अभिप्राय है, अन्याय पर आधारित मौजूदा व्यवस्था में परिवर्तन।",
    translation: "By revolution we mean the ultimate establishment of an order of society which may not be threatened by such breakdown."
  },
  {
    text: "मैं एक मानव हूँ और जो कुछ भी मानवता को प्रभावित करता है उससे मुझे मतलब है।",
    translation: "I am a human being and whatever affects humanity concerns me."
  },
  {
    text: "जिंदगी तो अपने दम पर ही जी जाती है, दूसरों के कंधों पर तो सिर्फ जनाजे उठाए जाते हैं।",
    translation: "Life is lived on its own, others' shoulders are used only to carry coffins."
  },
  {
    text: "व्यक्तियों को कुचल कर विचारों को नहीं मारा जा सकता।",
    translation: "Ideas cannot be killed by crushing individuals."
  },
  {
    text: "प्रेम हमेशा मनुष्य के चरित्र को ऊंचा उठाता है। यह कभी भी इसे नीचा नहीं करता, बशर्ते कि प्रेम प्रेम हो।",
    translation: "Love always elevates the character of man. It never lowers him, provided love be love."
  }
];

export function QuotesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary/90 backdrop-blur-sm py-8 px-4">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex items-start justify-center gap-4 mb-3">
                <Quote className="h-6 w-6 text-white/80 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-white font-semibold text-lg sm:text-xl md:text-2xl italic mb-2 leading-relaxed">
                    {quotes[currentIndex].text}
                  </p>
                  <p className="text-white/80 text-base sm:text-lg hidden sm:block">
                    {quotes[currentIndex].translation}
                  </p>
                </div>
                <Quote className="h-6 w-6 text-white/80 flex-shrink-0 mt-1 rotate-180" />
              </div>
              <p className="text-white/90 text-sm sm:text-base font-semibold mt-2">
                — Shaheed Bhagat Singh
              </p>
            </motion.div>
          </AnimatePresence>
          
          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-3">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/40 w-1.5 hover:bg-white/60'
                }`}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
