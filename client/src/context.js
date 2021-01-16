import React from "react";
import axios from "axios";

const initialState = {
  profiles: [],
  backup: [],
  profile: {},
  loading: true,
  genders: [],
  paymentMethods: [],
  error: "",
  open: false,
};
const ProfilesContext = React.createContext(initialState);

const options = {
  loadProgress: (progressEvent) => {
    const { loaded, total } = progressEvent;
    let percent = Math.floor((loaded * 100) / total);
    return console.log(percent);
  },
};

//action creators
const fetchProfiles = async (dispatch) => {
  try {
    const response = await axios.get(
      "https://api.enye.tech/v1/challenge/records",
      options
    );

    if (response.data) {
      const { profiles } = response.data.records;
      let gender = await profiles.map((profile) => profile.Gender);
      let paymentMethod = await profiles.map(
        (profile) => profile.PaymentMethod
      );

      gender = [...new Set(gender)];
      paymentMethod = [...new Set(paymentMethod)];

      dispatch({
        type: "FETCH_PROFILES",
        payload: profiles,
      });

      dispatch({
        type: "GET_FILTER_PARAMS",
        payload: { gender, paymentMethod },
      });
    }
  } catch (error) {
    return dispatch({
      type: "FETCH_FAILED",
      payload: error.response?.data.error,
    });
  }
};

const getProfileDetails = async (dispatch, profile) => {
  dispatch({
    type: "PROFILE_DETAILS",
    payload: profile,
  });

  return dispatch({
    type: "OPEN_MODAL",
  });
};

const performFilter = async (dispatch, data) => {
  dispatch({
    type: "FILTER",
    payload: data,
  });
};

const closeModal = async (dispatch) => {
  dispatch({
    type: "CLOSE_MODAL",
  });
};

//reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PROFILES":
      return {
        ...state,
        loading: false,
        error: {},
        backup: action.payload,
        profiles: action.payload,
      };
    case "PROFILE_DETAILS":
      return {
        ...state,
        loading: false,
        error: {},
        profile: action.payload,
      };
    case "OPEN_MODAL":
      return {
        ...state,
        open: true,
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        open: false,
        profile: {},
      };
    case "GET_FILTER_PARAMS":
      return {
        ...state,
        genders: action.payload.gender,
        paymentMethods: action.payload.paymentMethod,
      };
    case "FILTER":
      return {
        ...state,
        profiles: action.payload,
      };
    case "FETCH_FAILED":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProfilesProvider = (props) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <ProfilesContext.Provider value={{ state, dispatch }}>
      {props.children}
    </ProfilesContext.Provider>
  );
};

export {
  ProfilesContext,
  ProfilesProvider,
  fetchProfiles,
  getProfileDetails,
  closeModal,
  performFilter,
};
