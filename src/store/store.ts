import { create } from "zustand";
import type { Board, Card, User, Priority } from "../types/types";
import { v4 as uuidv4 } from "uuid";
import { persist } from "zustand/middleware";

interface StoreState {
  currentUser: User;
  boards: Board[];
  users: User[];
  addBoard: (title: string, description: string) => void;
  updateBoard: (id: string, title: string, description: string) => void;
  deleteBoard: (id: string) => void;
  addColumn: (boardId: string, title: string) => void;
  updateColumn: (boardId: string, columnId: string, title: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  addCard: (
    boardId: string,
    columnId: string,
    title: string,
    description: string,
    priority: Priority,
    dueDate: Date,
    assignedTo: User
  ) => void;
  updateCard: (
    boardId: string,
    columnId: string,
    cardId: string,
    updates: Partial<Card>
  ) => void;
  deleteCard: (boardId: string, columnId: string, cardId: string) => void;
  moveCard: (
    boardId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    sourceIndex: number,
    destinationIndex: number,
    cardId: string
  ) => void;
}

const useStore = create<StoreState>()(
  persist(
    (set) => ({
      currentUser: {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
      },
      users: [
        {
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
        },
        {
          id: "user-2",
          name: "Jane Smith",
          email: "jane@example.com",
        },
      ],
      boards: [],
      addBoard: (title, description) =>
        set((state) => {
          const newBoard: Board = {
            id: uuidv4(),
            title,
            description,
            createdAt: new Date(),
            createdBy: state.currentUser, // Ensure this is always set
            columns: [],
          };
          return { boards: [...state.boards, newBoard] };
        }),
      updateBoard: (id, title, description) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id ? { ...board, title, description } : board
          ),
        })),
      deleteBoard: (id) =>
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
        })),
      addColumn: (boardId, title) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: [
                    ...board.columns,
                    {
                      id: uuidv4(),
                      title,
                      cards: [],
                    },
                  ],
                }
              : board
          ),
        })),
      updateColumn: (boardId, columnId, title) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.map((column) =>
                    column.id === columnId ? { ...column, title } : column
                  ),
                }
              : board
          ),
        })),
      deleteColumn: (boardId, columnId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.filter(
                    (column) => column.id !== columnId
                  ),
                }
              : board
          ),
        })),
      addCard: (
        boardId,
        columnId,
        title,
        description,
        priority,
        dueDate,
        assignedTo
      ) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.map((column) =>
                    column.id === columnId
                      ? {
                          ...column,
                          cards: [
                            ...column.cards,
                            {
                              id: uuidv4(),
                              title,
                              description,
                              createdAt: new Date(),
                              createdBy: state.currentUser,
                              priority,
                              dueDate,
                              assignedTo,
                            },
                          ],
                        }
                      : column
                  ),
                }
              : board
          ),
        })),
      updateCard: (boardId, columnId, cardId, updates) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.map((column) =>
                    column.id === columnId
                      ? {
                          ...column,
                          cards: column.cards.map((card) =>
                            card.id === cardId ? { ...card, ...updates } : card
                          ),
                        }
                      : column
                  ),
                }
              : board
          ),
        })),
      deleteCard: (boardId, columnId, cardId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.map((column) =>
                    column.id === columnId
                      ? {
                          ...column,
                          cards: column.cards.filter(
                            (card) => card.id !== cardId
                          ),
                        }
                      : column
                  ),
                }
              : board
          ),
        })),
      moveCard: (
        boardId,
        sourceColumnId,
        destinationColumnId,
        sourceIndex,
        destinationIndex,
        cardId
      ) =>
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;

            const sourceColumn = board.columns.find(
              (col) => col.id === sourceColumnId
            );
            const destinationColumn = board.columns.find(
              (col) => col.id === destinationColumnId
            );

            if (!sourceColumn || !destinationColumn) return board;

            const card = sourceColumn.cards.find((c) => c.id === cardId);
            if (!card) return board;

            // Remove from source
            const newSourceCards = [...sourceColumn.cards];
            newSourceCards.splice(sourceIndex, 1);

            // Add to destination
            const newDestinationCards = [...destinationColumn.cards];
            newDestinationCards.splice(destinationIndex, 0, card);

            return {
              ...board,
              columns: board.columns.map((column) => {
                if (column.id === sourceColumnId) {
                  return { ...column, cards: newSourceCards };
                }
                if (column.id === destinationColumnId) {
                  return { ...column, cards: newDestinationCards };
                }
                return column;
              }),
            };
          }),
        })),
    }),
    {
      name: "task-board-storage",
    }
  )
);

export default useStore;
