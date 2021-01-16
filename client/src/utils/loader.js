import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));
export default function CircularUnderLoad() {
  const { root } = useStyles();
  return (
    <section className={root}>
      <CircularProgress disableShrink />
    </section>
  );
}
