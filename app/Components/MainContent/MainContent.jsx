"use client";
import React from "react";
import { useSelector } from "react-redux";
import TaskSection from "../TaskSection/TaskSection";

const MainContent = () => {
  const selectedProjectId = useSelector(
    (state) => state.projects.selectedProjectId
  );

  if (!selectedProjectId) {
    return (
      <section className="ml-[260px] flex items-center justify-center h-full">
        <p>Please select or add a project to get started.</p>
      </section>
    );
  }

  return (
    <>
      <section className="ml-[260px]">
        <div className="px-4 mt-4">
          <h2 className="text-xl font-medium text-[#767777]">
            Action Board (status)
          </h2>
        </div>

        <div className="flex h-full min-h-[95vh] w-full gap-5 px-4 py-5">
          <TaskSection
            section="backlog"
            sectionTitle="Backlog"
            color="text-neutral-800"
            line="bg-[#c3fae8]"
          />
          <TaskSection
            section="todo"
            sectionTitle="TODO"
            color="text-neutral-800"
            line="bg-[#62d8e7]"
          />
          <TaskSection
            section="inProgress"
            sectionTitle="In Progress"
            color="text-neutral-800"
            line="bg-[#dee2e6]"
          />
          <TaskSection
            section="complete"
            sectionTitle="Complete"
            color="text-neutral-800"
            line="bg-[#fbc077]"
          />
        </div>
      </section>
    </>
  );
};

export default MainContent;
