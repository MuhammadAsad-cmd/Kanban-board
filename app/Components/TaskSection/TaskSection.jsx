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

const TaskSection = ({ section, sectionTitle, color, line }) => {
  const [taskText, setTaskText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [dropdownTaskId, setDropdownTaskId] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [isOver, setIsOver] = useState(false); // To track if the section is being hovered over
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const dropdownRef = useRef(null);
  const sectionRef = useRef(null);

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
    setIsOver(false); // Reset highlight after drop
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true); // Set the highlight when dragging over the section
  };

  const handleDragLeave = () => {
    setIsOver(false); // Reset highlight when dragging leaves the section
  };

  const calculateDynamicHeight = () => {
    if (sectionRef.current) {
      return sectionRef.current.offsetHeight; // Get the current height of the section
    }
    return 0;
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
    <>
      <div className="w-full shrink grow">
        <p className={`${line} h-1 w-full mb-3`}></p>
        <div
          className={`flex items-center justify-between select-none ${color}`}
        >
          <h3 className={`uppercase font-medium ${color}`}>{sectionTitle}</h3>
          <span className="rounded text-sm text-neutral-400">
            {tasks.length}
          </span>
        </div>
        <div
          ref={sectionRef}
          className={`area_height w-full transition-colors ${
            isOver ? "bg-gray-50" : "" // Highlight the section when dragging over
          }`}
          onDrop={(e) => handleDrop(e, section)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave} // Reset the highlight when the drag leaves
          style={{
            height: isOver ? `${calculateDynamicHeight() + 50}px` : "90%",
            border: isOver ? "2px dashed #333739" : "", // Change border color on hover
          }}
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
                  className="flex w-full ShadowTask flex-col gap-5 pb-3 pr-3  mt-2 rounded border border-primary"
                >
                  <textarea
                    placeholder="Edit task..."
                    className="flex-1 text-neutral-700 min-h-20 rounded bg-white p-3 text-sm outline-none"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                    spellCheck="false"
                  ></textarea>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditTaskId(null)}
                      className="px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded bg-neutral-400 hover:bg-neutral-500 px-1 py-1.5 text-xs text-white"
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
                  <div className="flex w-full  group cursor-pointer justify-between min-h-12 mt-2 p-3  ShadowTask rounded border border-[#eeee] items-center gap-1.5 py-1.5 text-base transition-colors bg-[#FFFFFF] text-neutral-800">
                    <div>
                      <p className="flex w-full justify-start">{task.name}</p>
                    </div>
                    <div className="w-5 h-5">
                      <HiDotsVertical
                        className={`text-base text-neutral-500 duration-300 ease-in-out ${
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
                  </div>

                  {dropdownTaskId === task.id && (
                    <div
                      ref={dropdownRef}
                      className="absolute cursor-pointer top-9 dropdownShadow right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-10"
                    >
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100"
                        onClick={() => {
                          setEditTaskText(task.name);
                          setEditTaskId(task.id);
                          setDropdownTaskId(null);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100"
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
                className="flex w-full justify-end items-center gap-1.5 py-1.5 text-xs transition-colors text-neutral-500 hover:text-neutral-800"
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
              <div className="flex w-full ShadowTask flex-col gap-5 pb-3 pr-3 mt-2 rounded border border-primary">
                <textarea
                  placeholder="Add a task..."
                  className="flex-1 text-neutral-700 min-h-20 rounded bg-white p-3 text-sm outline-none"
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  spellCheck="false"
                ></textarea>
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleAddTask}
                    className="flex items-center gap-1.5 rounded bg-neutral-400 hover:bg-neutral-500 px-1 py-1.5 text-xs text-white"
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskSection;
