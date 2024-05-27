"use client";
import {
  selectProject,
  deleteProject,
  addProjects,
} from "@/app/Lib/slices/TaskSlices";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiDotsVertical } from "react-icons/hi";

const SideNav = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const [projectName, setProjectName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [dropdownProjectId, setDropdownProjectId] = useState(null);

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

  return (
    <>
      <div className="fixed top-0 left-0 h-full w-[250px] bg-white dark:bg-neutral-800">
        <div className="flex flex-col h-full">
          <div className="p-4 pb-2 flex items-center justify-between">
            <h3 className="uppercase font-medium text-primary">Projects</h3>
            <span className="rounded text-sm font-bold text-primary">
              {projects.length}
            </span>
          </div>
          <div className="px-4 h-full space-y-2 overflow-y-auto">
            {projects.map((project) => (
              <div
                key={project.id}
                className="w-full group transition-colors m-auto bg-neutral-800/0 relative"
              >
                <div
                  onClick={() => dispatch(selectProject(project.id))}
                  className="flex items-center justify-between p-3 h-[46px] cursor-pointer rounded border border-[#404040] gap-1.5 py-1.5 text-xs transition-colors text-white hover:text-neutral-800 dark:hover:text-neutral-50"
                >
                  <p className="flex w-full justify-start">{project.name}</p>
                  <HiDotsVertical
                    className={`text-base text-white  duration-300 ease-in-out ${
                      dropdownProjectId === project.id
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownProjectId(project.id);
                    }}
                  />
                </div>
                {dropdownProjectId === project.id && (
                  <div className="absolute top-9 right-0 mt-1 w-32 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10">
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        setDropdownProjectId(null);
                        // Handle edit project logic here
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
                  className="flex w-full justify-end items-center gap-1.5 py-1.5 text-xs transition-colors text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-50"
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
                    className="w-full rounded border border-primary text-black bg-primary/20 p-3 text-sm placeholder-primary focus:outline-0"
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
    </>
  );
};

export default SideNav;
