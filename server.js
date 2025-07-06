const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// Native fetch 
const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en";
const RANDOM_WORD_API = "https://random-word-api.herokuapp.com/word";

app.use(cors());

// 📦 Format Dictionary API response
function formatResponse(data) {
  if (!Array.isArray(data) || !data[0]) {
    return {
      word: "N/A",
      pronunciation: "N/A",
      partOfSpeech: "N/A",
      definition: "N/A",
      example: "N/A",
      synonyms: [],
    };
  }

  const entry = data[0];
  const meaningBlock = entry.meanings?.[0];
  const definitionBlock = meaningBlock?.definitions?.[0];

  return {
    word: entry.word || "N/A",
    pronunciation: entry.phonetics?.[0]?.text || "N/A",
    partOfSpeech: meaningBlock?.partOfSpeech || "N/A",
    definition: definitionBlock?.definition || "N/A",
    example: definitionBlock?.example || "N/A",
    synonyms: definitionBlock?.synonyms || [],
  };
}

// 🔀 Valid random word with meaning
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
      console.error(`Retry ${i + 1} failed:`, err.message);
    }
  }
  throw new Error("Failed to get valid word after retries.");
}

// 🩺 Health check
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// 🌐 Main API
app.get("/", async (req, res) => {
  const wordQuery = req.query.word;
  try {
    if (wordQuery) {
      const response = await fetch(`${DICTIONARY_API}/${wordQuery}`);
      const data = await response.json();

      if (data.title === "No Definitions Found") {
        return res.status(404).json({ error: `No definition found for '${wordQuery}'` });
      }

      return res.json(formatResponse(data));
    }

    // Otherwise, get a random word
    const result = await getValidRandomWord();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`WordDrip API running on http://localhost:${PORT}`);
});
