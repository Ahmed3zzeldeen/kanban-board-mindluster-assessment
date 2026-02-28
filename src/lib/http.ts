import axios from "axios";

export const http = axios.create({
  baseURL: "https://kanban-board-mindluster-assessment-kappa.vercel.app",
});