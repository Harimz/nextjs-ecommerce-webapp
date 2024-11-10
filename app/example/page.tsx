import { Todo } from "@/features/example/components/todo";
import React from "react";

const ExamplePage = () => {
  const todos = [
    {
      id: 1,
      title: "Wash dishes",
      completed: false,
    },
    {
      id: 2,
      title: "Make dinner",
      completed: true,
    },
  ];
  return (
    <div>
      {todos.map((todo) => (
        <Todo />
      ))}
    </div>
  );
};

export default ExamplePage;
