import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useStore from "../store/store";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { BiArrowBack } from "react-icons/bi";
import { FiEdit, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { format } from "date-fns";
import { MdOutlinePriorityHigh} from "react-icons/md";
import { LuCalendar, LuUser, LuFileText } from "react-icons/lu";

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    boards,
    addColumn,
    updateColumn,
    deleteColumn,
    addCard,
    deleteCard,
    moveCard,
    users,
  } = useStore();

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnTitle, setEditingColumnTitle] = useState("");
  const [showAddCard, setShowAddCard] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");
  const [newCardPriority, setNewCardPriority] = useState<
    "high" | "medium" | "low"
  >("medium");
  const [newCardDueDate, setNewCardDueDate] = useState("");
  const [newCardAssignedTo, setNewCardAssignedTo] = useState("");

  const board = boards.find((b) => b.id === id);

  if (!board) {
    return <div className="p-4 text-red-500">Board not found</div>;
  }

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    moveCard(
      board.id,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index,
      draggableId
    );
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(board.id, newColumnTitle);
      setNewColumnTitle("");
      setShowAddColumn(false);
    }
  };

  const startEditColumn = (columnId: string, title: string) => {
    setEditingColumnId(columnId);
    setEditingColumnTitle(title);
  };

  const handleUpdateColumn = () => {
    if (editingColumnId && editingColumnTitle.trim()) {
      updateColumn(board.id, editingColumnId, editingColumnTitle);
      setEditingColumnId(null);
      setEditingColumnTitle("");
    }
  };

  const handleAddCard = (columnId: string) => {
    if (newCardTitle.trim()) {
      const assignedUser = users.find((u) => u.id === newCardAssignedTo);
      if (!assignedUser) return;

      addCard(
        board.id,
        columnId,
        newCardTitle,
        newCardDescription,
        newCardPriority,
        newCardDueDate ? new Date(newCardDueDate) : new Date(),
        assignedUser,
      );
      setNewCardTitle("");
      setNewCardDescription("");
      setNewCardPriority("medium");
      setNewCardDueDate("");
      setNewCardAssignedTo("");
      setShowAddCard(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 hover:text-blue-700 mb-4 flex items-center transition-colors"
        >
          <BiArrowBack className="mr-2" size={18} />
          Back to Boards
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{board.title}</h1>
        {board.description && (
          <p className="text-gray-600 mt-1">{board.description}</p>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex overflow-x-auto pb-4 gap-4 min-h-[calc(100vh-180px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {board.columns.map((column) => (
            <Droppable
              key={column.id}
              droppableId={column.id}
              direction="vertical"
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-shrink-0 w-72 bg-gray-50 rounded-lg p-4 flex flex-col border border-gray-200 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    {editingColumnId === column.id ? (
                      <input
                        type="text"
                        value={editingColumnTitle}
                        onChange={(e) => setEditingColumnTitle(e.target.value)}
                        onBlur={handleUpdateColumn}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleUpdateColumn()
                        }
                        autoFocus
                        className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    ) : (
                      <h3 className="font-semibold text-gray-700">
                        {column.title}
                      </h3>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditColumn(column.id, column.title)}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        aria-label="Edit Column"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => deleteColumn(board.id, column.id)}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        aria-label="Delete column"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {showAddCard === column.id ? (
                    <div className="mb-4 bg-white p-3 rounded-lg shadow border border-gray-200">
                      <input
                        type="text"
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        placeholder="Card title"
                        className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        autoFocus
                      />
                      <textarea
                        value={newCardDescription}
                        onChange={(e) => setNewCardDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        rows={2}
                      />
                      <div className="flex items-center mb-2">
                        <MdOutlinePriorityHigh
                          className="text-gray-500 mr-2"
                          size={18}
                        />
                        <select
                          value={newCardPriority}
                          onChange={(e) =>
                            setNewCardPriority(
                              e.target.value as "high" | "medium" | "low"
                            )
                          }
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                          <option value="high">High Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="low">Low Priority</option>
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <LuCalendar className="text-gray-500 mr-2" size={18} />
                        <input
                          type="date"
                          value={newCardDueDate}
                          onChange={(e) => setNewCardDueDate(e.target.value)}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                      <div className="flex items-center mb-3">
                        <LuUser className="text-gray-500 mr-2" size={18} />
                        <select
                          value={newCardAssignedTo}
                          onChange={(e) => setNewCardAssignedTo(e.target.value)}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                          <option value="">Assign to...</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowAddCard(null)}
                          className="px-3 py-1 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <FiX size={18} />
                        </button>
                        <button
                          onClick={() => handleAddCard(column.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddCard(column.id)}
                      className="w-full flex items-center justify-center text-gray-500 hover:bg-gray-100 p-2 rounded mb-4 transition-colors"
                      aria-label="Add card"
                    >
                      <FiPlus size={16} className="mr-2" />
                      Add a card
                    </button>
                  )}

                  <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {column.cards.map((card, index) => (
                      <Draggable
                        key={card.id}
                        draggableId={card.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-3 rounded-lg shadow border ${
                              snapshot.isDragging
                                ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                                : "border-gray-200"
                            } transition-colors`}
                            aria-label={`Task: ${card.title}`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-800">
                                {card.title}
                              </h4>
                              <button
                                onClick={() =>
                                  deleteCard(board.id, column.id, card.id)
                                }
                                className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                                aria-label="Delete task"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>

                            {card.description && (
                              <div className="flex items-start mt-2 text-sm text-gray-600">
                                <LuFileText
                                  className="flex-shrink-0 mt-0.5 mr-1.5 text-gray-400"
                                  size={14}
                                />
                                <p className="flex-1 text-left">
                                  {card.description}
                                </p>
                              </div>
                            )}

                            <div className="mt-3 space-y-2 text-sm">
                              <div className="flex items-center ml-0.5">
                                <span
                                  className={`inline-block w-2 h-2 rounded-full  mr-2 ${
                                    card.priority === "high"
                                      ? "bg-red-500"
                                      : card.priority === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                  }`}
                                ></span>
                                <span className="capitalize  ">
                                  {card.priority} priority
                                </span>
                              </div>

                              <div className="flex items-center text-gray-600">
                                <LuCalendar
                                  className="mr-2 text-gray-400"
                                  size={14}
                                />
                                <span>
                                  Due:{" "}
                                  {format(
                                    new Date(card.dueDate),
                                    "MMM dd, yyyy"
                                  )}
                                </span>
                              </div>

                              <div className="flex items-center text-gray-600">
                                <LuUser
                                  className="mr-2 text-gray-400"
                                  size={14}
                                />
                                <span>
                                  Assigned to:{" "}
                                  <span className="font-medium">
                                    {card.assignedTo.name}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}

          {showAddColumn ? (
            <div className="flex-shrink-0 w-72 bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onBlur={handleAddColumn}
                onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
                placeholder="Column title"
                className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddColumn(false)}
                  className="px-3 py-1 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Cancel"
                >
                  <FiX size={18} />
                </button>
                <button
                  onClick={handleAddColumn}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                  aria-label="Add column"
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddColumn(true)}
              className="flex-shrink-0 w-72 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-lg p-4 h-fit border border-gray-200 shadow-sm transition-colors"
              aria-label="Add column"
            >
              <FiPlus size={16} className="mr-2" />
              Add another column
            </button>
          )}
        </div>
      </DragDropContext>
    </div>
  );
}

export default BoardDetail;
