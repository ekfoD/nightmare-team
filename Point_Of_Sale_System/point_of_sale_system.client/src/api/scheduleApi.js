import axios from "axios";

const API = "http://localhost:56689/api/schedule";

// GET schedules for a specific date
export async function getSchedulesByDate(date) {
  return axios.get(`${API}/${date}`).then(res => res.data);
}

// GET summary for calendar highlighting
export async function getDateSummary() {
  return axios.get(`${API}/datesummary`).then(res => res.data);
}
