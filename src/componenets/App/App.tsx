import { Box, Button, List, ListItemButton, ListItemText, TextField } from "@mui/material";
import { CanceledError } from "axios";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { searchDrugs } from "../../services/drugSearchAutocomplete";
import { Drug } from "../../types";
import "./App.css";

type PrescriptionTableRow = {
  drug: Drug;
  date: Date;
}

function App() {
  const [searchText, setSearchText] = useState<string>("");
  const [drugSearchResults, setDrugSearchResults] = useState<Drug[]>([]);
  const [selectedDrugCode, setSelectedDrugCode] = useState<number>();
  const [prescriptionTableRows, setPrescriptionTableRows] = useState<PrescriptionTableRow[]>([]);

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

  useEffect(() => {
    setSelectedDrugCode(undefined);
  }, [drugSearchResults]);

  const handleSearchListItemClick = (event: MouseEvent, drugCode: number) => {
    setSelectedDrugCode(drugCode);
  }

  const handleAddDrugClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const drug = drugSearchResults.find((drug) => drug.code === selectedDrugCode);
    if (drug) {
      // TODO: figure out what to do when the drug is already in the list. (need to avoid duplicate keys)
      setPrescriptionTableRows([...prescriptionTableRows, {drug: drug, date: new Date()}]);
    } else {
      window.alert("No drug selected. Please search for a drug and select one from the list.");
    }
  }

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
            return (
              <ListItemButton
                key={drug.code}
                selected={selectedDrugCode === drug.code}
                onClick={(event) => handleSearchListItemClick(event, drug.code)}
              >
                <ListItemText primary={drug.name} />
              </ListItemButton>
            );
          })}
        </List>
        <Button
          variant="contained"
          disabled={selectedDrugCode === undefined}
          onClick={handleAddDrugClick}
        >
          Add Drug
        </Button>
        {/* TODO: Change list to table with an editable 'date' field and a 'remove' button */}
        <List
          sx={{
            overflow: "auto",
            height: "25vh",
          }}
        >
          {prescriptionTableRows.map((row) => {
            return (
              <ListItemButton key={row.drug.code}>
                <ListItemText
                  primary={row.drug.name.substring(
                    0,
                    row.drug.name.indexOf("(") - 1
                  )}
                  secondary={row.drug.name.substring(
                    row.drug.name.indexOf("(")
                  )}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </div>
  );
}

export default App;
