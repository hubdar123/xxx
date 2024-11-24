import React, { useState } from 'react';
import { ArrowDownUp, Volume2, Copy, HelpCircle, MessageSquare, History, Lightbulb } from 'lucide-react';

const MORSE_CODE: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': ' '
};

function App() {
  const [text, setText] = useState('');
  const [morse, setMorse] = useState('');
  const [isTextToMorse, setIsTextToMorse] = useState(true);

  const textToMorse = (input: string) => {
    return input.toUpperCase().split('').map(char => 
      MORSE_CODE[char] || char
    ).join(' ');
  };

  const morseToText = (input: string) => {
    const reverseMorse = Object.fromEntries(
      Object.entries(MORSE_CODE).map(([key, value]) => [value, key])
    );
    return input.split(' ').map(code => 
      reverseMorse[code] || code
    ).join('');
  };

  const handleInputChange = (value: string) => {
    if (isTextToMorse) {
      setText(value);
      setMorse(textToMorse(value));
    } else {
      setMorse(value);
      setText(morseToText(value));
    }
  };

  const toggleDirection = () => {
    setIsTextToMorse(!isTextToMorse);
    setText('');
    setMorse('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const playMorseCode = () => {
    const audio = new AudioContext();
    const dots = morse.split('').filter(char => char === '.' || char === '-');
    let time = audio.currentTime;

    dots.forEach((dot) => {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.frequency.value = 600;
      gain.gain.value = 0.1;
      osc.start(time);
      osc.stop(time + (dot === '.' ? 0.1 : 0.3));
      time += (dot === '.' ? 0.2 : 0.4);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">Morse Code Translator</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert text to Morse code and vice versa with our intuitive translator. Perfect for learning
            Morse code or sending secret messages!
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-16">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <textarea
                value={isTextToMorse ? text : morse}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-full h-32 p-4 rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
                placeholder={isTextToMorse ? "Enter text to convert..." : "Enter Morse code..."}
              />
              <button
                onClick={() => copyToClipboard(isTextToMorse ? text : morse)}
                className="absolute bottom-4 right-4 text-gray-500 hover:text-indigo-600"
                title="Copy to clipboard"
              >
                <Copy size={20} />
              </button>
            </div>

            <div className="flex justify-center items-center">
              <button
                onClick={toggleDirection}
                className="transform transition-transform hover:scale-110"
              >
                <ArrowDownUp className="text-indigo-600" size={24} />
              </button>
            </div>

            <div className="relative">
              <textarea
                value={isTextToMorse ? morse : text}
                readOnly
                className="w-full h-32 p-4 rounded-lg bg-gray-50 border-2 border-indigo-100 resize-none"
                placeholder="Translation will appear here..."
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => copyToClipboard(isTextToMorse ? morse : text)}
                  className="text-gray-500 hover:text-indigo-600"
                  title="Copy to clipboard"
                >
                  <Copy size={20} />
                </button>
                {isTextToMorse && (
                  <button
                    onClick={playMorseCode}
                    className="text-gray-500 hover:text-indigo-600"
                    title="Play Morse code"
                  >
                    <Volume2 size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">How to Use the Morse Code Translator</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <MessageSquare className="text-indigo-600 mb-4" size={24} />
              <h3 className="font-semibold text-lg mb-2">Enter Your Text</h3>
              <p className="text-gray-600">Type or paste your text in the top box. The translator will automatically convert it to Morse code.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <ArrowDownUp className="text-indigo-600 mb-4" size={24} />
              <h3 className="font-semibold text-lg mb-2">Switch Direction</h3>
              <p className="text-gray-600">Click the arrow button to switch between text-to-Morse and Morse-to-text translation.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Volume2 className="text-indigo-600 mb-4" size={24} />
              <h3 className="font-semibold text-lg mb-2">Listen to Morse</h3>
              <p className="text-gray-600">Use the speaker icon to hear your Morse code played as audio signals.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "What is Morse code?",
                a: "Morse code is a method of encoding text characters using sequences of dots and dashes, or short and long signals. It was developed by Samuel Morse and Alfred Vail in the 1830s."
              },
              {
                q: "How do I read Morse code?",
                a: "In Morse code, each letter is represented by a unique combination of dots (.) and dashes (-). A dot represents a short signal, while a dash represents a long signal."
              },
              {
                q: "Why is Morse code still relevant today?",
                a: "While no longer the primary means of communication, Morse code remains important in emergency situations, aviation, and amateur radio. It's also a fascinating way to learn about the history of communication."
              },
              {
                q: "Can I use this translator for learning Morse code?",
                a: "Yes! This translator is an excellent tool for learning Morse code. Use the audio feature to familiarize yourself with the sounds and practice both encoding and decoding messages."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <HelpCircle className="text-indigo-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center text-gray-600">
          <p>Use this translator responsibly and have fun exploring the world of Morse code!</p>
        </footer>
      </div>
    </div>
  );
}

export default App;