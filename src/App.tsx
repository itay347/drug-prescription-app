import { Box, List, ListItemButton, ListItemText, TextField } from "@mui/material";
import axios, { CanceledError } from "axios";
import { useEffect, useRef, useState } from "react";
import "./App.css";

type Drug = {
  code: number;
  name: string;
}

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
          let response = await axios.get(
            "https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search",
            {
              params: { terms: searchText, ef: "RXCUIS" },
              signal: controller.signal
            }
          );
          const data = response.data;
          // NOTE: for the sake of this exercise I'm assuming there is only one 'strength' and taking the first code from RXCUIS
          const drugs: Drug[] = data[1].map(
            (name: string, index: number) =>
              ({ code: data[2]["RXCUIS"][index][0], name: name } as Drug)
          );
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
