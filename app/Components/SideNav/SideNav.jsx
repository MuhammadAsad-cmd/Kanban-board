"use client";
import {
  selectProject,
  selectSection,
  deleteProject,
  addProjects,
  editProject,
  reorderProjects,
} from "@/app/Lib/slices/TaskSlices";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiDotsVertical, HiOutlineDotsVertical } from "react-icons/hi";
import { RiArrowLeftLine, RiMenu3Line } from "react-icons/ri";

const SideNav = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const selectedProjectId = useSelector(
    (state) => state.projects.selectedProjectId
  );
  const [projectName, setProjectName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [dropdownProjectId, setDropdownProjectId] = useState(null);
  const [editProjectId, setEditProjectId] = useState(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleAddProjects = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      dispatch(addProjects(projectName));
      setProjectName("");
      setShowForm(false);
    }
  };

  const handleDeleteProject = (projectId) => {
    dispatch(deleteProject(projectId));
  };

  const handleEditProject = (e) => {
    e.preventDefault();
    if (editProjectName.trim()) {
      dispatch(
        editProject({ projectId: editProjectId, newName: editProjectName })
      );
      setEditProjectId(null);
      setEditProjectName("");
    }
  };

  const handleCancelEdit = () => {
    setEditProjectId(null);
    setEditProjectName("");
  };

  const onDragStart = (event, index) => {
    event.dataTransfer.setData("projectIndex", index);
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDrop = (event, destinationIndex) => {
    const sourceIndex = event.dataTransfer.getData("projectIndex");
    if (sourceIndex !== destinationIndex) {
      dispatch(
        reorderProjects({
          sourceIndex: parseInt(sourceIndex),
          destinationIndex,
        })
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownProjectId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        ref={dropdownRef}
        className={`fixed z-50 top-0 left-0 h-full w-[250px] bg-[#333739] text-white transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 pb-2 flex items-center justify-between">
            <h3 className="uppercase font-medium text-primary">Projects</h3>
            <span className="rounded text-sm font-bold text-primary">
              {projects.length}
            </span>
          </div>
          <div className="px-4 h-full space-y-2 overflow-y-auto">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`w-full group transition-colors m-auto relative ${
                  selectedProjectId === project.id
                    ? "bg-gray-700 rounded"
                    : "bg-neutral-800/0"
                }`}
                draggable
                onDragStart={(event) => onDragStart(event, index)}
                onDragOver={onDragOver}
                onDrop={(event) => onDrop(event, index)}
              >
                <div
                  onClick={() => {
                    dispatch(selectProject(project.id));
                    dispatch(selectSection(null)); // Optionally reset section selection
                  }}
                >
                  <p className="flex w-full justify-start">
                    {editProjectId === project.id ? (
                      <form
                        onSubmit={handleEditProject}
                        className="flex w-full flex-col gap-5 pb-3 pr-3 bg-gray-700 rounded border border-gray-700"
                      >
                        <textarea
                          placeholder="Edit task..."
                          className="flex-1 text-white rounded bg-gray-700 p-3 text-sm outline-none"
                          value={editProjectName}
                          onChange={(e) => setEditProjectName(e.target.value)}
                          spellCheck="false"
                        ></textarea>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-800 transition-colors dark:hover:text-neutral-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex items-center gap-1.5 rounded bg-neutral-600 hover:bg-neutral-800 dark:bg-neutral-50 px-3 py-1.5 text-xs text-neutral-50 dark:text-neutral-950 transition-colors dark:hover:bg-neutral-300"
                          >
                            <span>Update</span>
                            <svg
                              stroke="currentColor"
                              fill="none"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center w-full justify-between p-3 h-[46px] cursor-pointer rounded border border-[#404040] shadow-2xl gap-1.5 py-1.5 text-sm transition-colors text-white">
                        {project.name}
                        <HiDotsVertical
                          className={`text-base text-white duration-300 ease-in-out ${
                            dropdownProjectId === project.id
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownProjectId((prevId) =>
                              prevId === project.id ? null : project.id
                            );
                          }}
                        />
                      </div>
                    )}
                  </p>
                </div>
                {dropdownProjectId === project.id && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-9 right-0 mt-1 w-32 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10"
                  >
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        setEditProjectId(project.id);
                        setEditProjectName(project.name);
                        setDropdownProjectId(null);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        handleDeleteProject(project.id);
                        setDropdownProjectId(null);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div className="w-full transition-colors m-auto bg-neutral-800/0">
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex w-full justify-end items-center gap-1.5 py-1.5 text-xs transition-colors text-neutral-50"
                >
                  <span>Add project</span>
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              ) : (
                <form onSubmit={handleAddProjects} className="w-full">
                  <textarea
                    placeholder="Add new project..."
                    className="w-full rounded border border-[#A78BFA] text-white bg-gray-700 p-3 text-base placeholder-primary focus:outline-0"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    spellCheck="false"
                  ></textarea>
                  <div className="mt-1.5 flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-800 transition-colors dark:hover:text-neutral-50"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded bg-neutral-600 hover:bg-neutral-800 dark:bg-neutral-50 px-3 py-1.5 text-xs text-neutral-50 dark:text-neutral-950 transition-colors dark:hover:bg-neutral-300"
                    >
                      <span>Add</span>
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <button
        className={`z-50 hidden  absolute transition-transform duration-500 ease-in-out transform top-4 max-md:block p-2 text-white bg-[#333739] rounded-r-full ${
          isSidebarOpen ? "left-[250px] opacity-100" : "left-0 opacity-100"
        }`}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <RiArrowLeftLine /> : <RiMenu3Line />}
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 max-w-md:block md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default SideNav;
