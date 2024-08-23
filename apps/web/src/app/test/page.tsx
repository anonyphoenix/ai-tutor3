import { fetchAllUsersAction } from "../actions/db";

// In a React component or page
const AllUsers = async () => {
  const users = await fetchAllUsersAction();

  return (
    <div>
      <h1>All Users</h1>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AllUsers;
