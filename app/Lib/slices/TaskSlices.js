const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  projects: [],
  selectedProjectId: null,
};

const projectsSlice = createSlice({
  name: "Projects",
  initialState,
  reducers: {
    addProjects: (state, action) => {
      state.projects.push({
        id: new Date().toISOString(),
        name: action.payload,
        backlog: [],
        todo: [],
        inProgress: [],
        complete: [],
      });
    },
    selectProject: (state, action) => {
      state.selectedProjectId = action.payload;
    },
    addTask: (state, action) => {
      const { projectId, section, task } = action.payload;
      const project = state.projects.find((p) => p.id === projectId);
      project[section].push(task);
    },
    moveTask: (state, action) => {
      const { projectId, fromSection, toSection, taskIndex } = action.payload;
      const project = state.projects.find((p) => p.id === projectId);
      const [movedTask] = project[fromSection].splice(taskIndex, 1);
      project[toSection].push(movedTask);
    },
    deleteTask: (state, action) => {
      const { projectId, section, taskId } = action.payload;
      const project = state.projects.find((p) => p.id === projectId);
      project[section] = project[section].filter((task) => task.id !== taskId);
    },
    editTask: (state, action) => {
      const { projectId, section, taskId, newName } = action.payload;
      const project = state.projects.find((p) => p.id === projectId);
      const task = project[section].find((task) => task.id === taskId);
      if (task) {
        task.name = newName;
      }
    },
    deleteProject: (state, action) => {
      const projectId = action.payload;
      state.projects = state.projects.filter((project) => project.id !== projectId);
      if (state.selectedProjectId === projectId) {
        state.selectedProjectId = null;
      }
    },
  },
});

export const {
  addProjects,
  selectProject,
  addTask,
  moveTask,
  deleteTask,
  editTask,
  deleteProject,
} = projectsSlice.actions;
export const ProjectReducer = projectsSlice.reducer;
