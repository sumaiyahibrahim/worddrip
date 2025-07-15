## 🔗 Live Project Links
 
- 🌐 **Frontend UI**: [https://sumaiyahibrahim.github.io/worddrip/](https://sumaiyahibrahim.github.io/worddrip/)
- 🧪 **API Endpoint**: [https://worddrip.onrender.com](https://worddrip.onrender.com) 
- 📦 **npm Package**: [`worddrip-api`](https://www.npmjs.com/package/worddrip-api)

---
  
## 🌐 Live API  
   
**Base URL:** [`https://worddrip.onrender.com`](https://worddrip.onrender.com) 
 
### ✨ Endpoints   

| Method | Route                   | Description                              | 
|--------|-------------------------|------------------------------------------| 
| GET    | `/`                     | Returns a random valid word with meaning |
| GET    | `/?word=example`        | Returns details of the specific word     |
| GET    | `/health`               | Health check (status: ok)                |

#### ✅ Example Response

```json
{
  "word": "serendipity",
  "pronunciation": "/ˌserənˈdipədē/",
  "partOfSpeech": "noun",
  "definition": "The occurrence of events by chance in a happy or beneficial way.",
  "example": "A fortunate stroke of serendipity.",
  "synonyms": ["fluke", "chance", "coincidence"]
}
```
## 📦 npm Package
#### You can also use WordDrip directly in your Node.js apps via our npm package.


## 🔧 Installation

```bash
npm install worddrip-api
```
```js
const fetch = require("node-fetch");

async function getWord() {
  const response = await fetch("https://worddrip.onrender.com/");
  const data = await response.json();

  console.log("Word:", data.word);
  console.log("Definition:", data.definition);
}

getWord();
```
---
# ⚙️ Tech Stack

- **Backend:** Node.js + Express
- **Public APIs:** 
  - [dictionaryapi.dev](https://dictionaryapi.dev)
  - [random-word-api](https://random-word-api.herokuapp.com/)
- **Features:** 
  - CORS-enabled for frontend use
  - Deployed on **Render**

---

# 💡 Use Cases

- 🧠 **Learn a new word daily** — perfect for habit-forming “streak” projects
- 📚 **Build vocabulary games** — quiz, match, or word puzzles
- 📝 **Integrate into blogs or writing assistants** — auto-suggest new words
- 📊 **Use in dashboards or widgets** — surface dynamic word content or trivia

---

# 🛠 Info

- **Author:** Sumaiyah Ibrahim  
- **License:** ISC

---

# ❤ Support & Contributions

Found a bug or want to contribute?  
Feel free to open an issue or submit a pull request — **contributions are always welcome!**
