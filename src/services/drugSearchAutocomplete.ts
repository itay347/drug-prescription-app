import axios from "axios";
import { Drug } from "../types";

export const searchDrugs = async (searchText: string, signal: AbortSignal): Promise<Drug[]> => {
  let response = await axios.get(
    "https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search",
    {
      params: { terms: searchText, ef: "RXCUIS" },
      signal: signal
    }
  );
  const data = response.data;
  // NOTE: for the sake of this exercise I'm assuming there is only one 'strength' and taking the first code from RXCUIS
  const drugs: Drug[] = data[1].map(
    (name: string, index: number) =>
      ({ code: data[2]["RXCUIS"][index][0], name: name } as Drug)
  );
  return drugs;
}
