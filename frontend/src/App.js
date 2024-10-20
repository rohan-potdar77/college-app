import React, { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";

const App = () => {
  const [authentication, setAuthentication] = useState(false);

  useEffect(() => {
    setAuthentication(sessionStorage.getItem("token") !== null);
  }, []);

  if (!authentication) {
    return <LoginPage setAuthentication={setAuthentication} />;
  }

  return (
    <>
      <Dashboard setAuthentication={setAuthentication} />
    </>
  );
};

export default App;
