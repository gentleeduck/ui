import React, { useEffect, useCallback, useState } from "react";

// Basic key combination type (e.g., 'ctrl+k')
type KeyCombination = string;

// Command sequence type (e.g., 'gg' in Vim to go to top)
type CommandSequence = string;

interface UseDuckShortcutOptions {
  keys: KeyCombination | CommandSequence;
  onKeysPressed: () => void;
  target?: Window | HTMLElement;
  enabled?: boolean;
  vimMode?: boolean;
  timeout?: number;
}

/**
 * A React hook for registering keyboard shortcuts with support for Vim-like commands
 */
export function useDuckShortcut({
  keys,
  onKeysPressed,
  vimMode = false,
  timeout = 2999, // Default 3-second timeout for sequences
}: UseDuckShortcutOptions): void {
  const [commands, setCommands] = useState<string[]>([]); // State to store executed commands

  // Event handler for key up to handle special cases
  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();

      let key: string = "";
      if (
        event.key.toLocaleLowerCase() === "control" ||
        event.key.toLowerCase() === "ctrl"
      ) {
        key = "ctrl";
      } else {
        key = event.key;
      }

      setCommands((prevCommands) => {
        const updatedCommands = [...prevCommands, key];
        console.log(updatedCommands.join("+"));

        const command = updatedCommands.join("+").toLowerCase();

        if (command === keys) {
          onKeysPressed();
          return []; // Reset after the command is triggered
        }

        // Timeout logic to reset commands after the sequence is missed
        setTimeout(() => {
          setCommands([]);
        }, timeout);

        return updatedCommands;
      });
    },
    [keys, onKeysPressed, timeout]
  );

  // Handle pressing escape to clear the sequence
  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setCommands([]); // Clear commands if Escape is pressed
    }
  }, []);

  // Set up the event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyUp);
    window.addEventListener("keydown", handleEscape);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("keydown", handleKeyUp);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [handleKeyUp, handleEscape]);
}
