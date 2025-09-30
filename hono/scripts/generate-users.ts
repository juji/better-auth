import { faker } from '@faker-js/faker';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

const generateUsers = (count: number): User[] => {
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const user: User = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean(),
      image: faker.datatype.boolean() ? faker.image.avatar() : undefined,
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    };
    users.push(user);
  }

  return users;
};

const users = generateUsers(100);

writeFileSync(
  join(process.cwd(), 'scripts', 'users', 'fake-users.json'),
  JSON.stringify(users, null, 2)
);

console.log('Generated 100 fake users in scripts/users/fake-users.json');