
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { LuTrash2 } from "react-icons/lu";

import DashboardLayout from "../../compontes/Layout/DashBoradLayout";
import axiosInstance from "../../utilit/axiosInstance";
import { API_PATHS } from "../../utilit/apiPath";
import SelectUsers from "../../compontes/inputs/SelectUser";
import TodoListInput from "../../compontes/inputs/TodoListInput";
import SelectDropdown from "../../compontes/inputs/SelectDropdown";
import Modal from "../../compontes/Modal";
import { CATAGORY_DATA } from "../../utilit/data";
import DeleteAlter from "../../compontes/DeleteAlter";

interface TodoItem {
  text: string;
  completed: boolean;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: string;
  category: string;
  reward: string;
  targetUrl: string;
  assignTo: string[];
  toChecklist: string[];
  attachements: unknown[];
}

interface TaskUser {
  _id: string;
}

interface TaskInfo {
  title: string;
  description: string;
  priority: string;
  category: string;
  reward: string | number;
  targetUrl?: string;
 
  assignedTo?: TaskUser[];
  toChecklist?: TodoItem[];
  attachemnts?: unknown[];
}

const Createtask = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const taskId = (
    location.state as { taskId?: string } | null
  )?.taskId;

  const [taskData, setTaskData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "low",
    category: "social",
    reward: "",
    targetUrl: "",
    assignTo: [],
    toChecklist: [],
    attachements: [],
  });

  const [currentTask, setCurrentTask] = useState<TaskInfo | null>(null);
  const [error, setError] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  // Update task form values safely
  const handleValueChange = <K extends keyof TaskFormData>(
    key: K,
    value: TaskFormData[K]
  ) => {
    setTaskData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // Clear form
  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "low",
      category: "social",
      reward: "",
      targetUrl: "",
      assignTo: [],
      toChecklist: [],
      attachements: [],
    });
  };

  // Create task
  const CreateTask = async () => {
    setLoading(true);

    try {
      const toDoList: TodoItem[] = taskData.toChecklist.map((item) => ({
        text: item,
        completed: false,
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        toChecklist: toDoList,
      });

      toast.success("Task created successfully");
      clearData();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error creating task:",
          error.response?.data?.message || error.message
        );
      } else {
        console.error("Error creating task:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Update task
  const updateTask = async () => {
    if (!taskId) return;

    setLoading(true);

    try {
      const previousChecklist = currentTask?.toChecklist || [];

      const todoList: TodoItem[] = taskData.toChecklist.map((item) => {
        const matchedTask = previousChecklist.find(
          (task) => task.text === item
        );

        return {
          text: item,
          completed: matchedTask?.completed ?? false,
        };
      });

      await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        {
          ...taskData,
          toChecklist: todoList,
        }
      );

      toast.success("Task updated successfully");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error updating task:",
          error.response?.data?.message || error.message
        );
      } else {
        console.error("Error updating task:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Validate and submit
  const handleSubmit = async () => {
    setError(null);

    if (!taskData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!taskData.description.trim()) {
      setError("Description is required");
      return;
    }

    if (taskData.assignTo.length === 0) {
      setError("Task not assigned to any member");
      return;
    }

    if (taskData.toChecklist.length === 0) {
      setError("Add at least one todo task");
      return;
    }

    if (
      taskData.reward === "" ||
      !Number.isFinite(Number(taskData.reward)) ||
      Number(taskData.reward) < 0
    ) {
      setError("Please enter a valid reward amount");
      return;
    }

    if (taskId) {
      await updateTask();
      return;
    }

    await CreateTask();
  };

  // Get task information by ID
  const getTaskDetalisByID = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );

      const taskInfo: TaskInfo = response.data.task ?? response.data;

      setCurrentTask(taskInfo);

      setTaskData({
        title: taskInfo.title || "",
        description: taskInfo.description || "",
        priority: taskInfo.priority || "low",
        category: taskInfo.category || "social",
        reward: String(taskInfo.reward ?? ""),
        targetUrl: taskInfo.targetUrl || "",
        assignTo: taskInfo.assignedTo?.map((item) => item._id) || [],
        toChecklist:
          taskInfo.toChecklist?.map((item) => item.text) || [],
        attachements: taskInfo.attachemnts || [],
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error getting task:",
          error.response?.data?.message || error.message
        );
      } else {
        console.error("Error getting task:", error);
      }
    }
  };

  // Delete task
  const deleteTask = async () => {
    if (!taskId) return;

    try {
      await axiosInstance.delete(
        API_PATHS.TASKS.DELETE_TASK(taskId)
      );

      setOpenDeleteAlert(false);
      toast.success("Task deleted successfully");
      navigate("/admin/tasks");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error deleting task:",
          error.response?.data?.message || error.message
        );
      } else {
        console.error("Error deleting task:", error);
      }
    }
  };

  // Load task when editing
  useEffect(() => {
    if (taskId) {
      getTaskDetalisByID(taskId);
    }
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="from-card cols-span-3 bg-white p-2 rounded-sm shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" />
                  Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>

              <input
                placeholder="Create APP UI"
                className="form-input"
                value={taskData.title}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleValueChange("title", e.target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>

              <textarea
                placeholder="Describe task"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  handleValueChange("description", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Category
                </label>

                <SelectDropdown
                  options={CATAGORY_DATA}
                  value={taskData.category}
                  onChange={(value: string) =>
                    handleValueChange("category", value)
                  }
                  placeholder="Select category"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Assign To
                </label>

                <SelectUsers
                  selectedUsers={taskData.assignTo}
                  setselectedUsers={(value: string[]) =>
                    handleValueChange("assignTo", value)
                  }
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Reward
              </label>

              <input
                type="number"
                placeholder="Enter reward amount"
                className="form-input"
                value={taskData.reward}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleValueChange("reward", e.target.value)
                }
              />
            </div>

            {["Social", "Video"].includes(taskData.category) && (
              <div className="col-span-12 mt-3">
                <label className="text-xs font-medium text-slate-600">
                  Target URL
                </label>

                <input
                  type="url"
                  placeholder={
                    taskData.category === "Social"
                      ? "https://instagram.com/example"
                      : "https://youtube.com/watch?v=example"
                  }
                  className="form-input"
                  value={taskData.targetUrl}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleValueChange("targetUrl", e.target.value)
                  }
                />
              </div>
            )}

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Todo Checklist
              </label>

              <TodoListInput
                todoList={taskData.toChecklist}
                setTodoList={(value: string[]) =>
                  handleValueChange("toChecklist", value)
                }
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">
                {error}
              </p>
            )}

            <div className="flex justify-end mt-7">
              <button
                type="button"
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? "PLEASE WAIT..."
                  : taskId
                    ? "UPDATE TASK"
                    : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlter
          content="Are you sure you want to delete this task?"
          onDelete={deleteTask}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default Createtask;
