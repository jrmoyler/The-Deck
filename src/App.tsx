import { Navigate, Route, Routes } from "react-router-dom";
import { CoachPage } from "./pages/Coach";
import { HomePage } from "./pages/Home";
import { LogPage } from "./pages/Log";
import { WorkoutPage } from "./pages/Workout";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/workout" element={<WorkoutPage />} />
      <Route path="/log" element={<LogPage />} />
      <Route path="/coach" element={<CoachPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
