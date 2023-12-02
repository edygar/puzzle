import { createStore } from "solid-js/store";
import { Setup } from "./components/Setup";
import { Navigate, Route, Routes, useNavigate } from "@solidjs/router";
import { Game } from "./components/Game";

export function App() {
  const navigate = useNavigate();
  const [state, setState] = createStore<{
    file: File | null;
    difficulty: number;
  }>({
    file: null,
    difficulty: 3,
  });

  return (
    <Routes>
      <Route
        path="/puzzle/setup"
        component={() => (
          <Setup
            initialSetup={state}
            onSubmit={(data) => {
              setState(Object.fromEntries(data.entries()));
              navigate("/puzzle/game");
            }}
          />
        )}
      />
      {state.file && (
        <Route
          path="/puzzle/game"
          component={() => (
            <Game
              tiles={state.difficulty ** 2}
              image={URL.createObjectURL(state.file!)}
              onReset={() => {
                navigate("/puzzle/setup");
              }}
            />
          )}
        />
      )}
      <Navigate href="/puzzle/setup" />
    </Routes>
  );
}
