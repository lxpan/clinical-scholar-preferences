import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { getExpectedPassphrase } from "./passphrase";

const STORAGE_KEY = "cs-ballarat-unlock";

type Props = { children: ReactNode };

export function PassphraseGate({ children }: Props) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (input === getExpectedPassphrase()) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
      setError("");
      setInput("");
    } else {
      setError("Incorrect passphrase. Check with your Ballarat cohort.");
    }
  }

  if (unlocked === null) {
    return null;
  }

  if (!unlocked) {
    return (
      <div className="gate">
        <div className="gate-card">
          <h1>Clinical Scholar Placements 2027</h1>
          <p className="gate-lead">
            This tool is for Ballarat Clinical Scholar students only. Enter the passphrase
            shared with your cohort.
          </p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="passphrase">Passphrase</label>
            <input
              id="passphrase"
              type="password"
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            {error ? (
              <p className="gate-error" role="alert">
                {error}
              </p>
            ) : null}
            <button type="submit" className="gate-submit">
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
