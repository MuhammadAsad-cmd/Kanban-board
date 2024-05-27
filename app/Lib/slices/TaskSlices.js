const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  projects: [],
  selectedProjectId: null,
  selectedSection: null, // Add this line
  sectionHeight: 0, // Add this line
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
    selectSection: (state, action) => {
      state.selectedSection = action.payload;
      state.sectionHeight = 600;
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
    editProject: (state, action) => {
      const { projectId, newName } = action.payload;
      const project = state.projects.find((p) => p.id === projectId);
      if (project) {
        project.name = newName;
      }
    },
    reorderProjects: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [movedProject] = state.projects.splice(sourceIndex, 1);
      state.projects.splice(destinationIndex, 0, movedProject);
    },
    resetSection: (state) => {
      state.selectedSection = null;
      state.sectionHeight = 0;
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
  editProject,
  reorderProjects,
  selectSection
} = projectsSlice.actions;
export const ProjectReducer = projectsSlice.reducer;
