const users: User[] = [];

interface User {
  id: string;
  name: string;
  room: string;
}

// Add user to users array
function addUser({ id, name, room }: User): { error?: string; user?: User } {
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

  return { user };
}


// Remove user from users array
function removeUser(id: string) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    // return the removed user
    return users.splice(index, 1)[0];
  }
}

// Get user from users array
function getUser(id: string) {
  // return the user with the id
  // if not found, return undefined
  return users.find((user) => user.id === id);
}

// get all users in a room
function getUsersInRoom(room: string) {
  // return all users in the room
  return users.filter((user) => user.room === room);
}

export { addUser, removeUser, getUser, getUsersInRoom, User };