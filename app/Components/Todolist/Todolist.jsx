"use client";
import { addTask, moveTask } from "@/app/Lib/slices/TaskSlices";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "tailwindcss/tailwind.css";

const Todolist = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);
  const [taskText, setTaskText] = useState("");

  const handleAddTask = () => {
    if (taskText.trim()) {
      dispatch(addTask(taskText));
      setTaskText("");
    }
  };

  const handleDragStart = (e, from, index) => {
    e.dataTransfer.setData("from", from);
    e.dataTransfer.setData("index", index);
  };

  const handleDrop = (e, to) => {
    const from = e.dataTransfer.getData("from");
    const index = e.dataTransfer.getData("index");
    dispatch(moveTask({ from, to, index: parseInt(index, 10) }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Task
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {["backlog", "todo", "inProgress", "complete"].map((section) => (
          <div
            key={section}
            onDrop={(e) => handleDrop(e, section)}
            onDragOver={handleDragOver}
            className="bg-gray-100 p-4 rounded-lg shadow-md"
          >
            <h2 className="text-lg font-bold mb-4 capitalize">{section}</h2>
            {tasks[section].map((task, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, section, index)}
                className="bg-white p-2 rounded-lg shadow mb-2 cursor-pointer"
              >
                {task}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todolist;
