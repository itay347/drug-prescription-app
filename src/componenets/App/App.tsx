import { Box, List, ListItemButton, ListItemText, TextField } from "@mui/material";
import { CanceledError } from "axios";
import { useEffect, useRef, useState } from "react";
import { searchDrugs } from "../../services/drugSearchAutocomplete";
import { Drug } from "../../types";
import "./App.css";


function App() {
  const [searchText, setSearchText] = useState<string>("");
  const [drugSearchResults, setDrugSearchResults] = useState<Drug[]>([]);

  const abortControllerRef = useRef<AbortController>();

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!(searchText && searchText.length > 0)) {
      setDrugSearchResults([]);
    } else {
      (async () => {
        try {
          const controller = new AbortController();
          abortControllerRef.current = controller;
          let drugs = await searchDrugs(searchText, controller.signal);
          setDrugSearchResults(drugs);
        } catch (e) {
          if (e instanceof CanceledError) {
            // Ignore
          } else {
            console.error(e);
            window.alert("Oops! Something went wrong...");
          }
        }
      })();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
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
          autoFocus
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <List
          sx={{
            overflow: "auto",
            height: "25vh",
          }}
        >
          {drugSearchResults.map((drug) => {
            // TODO: allow selection for adding drugs
            return (
              <ListItemButton key={drug.code}>
                <ListItemText primary={drug.name} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </div>
  );
}

export default App;
