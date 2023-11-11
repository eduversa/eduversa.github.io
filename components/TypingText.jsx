import { useState, useEffect } from "react";

const textArray = [
  "Best Education",
  "Best Job",
  "World Class Campus",
  "Highly Qualified Faculty",
  "S-Tier Labs",
];

function TypingText() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const typingSpeed = 150;

  useEffect(() => {
    const typingTimer = setInterval(() => {
      const currentTextToType = textArray[currentTextIndex];
      const nextCharIndex = currentText.length + 1;

      if (nextCharIndex <= currentTextToType.length) {
        setCurrentText(currentTextToType.slice(0, nextCharIndex));
      } else {
        setCurrentText("");
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textArray.length);
      }
    }, typingSpeed);

    return () => clearInterval(typingTimer);
  }, [currentText, currentTextIndex]);

  return (
    <div className="typingEffect">
      <h1>We Offer {currentText}</h1>
      <h3>And Many More...</h3>
    </div>
  );
}
export default TypingText;
