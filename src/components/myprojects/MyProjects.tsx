"use client";
import { Grid, Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { BadgeCard } from "../ui/BadgeCard";

export function MyProjects() {
  const [projectCards, setProjectCards] = useState<any[]>(["/", "/"]);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {}

  return (
    <Stack align="center" gap={46}>
      <Title>My Projects</Title>
      <Grid>
        {projectCards.map((value, index: number) => {
          return (
            <Grid.Col key={index + "."}>
              <BadgeCard />
            </Grid.Col>
          );
        })}
      </Grid>
    </Stack>
  );
}
