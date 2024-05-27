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
        <div className="flex h-full min-h-[95vh] w-full gap-5 px-4 py-5">
          <TaskSection
            section="backlog"
            sectionTitle="Backlog"
            color="text-neutral-800 dark:text-neutral-500"
          />
          <TaskSection
            section="todo"
            sectionTitle="TODO"
            color="text-yellow-500 dark:text-yellow-200"
          />
          <TaskSection
            section="inProgress"
            sectionTitle="In Progress"
            color="text-blue-500 dark:text-blue-200"
          />
          <TaskSection
            section="complete"
            sectionTitle="Complete"
            color="text-emerald-500 dark:text-emerald-200"
          />
        </div>
      </section>
    </>
  );
};

export default MainContent;
