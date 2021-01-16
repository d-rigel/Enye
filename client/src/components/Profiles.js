import React from "react";
import Filter from "./Filter";
import Table from "./Table";
import { ProfilesContext } from "../context";
import CircularUnderLoad from "../utils/loader.js";
import { fetchProfiles } from "../context";

export default function Profiles() {
  const { state, dispatch } = React.useContext(ProfilesContext);
  const { loading } = state;

  React.useEffect(() => {
    fetchProfiles(dispatch);
  }, []);

  return (
    <div>
      {loading ? (
        <CircularUnderLoad />
      ) : (
        <>
          <Filter />
          <Table />
        </>
      )}
    </div>
  );
}
