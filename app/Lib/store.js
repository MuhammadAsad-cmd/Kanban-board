import storage from "redux-persist/lib/storage";
import { ProjectReducer } from "./slices/TaskSlices";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
const { configureStore } = require("@reduxjs/toolkit");


// Persist configuration
const persistConfig = {
    key: "root",
    storage,
  };

  // Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, ProjectReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
    reducer: {
      projects: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  
  export const persistor = persistStore(store);