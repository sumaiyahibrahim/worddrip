const express = require("express");
const cors = require("cors");
const app = express();
const fetch = require("node-fetch");
const PORT = process.env.PORT || 3000;

const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en";
const RANDOM_WORD_API = "https://random-word-api.herokuapp.com/word";

app.use(cors()); // Enable CORS so frontend can access this API

// Format Dictionary API response
function formatResponse(data) {
    if (!Array.isArray(data) || !data[0]) {
        return {
            word: "N/A",
            pronunciation: "N/A",
            partOfSpeech: "N/A",
            definition: "N/A",
            example: "N/A",
            synonyms: []
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
        synonyms: definitionBlock?.synonyms || []
    };
}

// Valid random word with definition
async function getValidRandomWord(retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            const wordResponse = await fetch(RANDOM_WORD_API);
            const [randomWord] = await wordResponse.json();

            const defResponse = await fetch(`${DICTIONARY_API}/${randomWord}`);
            const data = await defResponse.json();

            if (!data.title) {
                return formatResponse(data);
            } else {
                console.warn(`❌ No definition found for: ${randomWord} | API response: ${JSON.stringify(data)}`);
            }
        } catch (err) {
            console.error(`⚠️ Error during random word fetch (attempt ${i + 1}):`, err.message);
        }
    }

    throw new Error("Unable to find a valid random word after multiple attempts.");
}

// Main GET Route
app.get("/", async (req, res) => {
    const wordQuery = req.query.word;

    try {
        if (wordQuery) {
            // If user provided ?word=someword
            const response = await fetch(`${DICTIONARY_API}/${wordQuery}`);
            const data = await response.json();

            if (data.title === "No Definitions Found") {
                return res.status(404).json({ error: `No definition found for '${wordQuery}'` });
            }

            const result = formatResponse(data);
            return res.json(result);
        }

        // Get a random valid word
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
