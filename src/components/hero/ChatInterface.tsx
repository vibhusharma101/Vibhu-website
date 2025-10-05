"use client";
import { useState, useRef, useEffect } from "react";
import {
  TextInput,
  ActionIcon,
  Group,
  Stack,
  Paper,
  Text,
  ScrollArea,
  Box,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";

// Define a type for a single message object for type safety
interface Message {
  id: number;
  text: string;
  sender: "bot" | "me";
}

// Define the props for the ChatBubble component
interface ChatBubbleProps {
  message: Message;
}

// A single chat bubble component
function ChatBubble({ message }: ChatBubbleProps) {
  const isBot = message.sender === "bot";
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: isBot ? "flex-start" : "flex-end",
      }}
    >
      <Paper
        shadow="sm"
        p="xs"
        radius="lg"
        withBorder
        style={{
          maxWidth: "80%",
          backgroundColor: isBot
            ? "var(--mantine-color-gray-1)"
            : "var(--mantine-color-blue-filled)",
          color: isBot
            ? "var(--mantine-color-black)"
            : "var(--mantine-color-white)",
        }}
      >
        <Text size="sm">{message.text}</Text>
      </Paper>
    </Box>
  );
}

// The main chat interface component
export function ChatInterface() {
  // Type the state for the messages array
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! I'm a bot version of my owner. Ask me about my skills, projects, or experience.",
      sender: "bot",
    },
  ]);

  // Type the state for the input value
  const [inputValue, setInputValue] = useState<string>("");

  // Type the ref for the ScrollArea viewport
  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // The ref's current might be null, so we use optional chaining
    viewport.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "me",
    };
    const botResponse: Message = {
      id: messages.length + 2,
      text: "Thanks for your message! This is a demo, but I hope you are enjoying the UI.",
      sender: "bot",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <Stack
      gap="xs"
      h={400}
      style={{
        border: "1px solid var(--mantine-color-gray-3)",
        borderRadius: "var(--mantine-radius-md)",
      }}
    >
      <Paper
        p="sm"
        shadow="xs"
        withBorder
        style={{
          borderTopLeftRadius: "var(--mantine-radius-md)",
          borderTopRightRadius: "var(--mantine-radius-md)",
          borderBottom: 0,
        }}
      >
        <Text fw={600} ta="center">
          Chat to know more about me
        </Text>
      </Paper>

      <ScrollArea style={{ flex: 1 }} viewportRef={viewport} type="auto">
        <Stack gap="sm" p="sm">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
        </Stack>
      </ScrollArea>

      <Group
        gap="xs"
        p="sm"
        style={{ borderTop: "1px solid var(--mantine-color-gray-3)" }}
      >
        <TextInput
          placeholder="Ask me anything..."
          style={{ flex: 1 }}
          value={inputValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(event.currentTarget.value)
          }
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <ActionIcon
          size="lg"
          radius="xl"
          variant="filled"
          onClick={handleSendMessage}
        >
          <IconSend size={18} />
        </ActionIcon>
      </Group>
    </Stack>
  );
}
