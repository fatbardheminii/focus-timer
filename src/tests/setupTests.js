import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";

configure({
  getElementError: (message) => {
    const error = new Error(message);
    error.name = "TestingLibraryElementError";
    return error;
  },
});
