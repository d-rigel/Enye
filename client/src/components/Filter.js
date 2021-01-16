import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import { ProfilesContext, performFilter, fetchProfiles } from "../context";
import useDebounce from "../utils/debounce";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
      [theme.breakpoints.down("sm")]: {
        marginBottom: theme.spacing(1),
      },
      width: "25ch",
      justifyContent: "center",
    },
  },
}));

export default function Filter() {
  const classes = useStyles();
  const [gender, setGender] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const { dispatch, state } = React.useContext(ProfilesContext);
  const { genders, paymentMethods, backup } = state;

  const handleGenderFilter = (e) => {
    setGender(e.target.value);
    if (e.target.value === "all") {
      return fetchProfiles(dispatch);
    }

    const data = backup.filter((profile) => profile.Gender === e.target.value);
    performFilter(dispatch, data);

    setGender("");
  };

  const handlePaymentMethodFilter = (e) => {
    setPaymentMethod(e.target.value);
    if (e.target.value === "all") {
      return fetchProfiles(dispatch);
    }

    const data = backup.filter(
      (profile) => profile.PaymentMethod === e.target.value
    );

    performFilter(dispatch, data);
    setPaymentMethod("");
  };

  //performs search after 5ms of receiving the search term
  const debounceValue = useDebounce(searchTerm, 500);

  React.useEffect(() => {
    search();
  }, [debounceValue]);

  const search = () => {
    if (debounceValue === "") {
      return fetchProfiles(dispatch);
    }

    const data = backup?.filter((profile) => {
      return Object.keys(profile).some((key) => {
        return (
          profile[key]
            .toString()
            .toLowerCase()
            .indexOf(debounceValue.toLowerCase()) !== -1
        );
      });
    });

    performFilter(dispatch, data);
  };

  return (
    <Grid container spacing={1} className={classes.root}>
      <Grid item lg={4} md={3} sm={12} xs={12}>
        <TextField
          onChange={(e) => setSearchTerm(e.target.value)}
          label="search"
          placeholder="Search profiles"
          id="search"
          autoComplete="off"
          value={searchTerm}
          size="small"
        />
      </Grid>

      <Grid item lg={3} md={3} sm={12} xs={12}>
        <TextField
          id="standard-select-gender"
          select
          label="Gender"
          value={gender}
          onChange={handleGenderFilter}
          helperText="Please select gender"
        >
          <MenuItem key="all" value="all">
            All
          </MenuItem>
          {genders.map((gender) => (
            <MenuItem key={gender} value={gender}>
              {gender}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item lg={3} md={3} sm={12} xs={12}>
        <TextField
          id="standard-select-payment-method"
          select
          label="Payment Method"
          value={paymentMethod}
          onChange={handlePaymentMethodFilter}
          helperText="Please select payment method"
        >
          <MenuItem key="all" value="all">
            All
          </MenuItem>
          {paymentMethods.map((method) => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
}
