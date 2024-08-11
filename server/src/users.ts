const users: User[] = [];

interface User {
  id: string;
  name: string;
  room: string;
}

// Add user to users array
export function addUser({ id, name, room }: User) {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (existingUser) {
    return { error: 'Username is taken' };
  }

  const user: User = { id, name, room };

  users.push(user);
}


// Remove user from users array
export function removeUser(id: string) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    // return the removed user
    return users.splice(index, 1)[0];
  }
}

// Get user from users array
export function getUser(id: string) {
  // return the user with the id
  // if not found, return undefined
  return users.find((user) => user.id === id);
}

// get all users in a room
export function getUsersInRoom(room: string) {
  // return all users in the room
  return users.filter((user) => user.room === room);
}