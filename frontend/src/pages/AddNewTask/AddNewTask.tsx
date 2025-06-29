import { useState } from 'react'
import SideBar from '../SideBar/SideBar';
import { Link, useNavigate } from 'react-router-dom';
import TipTapEditor from '../../components/TipTap/TipTapEditor';
import { Toaster, toast } from 'react-hot-toast';
import { Button } from '../../components/ui/button';
import AxiosClient from '../../components/ApiClient/AxiosClient';
import { formatISO } from 'date-fns';

function AddNewTask() {
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [priority, setPriority] = useState('medium');
  const [isSaving, setIsSaving] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>();


  const navigate = useNavigate();

  const handleNewTask = async () => {
    if (!title || !priority || !editorContent || !dueDate) {
      toast.error("please enter all details")
      return
    }
    setIsSaving(true)

    try {
      const response = await AxiosClient.post("/add_new_task", {
        title,
        editorContent,
        priority,
        dueDate: dueDate ? formatISO(dueDate, {representation: 'date'}) : null
      })

      if (response) {
        toast.success(response.data.message)
        navigate("/today-task")
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status
        const message = error.response.message

        switch (status) {
          case 401:
            toast.error(message || "Unathorized")
            break
          case 500:
            toast.error(message || "Server error")
            break
        }
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.")
      } else {
        toast.error("Unexpected error!")
      }
    } finally {
      setIsSaving(false)
    }
  }


  return (
    <div className="flex md:flex-row min-h-screen bg-gray-100">
      <Toaster position="top-center" />
      <SideBar>
        <div className="flex-grow p-4 md:p-6">
          <TipTapEditor
            title={title}
            setTitle={setTitle}
            content={editorContent}
            setEditorContent={setEditorContent}
            priority={priority}
            setPriority={setPriority}
            dueDate={dueDate }
            setDueDate={setDueDate}

          />
          {/* Buttons Container */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 mt-6 w-full sm:w-auto sm:ml-9 px-4 sm:px-0">
            <Button
              className={`w-full sm:w-auto bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 ${isSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={isSaving}
              onClick={handleNewTask}
            >
              {isSaving && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
              )}
              {isSaving ? "Saving..." : "Save Task"}
            </Button>

            <Link to={"/today-task"}>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </SideBar>
    </div>
  )
}

export default AddNewTask;