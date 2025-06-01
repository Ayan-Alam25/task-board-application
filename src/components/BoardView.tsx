import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/store";
import { format, isValid } from "date-fns";

function BoardView() {
  const navigate = useNavigate();
  const { boards, addBoard, deleteBoard } = useStore();
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleAddBoard = () => {
    if (newBoardTitle.trim()) {
      addBoard(newBoardTitle, newBoardDescription);
      setNewBoardTitle("");
      setNewBoardDescription("");
      setShowModal(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Task Boards</h1>
        <button
          onClick={() => setShowModal(true)}
          className=" bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create New Board
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Board</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-left ml-1">
                Title
              </label>
              <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Board title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-left ml-1">
                Description
              </label>
              <textarea
                value={newBoardDescription}
                onChange={(e) => setNewBoardDescription(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Board description"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBoard}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {boards.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-light">No boards created yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-center">Title</th>
                <th className="py-3 px-4 text-center">Description</th>
                <th className="py-3 px-4 text-center">Created By</th>
                <th className="py-3 px-4 text-center">Created At</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {boards.map((board) => (
                <tr
                  key={board.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/board/${board.id}`)}
                >
                  <td className="py-3 px-4">{board.title}</td>
                  <td className="py-3 px-4">{board.description}</td>
                  <td className="py-3 px-4">
                    {board.createdBy?.name || "Unknown"}
                  </td>
                  <td className="py-3 px-4">
                    {isValid(new Date(board.createdAt))
                      ? format(new Date(board.createdAt), "MMM dd, yyyy")
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBoard(board.id);
                      }}
                      className="text-red-500
                  hover:text-red-700
                  "
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BoardView;
