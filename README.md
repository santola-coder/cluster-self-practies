## 🗂️ Project Structure

```
 express-crud-app/
├── data/
│   └── items.json        ← local file storage
├── routes/
│   └── items.js          ← CRUD routes
├── server.js             ← main entry
├── package.json

```

## How it work in internal flow:

```
External API (jsonplaceholder)
        ↓  POST /fetch
   axios.get(url)
        ↓
   items.json  ←→  CRUD routes (GET / POST / PUT / DELETE)
        ↓
   JSON response to client
