import { createStore } from "solid-js/store";
import { Setup } from "./components/Setup";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useBeforeLeave,
} from "@solidjs/router";
import { RotateGame } from "./components/RotateGame";
import { GameSetup } from "./types";
import { SlideGame } from "./components/SlideGame";

export function App() {
  useBeforeLeave((e) => {
    if (document.startViewTransition) {
      e.preventDefault();
      document.startViewTransition(() => {
        e.retry(true);
      });
    }
  });
  const navigate = useNavigate();

  const [state, setState] = createStore<GameSetup>({
    mode: "rotate",
    file: null,
    level: 3,
  });

  return (
    <Routes>
      <Route
        path="/setup"
        component={() => (
          <Setup
            initialSetup={state}
            onSubmit={(data) => {
              setState(data);
              navigate(`/${data.mode}`);
            }}
          />
        )}
      />
      {state.file && (
        <>
          <Route
            path="/rotate"
            component={() => (
              <RotateGame
                tiles={state.level ** 2}
                image={URL.createObjectURL(state.file!)}
                onReset={() => {
                  navigate("/setup");
                }}
              />
            )}
          />

          <Route
            path="/slide"
            component={() => {
              return (
                <SlideGame
                  tiles={state.level ** 2}
                  image={URL.createObjectURL(state.file!)}
                  onReset={() => {
                    navigate("/setup");
                  }}
                />
              );
            }}
          />
        </>
      )}
      <Navigate href="/setup" />
    </Routes>
  );
}
