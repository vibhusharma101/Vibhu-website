'use client'
import { Button, Image, Text, TextInput, Title } from '@mantine/core';
import image from '../../../public/globe.svg';
import classes from './AboutMe.module.css';

export function AboutMe() {
  return (
    <div className={classes.wrapper}>
      <div className={classes.body}>
        <Title className={classes.title}>Wait a minute...</Title>
        <Text fw={500} fz="lg" mb={5}>
          Subscribe to our newsletter!
        </Text>
        <Text fz="sm" c="dimmed">
          You will never miss important product updates, latest news and community QA sessions. Our
          newsletter is once a week, every Sunday.
        </Text>

        <div className={classes.controls}>
          <TextInput
            placeholder="Your email"
            classNames={{ input: classes.input, root: classes.inputWrapper }}
            radius="md"
            size="md"
          />
          <Button className={classes.control} radius="md" size="md">
            Subscribe
          </Button>
        </div>
      </div>
      <Image src={image.src} className={classes.image} />
    </div>
  );
}