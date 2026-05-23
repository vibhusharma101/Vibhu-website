"use client";
import { Grid, Stack, Title } from "@mantine/core";
import { BadgeCard } from "../ui/BadgeCard";
import { projects } from "@/data/projects";
import { useEffect, useState } from "react";

export function MyProjects() {
  const [projectCards, setProjectCards] = useState<string[]>(["/", "/"]);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {}

  return (
    <Stack align="center" gap={46}>
      <Title>My Projects</Title>
      <Grid>
        {projects.map((project) => (
          <Grid.Col key={project.id}>
            <BadgeCard />
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
}
