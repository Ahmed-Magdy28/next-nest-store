import { faker } from "@faker-js/faker";

export interface TestUser {
  email: string;
  username: string;
  password: string;
}

export function makeUser(overrides: Partial<TestUser> = {}): TestUser {
  return {
    email: faker.internet.email().toLowerCase(),
    username: `User${faker.string.alphanumeric(8)}`,
    password: "MangaSlayer12$",

    ...overrides,
  };
}
