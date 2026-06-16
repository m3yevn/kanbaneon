const apiUrl = import.meta.env.VITE_KANBANEON_API_URL;
import { message } from "ant-design-vue";

const token = () => localStorage.getItem("token");

export async function login(username, password) {
  try {
    const response = await post("/login", { username, password });
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function deleteProfilePicture() {
  try {
    const response = await del("/profile/picture", token());
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function uploadProfilePicture(formData) {
  try {
    const response = await post("/profile/picture", formData, token());
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function signUp(username, email, password) {
  try {
    const response = await post("/signup", { username, email, password });
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function reauth(token) {
  try {
    const response = await post("/reauth", { token });
    if (response.success) {
      return response;
    }
  } catch (ex) {
    console.info(ex.message);
  }
}

export async function deleteUser({ username, password }) {
  try {
    const response = await post(
      `/users/${username}/delete`,
      { password },
      token()
    );
    if (response.success) {
      message.success("Account is successfully deleted.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function sendRecoveryEmail(payload) {
  try {
    const response = await post("/recovery", payload);
    if (response.success) {
      message.success("Recovery email is successfully sent.");
      return response;
    }
  } catch (ex) {
    console.info(ex.message);
  }
}

export async function editUsername(payload) {
  try {
    const response = await put(`/profile/username`, payload);
    if (response.success) {
      message.success("Username is successfully updated.");
      return response;
    }
  } catch (ex) {
    console.info(ex.message);
  }
}

export async function editPassword(payload) {
  try {
    const passwordResetUrl = payload.inApp
      ? `/recovery/in-app/password`
      : `/recovery/password`;
    const response = await post(
      passwordResetUrl,
      payload,
      payload.inApp ? token() : ""
    );
    if (response.success) {
      message.success("Password is successfully updated.");
      return response;
    }
  } catch (ex) {
    console.info(ex.message);
  }
}

export async function validateToken(token) {
  try {
    const response = await post(`/recovery/${token}`);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    console.info(ex.message);
  }
}

export async function getProfile() {
  try {
    const response = await get(`/profile`);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getProfiles(ids) {
  try {
    const response = await get(`/profiles?ids=${ids}`, token());
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function searchProfiles(searchText) {
  try {
    const response = await get(`/profiles/${searchText}`, token());
    if (response.success) {
      return response;
    }
  } catch (ex) {
    //message.error(ex.message);
  }
}

export async function editProfile(profile) {
  try {
    const response = await put(`/profile`, profile);
    if (response.success) {
      message.success("Profile is successfully saved.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getNotification() {
  try {
    const response = await get(`/notification`, token());
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function editNotification(notification) {
  try {
    const response = await put(`/notification`, notification, token());
    if (response.success) {
      message.success("Notification settings are successfully saved.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getBoard(id) {
  try {
    const response = await get(`/boards/${id}`);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getBoards() {
  try {
    const response = await get("/boards");
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function addBoard(board) {
  try {
    const response = await post("/boards", { ...board }, token());
    if (response.success) {
      message.success("Board is successfully added.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getTeamBoards(teamId) {
  try {
    const response = await get(`/teams/${teamId}/boards`);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function addTeamBoard(teamId, board) {
  try {
    const response = await post(`/teams/${teamId}/boards`, { ...board }, token());
    if (response.success) {
      message.success("Team board is successfully added.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function addList(boardId, list) {
  try {
    const response = await post(
      `/boards/${boardId}/lists`,
      { ...list },
      token()
    );
    if (response.success) {
      message.success("List is successfully added.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function addCard(boardId, listId, card) {
  try {
    const response = await post(
      `/boards/${boardId}/lists/${listId}/cards`,
      { ...card },
      token()
    );
    if (response.success) {
      message.success("Card is successfully added.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function editBoard(boardId, board) {
  try {
    const response = await put(`/boards/${boardId}`, { ...board }, token());
    if (response.success) {
      message.success("Board is successfully updated.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function editList(boardId, list) {
  try {
    const response = await put(
      `/boards/${boardId}/lists/${list.listId}`,
      { ...list },
      token()
    );
    if (response.success) {
      message.success("List is successfully updated.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function editCard(boardId, { listId, ...card }) {
  try {
    const response = await put(
      `/boards/${boardId}/lists/${listId}/cards/${card.id}`,
      { ...card },
      token()
    );
    if (response.success) {
      message.success("Card is successfully updated.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function deleteBoard(boardId) {
  try {
    const response = await del(`/boards/${boardId}`, token());
    if (response.success) {
      message.success("Board is successfully deleted.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function deleteList(boardId, list) {
  try {
    const response = await del(
      `/boards/${boardId}/lists/${list.listId}`,
      token()
    );
    if (response.success) {
      message.success("List is successfully deleted.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function deleteCard(boardId, { listId, id }) {
  try {
    const response = await del(
      `/boards/${boardId}/lists/${listId}/cards/${id}`,
      token()
    );
    if (response.success) {
      message.success("Card is successfully deleted.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function swapList(boardId, from, to) {
  try {
    const response = await post(
      `/boards/${boardId}/swap-lists?from=${from}&to=${to}`,
      {},
      token()
    );
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function swapCardExternal(boardId, parentList, foundList) {
  try {
    const response = await post(
      `/boards/${boardId}/swap-cards-external`,
      { parentList, foundList },
      token()
    );
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function swapCardInternal(boardId, listId, from, to) {
  try {
    const response = await post(
      `/boards/${boardId}/swap-cards-internal/${listId}?from=${from}&to=${to}`,
      {},
      token()
    );
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getTeams() {
  try {
    const response = await get("/teams");
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getTeam(teamId) {
  try {
    const response = await get(`/teams/${teamId}`);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function addTeam(team) {
  try {
    const response = await post("/teams", { ...team }, token());
    if (response.success) {
      message.success("Team is successfully created.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function editTeam(teamId, team) {
  try {
    const response = await put(`/teams/${teamId}`, { ...team });
    if (response.success) {
      message.success("Team is successfully updated.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function deleteTeam(teamId) {
  try {
    const response = await del(`/teams/${teamId}`);
    if (response.success) {
      message.success("Team is successfully deleted.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function addTeamMember(teamId, member) {
  try {
    const response = await post(`/teams/${teamId}/members`, { ...member }, token());
    if (response.success) {
      message.success("Member is successfully added.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function removeTeamMember(teamId, userId) {
  try {
    const response = await del(`/teams/${teamId}/members/${userId}`);
    if (response.success) {
      message.success("Member is successfully removed.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getOrganizations() {
  try {
    const response = await get("/organizations");
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getOrganization(organizationId) {
  try {
    const response = await get(`/organizations/${organizationId}`);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function addOrganization(organization) {
  try {
    const response = await post("/organizations", { ...organization }, token());
    if (response.success) {
      message.success("Organization is successfully created.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function deleteOrganization(organizationId) {
  try {
    const response = await del(`/organizations/${organizationId}`);
    if (response.success) {
      message.success("Organization is successfully deleted.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getOrganizationTeams(organizationId) {
  try {
    const response = await get(`/organizations/${organizationId}/teams`);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getOrganizationBoards(organizationId) {
  try {
    const response = await get(`/organizations/${organizationId}/boards`);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function addOrganizationBoard(organizationId, board) {
  try {
    const response = await post(
      `/organizations/${organizationId}/boards`,
      { ...board, organizationId },
      token()
    );
    if (response.success) {
      message.success("Project board is successfully created.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function addOrganizationTeam(organizationId, team) {
  try {
    const response = await post(
      `/organizations/${organizationId}/teams`,
      { ...team, organizationId },
      token()
    );
    if (response.success) {
      message.success("Team is successfully created.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getBacklog(boardId) {
  try {
    const response = await get(`/boards/${boardId}/backlog`);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function reorderBacklog(boardId, orderedIds) {
  try {
    const response = await post(
      `/boards/${boardId}/backlog/reorder`,
      { orderedIds },
      token()
    );
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getSprints(boardId) {
  try {
    const response = await get(`/boards/${boardId}/sprints`);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function addSprint(boardId, sprint) {
  try {
    const response = await post(`/boards/${boardId}/sprints`, sprint, token());
    if (response.success) {
      message.success("Sprint created.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function assignIssuesToSprint(boardId, sprintId, issues) {
  try {
    const response = await post(
      `/boards/${boardId}/sprints/${sprintId}/assign`,
      { issues },
      token()
    );
    if (response.success) {
      message.success("Issues added to sprint.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function startSprint(boardId, sprintId) {
  try {
    const response = await post(
      `/boards/${boardId}/sprints/${sprintId}/start`,
      {},
      token()
    );
    if (response.success) {
      message.success("Sprint started.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getSprintIssues(boardId, sprintId) {
  try {
    const response = await get(`/boards/${boardId}/sprints/${sprintId}/issues`);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getIssueComments(boardId, listId, cardId) {
  try {
    const response = await get(
      `/boards/${boardId}/lists/${listId}/cards/${cardId}/comments`
    );
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function addIssueComment(boardId, listId, cardId, text) {
  try {
    const response = await post(
      `/boards/${boardId}/lists/${listId}/cards/${cardId}/comments`,
      { text },
      token()
    );
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getIssueActivity(boardId, listId, cardId) {
  try {
    const response = await get(
      `/boards/${boardId}/lists/${listId}/cards/${cardId}/activity`
    );
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function searchIssues(boardId, filters = {}) {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const qs = params.toString();
    const response = await get(
      `/boards/${boardId}/issues/search${qs ? `?${qs}` : ""}`
    );
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getEpics(boardId) {
  try {
    const response = await get(`/boards/${boardId}/epics`);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function linkIssueToEpic(boardId, listId, cardId, epicId) {
  try {
    const response = await post(
      `/boards/${boardId}/lists/${listId}/cards/${cardId}/epic`,
      { epicId },
      token()
    );
    if (response.success) {
      message.success("Linked to epic.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getEpicChildren(boardId, epicId) {
  try {
    const response = await get(`/boards/${boardId}/epics/${epicId}/children`);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

const get = async (endpoint) => {
  const response = await fetch(apiUrl + endpoint, {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${token()}`,
    }),
  });

  const json = await response.json();
  if (response.status !== 200) {
    throw new Error(json.message)
  }

  return json;
};

const put = async (endpoint, body) => {
  const response = await fetch(apiUrl + endpoint, {
    method: "PUT",
    headers: new Headers({
      Authorization: `Bearer ${token()}`,
    }),
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (response.status !== 200) {
    return message.error(json.message);
  }

  return json;
};

const del = async (endpoint) => {
  const response = await fetch(apiUrl + endpoint, {
    method: "DELETE",
    headers: new Headers({
      Authorization: `Bearer ${token()}`,
    }),
  });

  const json = await response.json();
  if (response.status !== 200) {
    return message.error(json.message);
  }

  return json;
};

const post = async (endpoint, body, token) => {
  try {
    const response = await fetch(apiUrl + endpoint, {
      method: "POST",
      headers: token
        ? new Headers({
            Authorization: `Bearer ${token}`,
          })
        : {},
      body: body instanceof FormData ? body : JSON.stringify(body),
    });

    let json;
    try {
      json = await response.json();
    } catch (jsonErr) {
      // If response is not JSON (e.g., network error), set a default error
      json = { message: "An unknown error occurred." };
    }
    if (response.status !== 200) {
      return { success: false, message: json.message || "Login failed. Please try again." };
    }
    return json;
  } catch (ex) {
    // Network error (e.g., Failed to fetch)
    return { success: false, message: "Unable to connect to server. Please check your internet connection or try again later." };
  }
};
