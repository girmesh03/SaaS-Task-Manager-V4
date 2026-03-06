import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "taskmanager-root",
  storage,
  whitelist: ["preferences", "ui"],
};

export default persistConfig;
