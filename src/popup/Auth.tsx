import * as React from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import github from "~github";

interface Props {
  onToken: (token: string) => void;
}

const Auth = (props: Props) => {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [token]);

  const login = () => {
    github.setToken(token);
    github
      .getNotifications()
      .then(r => props.onToken(token))
      .catch(e => {
        if (e.response.status === 401) setError("Token not valid");
        else setError("Could not request");
      });
  };

  return (
    <div class={"auth"}>
      <h1>Personal Access Token</h1>
      <input
        value={token}
        onChange={e => setToken(e.target.value)}
        class={!!error ? "has-error" : ""}
      />
      {!!error && <div class={"error"}>{error}</div>}
      <button onClick={login}>Login</button>
    </div>
  );
};

interface Props {}

export default Auth;
