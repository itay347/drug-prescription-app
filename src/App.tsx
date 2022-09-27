import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    if (searchText && searchText.length > 0) {
      console.log({searchText});
    }
  }, [searchText]);

  return (
    <div className="App">
      <Box sx={{ width: "50%" }}>
        <h1>Drug Prescription App</h1>
        <TextField
          id="search-drug"
          label="Search Drug"
          variant="outlined"
          fullWidth
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      </Box>
    </div>
  );
}

export default App;
