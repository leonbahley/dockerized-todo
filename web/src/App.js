import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/todos")
      .then((resp) => setTodos(resp.data))
      .catch(console.log);
  }, []);

  const saveTodo = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/todos", {
        title,
        completed: 0,
      })
      .then((res) => {
        setTodos((prev) => [...prev, res.data]);
        setTitle("");
      })
      .catch(console.log);
  };

  const deleteItem = (id) => {
    axios
      .delete(`http://localhost:8000/api/todos/${id}`)
      .then((res) => {
        if (res.data.deleted === 1) {
          setTodos((prev) => prev.filter((item) => item.id !== id));
        }
      })
      .catch(console.log);
  };

  const completeTodo = (id, title) => {
    axios
      .put(`http://localhost:8000/api/todos/${id}`, { title, completed: 1 })
      .then((res) => {
        if (res.data.updated === 1) {
          setTodos((prev) =>
            prev.map((item) => {
              if (item.id === id) {
                return { ...item, completed: 1 };
              } else {
                return item;
              }
            })
          );
        }
      })
      .catch(console.log);
  };
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-5">
      <form onSubmit={saveTodo} className="flex gap-5">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-[500px] border border-black px-2"
        />
        <button className="bg-black px-2 py-1 text-white">Add todo</button>
      </form>
      <ul className="border border-black w-[500px] h-[500px] overflow-y-scroll px-2 py-2 flex flex-col gap-2 divide-y divide-gray-400">
        {todos.length > 0 &&
          todos.map((item) => (
            <li key={item.id} className="flex justify-between">
              <button onClick={() => completeTodo(item.id, item.title)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </button>
              <span className={`${item.completed && "line-through"}`}>
                {item.title}
              </span>
              <button onClick={() => deleteItem(item.id)}>
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
