"use client";
import React, { useEffect, useRef, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  deleteTask,
  moveTask,
  editTask,
} from "@/app/Lib/slices/TaskSlices";
import { v4 as uuidv4 } from "uuid";

const TaskSection = ({ section, sectionTitle, color }) => {
  const [taskText, setTaskText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [dropdownTaskId, setDropdownTaskId] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();

  const selectedProjectId = useSelector(
    (state) => state.projects.selectedProjectId
  );
  const tasks = useSelector(
    (state) =>
      state.projects.projects.find(
        (project) => project.id === selectedProjectId
      )[section]
  );

  const handleAddTask = () => {
    if (taskText.trim()) {
      dispatch(
        addTask({
          projectId: selectedProjectId,
          section,
          task: { id: uuidv4(), name: taskText },
        })
      );
      setTaskText("");
      setShowForm(false);
    }
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask({ projectId: selectedProjectId, section, taskId }));
    setDropdownTaskId(null);
  };

  const handleEditTask = (taskId) => {
    if (editTaskText.trim()) {
      dispatch(
        editTask({
          projectId: selectedProjectId,
          section,
          taskId,
          newName: editTaskText,
        })
      );
      setEditTaskText("");
      setEditTaskId(null);
      setDropdownTaskId(null);
    }
  };

  const handleDragStart = (e, fromSection, index) => {
    e.dataTransfer.setData("fromSection", fromSection);
    e.dataTransfer.setData("index", index);
  };

  const handleDrop = (e, toSection) => {
    const fromSection = e.dataTransfer.getData("fromSection");
    const index = e.dataTransfer.getData("index");
    dispatch(
      moveTask({
        projectId: selectedProjectId,
        fromSection,
        toSection,
        taskIndex: parseInt(index, 10),
      })
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownTaskId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full shrink grow">
      <div className={`flex items-center justify-between select-none ${color}`}>
        <h3 className={`uppercase font-medium ${color}`}>{sectionTitle}</h3>
        <span className="rounded text-sm text-neutral-400">{tasks.length}</span>
      </div>
      <div
        className="area_height w-full transition-colors bg-white/0 dark:bg-neutral-800/0"
        onDrop={(e) => handleDrop(e, section)}
        onDragOver={handleDragOver}
      >
        {tasks.map((task, index) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, section, index)}
            className="relative"
          >
            {editTaskId === task.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditTask(task.id);
                }}
                className="flex w-full flex-col gap-5 pb-3 pr-3 bg-[#3f3a50] mt-2 rounded border border-primary"
              >
                <textarea
                  placeholder="Edit task..."
                  className="flex-1 text-white min-h-20 rounded bg-[#3f3a50] p-3 text-sm outline-none"
                  value={editTaskText}
                  onChange={(e) => setEditTaskText(e.target.value)}
                  spellCheck="false"
                ></textarea>
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditTaskId(null)}
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
              <>
                <div className="flex w-full group cursor-pointer justify-start mt-2 p-3 h-[46px] rounded border border-[#404040] items-center gap-1.5 py-1.5 text-xs transition-colors bg-[#262626] text-white hover:text-neutral-800 dark:hover:text-neutral-50">
                  <p className="flex w-full justify-start">{task.name}</p>
                  <HiDotsVertical
                    className={`text-base text-white duration-300 ease-in-out ${
                      dropdownTaskId === task.id
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownTaskId((prevId) =>
                        prevId === task.id ? null : task.id
                      );
                    }}
                  />
                </div>
                {dropdownTaskId === task.id && (
                  <div
                    ref={dropdownRef}
                    className="absolute cursor-pointer top-9 right-0 mt-1 w-32 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10"
                  >
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        setEditTaskText(task.name);
                        setEditTaskId(task.id);
                        setDropdownTaskId(null);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        <div className="w-full transition-colors m-auto bg-neutral-800/0">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex w-full justify-end items-center gap-1.5 py-1.5 text-xs transition-colors text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-50"
            >
              <span>Add Card</span>
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTask();
              }}
              className="w-full mt-2"
            >
              <textarea
                placeholder="Add new task..."
                className="w-full rounded border border-primary text-black bg-primary/20 p-3 text-sm placeholder-primary focus:outline-0"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
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
  );
};

export default TaskSection;
