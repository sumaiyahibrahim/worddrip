const express = require("express");
const app = express();
const PORT = 3000;

// fetch by default
const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en";
const RANDOM_WORD_API = "https://random-word-api.herokuapp.com/word";

//Format Dictionary API response
function formatResponse(data) {
  const entry = data[0];
  const meaningBlock = entry.meanings?.[0];
  const definitionBlock = meaningBlock?.definitions?.[0];

  return {
    word: entry.word || "N/A",
    pronunciation: entry.phonetics?.[0]?.text || "N/A",
    partOfSpeech: meaningBlock?.partOfSpeech || "N/A",
    definition: definitionBlock?.definition || "N/A",
    example: definitionBlock?.example || "N/A",
    synonyms: definitionBlock?.synonyms || []
  };
}

//valid random word with definition
async function getValidRandomWord(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const wordResponse = await fetch(RANDOM_WORD_API);
      const [randomWord] = await wordResponse.json();

      const defResponse = await fetch(`${DICTIONARY_API}/${randomWord}`);
      const data = await defResponse.json();

      if (!data.title) {
        return formatResponse(data);
      }
    } catch (err) {
      // just retry
    }
  }

  throw new Error("Unable to find a valid random word after multiple attempts.");
}

// Main GET Route
app.get("/", async (req, res) => {
  const wordQuery = req.query.word;

  try {
    if (wordQuery) {
      //If user provided ?word=
      const response = await fetch(`${DICTIONARY_API}/${wordQuery}`);
      const data = await response.json();

      if (data.title === "No Definitions Found") {
        return res.status(404).json({ error: `No definition found for '${wordQuery}'` });
      }

      const result = formatResponse(data);
      return res.json(result);
    }

    //get a  random valid word
    const result = await getValidRandomWord();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`WordDrip API running at http://localhost:${PORT}`);
});
