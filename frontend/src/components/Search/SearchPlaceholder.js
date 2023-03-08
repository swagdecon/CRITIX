import { useState, useEffect } from "react";

const Resolver = ({ options }) => {
  const [partialString, setPartialString] = useState("");
  const [offset, setOffset] = useState(0);
  const [iterations, setIterations] = useState(options.iterations);

  useEffect(() => {
    const characters = options.characters;
    const timeout = options.timeout;

    function getRandomInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomCharacter(characters) {
      return characters[getRandomInteger(0, characters.length - 1)];
    }

    function doRandomiserEffect() {
      setTimeout(() => {
        if (iterations >= 0) {
          setIterations(iterations - 1);

          // Ensures partialString without the random character as the final state.
          if (iterations === 0) {
            setPartialString(options.partialString);
          } else {
            // Replaces the last character of partialString with a random character
            setPartialString(
              (prevPartialString) =>
                prevPartialString.substring(0, prevPartialString.length - 1) +
                randomCharacter(characters)
            );
          }

          doRandomiserEffect();
        }
      }, timeout);
    }

    function doResolverEffect() {
      const resolveString = options.resolveString;
      const combinedOptions = { ...options, partialString };

      doRandomiserEffect();

      if (offset <= resolveString.length) {
        setOffset(offset + 1);
        setPartialString(resolveString.substring(0, offset));
      } else if (typeof options.callback === "function") {
        options.callback();
      }
    }

    doResolverEffect();
  }, [options]);

  return <span data-target-resolver>{partialString}</span>;
};

const strings = [
  "Popflix is an application that enables users to discover their next favorite films with a focus on providing a platform for reviewing them.",
  "With Popflix, users can explore a world of cinema and find their new obsession, while also having the ability to share their thoughts and opinions on their experiences.",
  "Popflix is the perfect companion for movie enthusiasts and casual viewers alike, providing a platform for discovering and rating the best films out there.",
  "As an application, Popflix serves as more than just a tool, it is a movie-lover's best friend, guiding them towards their next great film and giving them the opportunity to connect with others who share their passion.",
  "Popflix is a personal movie matchmaker, helping users to find their perfect film match and allowing them to share their thoughts with a community of like-minded movie enthusiasts.",
];

let counter = 0;

const options = {
  // Initial position
  offset: 0,
  // Timeout between each random character
  timeout: 5,
  // Number of random characters to show
  iterations: 10,
  // Random characters to pick from
  characters: [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "x",
    "y",
    "x",
    "#",
    "%",
    "&",
    "-",
    "+",
    "_",
    "?",
    "/",
    "\\",
    "=",
  ],
  // String to resolve
  resolveString: strings[counter],
  // Callback function when resolve completes
  callback: () => {
    setTimeout(() => {
      counter++;

      if (counter >= strings.length) {
        counter = 0;
      }

      options.resolveString = strings[counter];
      Resolver.resolve(options, options.callback);
    }, 2000);
  },
};
Resolver.resolve(options, callback);

export default Resolver;
