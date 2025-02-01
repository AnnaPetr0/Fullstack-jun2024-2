import { useState, useEffect } from "react";
import { Task } from "../../../model/taskModel";

export const useTodoListMV = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "done" | "undone">("all");

  useEffect(() => {
    loadTasks();
  }, []);

  // universal fetch tasks function (can be used to fetch all tasks or a single task by ID)
  const fetchTasks = async (taskId?: string): Promise<Task | Task[]> => {
    try {
      let url: string;

      if (taskId) {
        url = `http://localhost:3000/api/tasks/${taskId}`;
      } else {
        url = "http://localhost:3000/api/tasks";
      }
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      return taskId ? ({} as Task) : [];
    }
  };

  // universal load tasks function (can be used to load all tasks or a single task by ID)
  const loadTasks = async (taskId?: string) => {
    try {
      const data = await fetchTasks(taskId);
      setTasks((prevTasks) =>
        taskId
          ? prevTasks.map((task) =>
              task._id === taskId ? (data as Task) : task
            )
          : (data as Task[])
      );
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const addTask = async (text: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Failed to add task");

      // Load updated tasks after adding a new task
      await loadTasks();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;

      await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !task.isCompleted }),
      });

      // Load only the updated task
      await loadTasks(taskId);
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
  method: "DELETE",
});

if (!response.ok) {
  console.error(`Failed to delete task: ${response.statusText}`);
  return;
}

// Reload tasks to reflect deletion
await loadTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const updateTask = async (taskId: string, newText: string) => {
    try {
      await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });

      // Load only the updated task
      await loadTasks(taskId);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };


  const toggleEditMode = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, isEditing: !task.isEditing } : task
      )
    );
  };

  const applyFilter = async (status: "all" | "done" | "undone") => {
    try {
      setFilter(status);

      // Fetch tasks from server with applied filter
      const response = await fetch(
        `http://localhost:3000/api/tasks?filter=${status}`
      );
      if (!response.ok) throw new Error("Failed to apply filter");

      const filteredTasks: Task[] = await response.json();

      // Update tasks state with filtered tasks
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Failed to apply filter:", error);
    }
  };

  return {
    tasks,
    addTask,
    deleteTask,
    toggleTaskCompletion,
    applyFilter,
    updateTask,
    filter,
    toggleEditMode,
  };
};
