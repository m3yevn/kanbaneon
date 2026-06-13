import { v4 as uuid } from "uuid";

export const ISSUE_TYPES = [
  { value: "story", label: "Story", color: "#4caf50" },
  { value: "task", label: "Task", color: "#2196f3" },
  { value: "bug", label: "Bug", color: "#f44336" },
  { value: "epic", label: "Epic", color: "#9c27b0" },
];

export const PRIORITIES = [
  { value: "highest", label: "Highest" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "lowest", label: "Lowest" },
];

export const getJiraDefaultLists = () => [
  { id: uuid(), name: "Backlog", children: [] },
  { id: uuid(), name: "To Do", children: [] },
  { id: uuid(), name: "In Progress", children: [] },
  { id: uuid(), name: "In Review", children: [] },
  { id: uuid(), name: "Done", children: [] },
];

export const formatIssueLabel = (card) => {
  if (card?.issueKey) {
    return `${card.issueKey} · ${card.title || ""}`;
  }
  return card?.title || "";
};

export const priorityColor = (priority) => {
  const map = {
    highest: "#d32f2f",
    high: "#f57c00",
    medium: "#fbc02d",
    low: "#388e3c",
    lowest: "#757575",
  };
  return map[priority] || map.medium;
};
