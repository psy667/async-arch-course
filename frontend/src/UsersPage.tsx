import { createMemo, createResource, createSignal, For, Show } from 'solid-js';
function User({ user, isSelected }) {
  const avatarUrl = `https://source.boringavatars.com/beam/120/${user.id}?colors=edd8bb,e2aa87,fef7e1,a2d3c7,ef8e7d`;

  return (
    <div
      class="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
      classList={{
        'bg-gray-200 dark:bg-gray-700': isSelected(),
      }}
    >
      <div class="flex-shrink-0 mr-2">
        <img class="w-8 h-8 rounded-full" src={avatarUrl} alt="Neil image" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
          {user.name}
        </p>
        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
          {user.email}
        </p>
      </div>
      <div
        class="flex-shrink-0 ml-2 py-0.5 px-2 rounded-full text-xs font-medium bg-blue-100 text-green-800 dark:bg-green-800 dark:text-green-100"
        classList={{
          'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100':
            user.role == 'employee',
          'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100':
            user.role == 'manager',
          'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100':
            user.role == 'admin',
        }}
      >
        {user.role}
      </div>
    </div>
  );
}

function UsersPage() {
  const [refreshUsers, setRefreshUsers] = createSignal(0);
  const [users] = createResource(
    refreshUsers,
    () => {
      const jwt = localStorage.getItem('token');
      const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};

      return fetch('http://localhost:3201/user', { headers }).then((res) =>
        res.json(),
      );
    },
    {
      initialValue: [],
    },
  );
  const [search, setSearch] = createSignal('');
  const filteredUsers = createMemo(() => {
    return users().filter((user) =>
      user.name.toLowerCase().includes(search().toLowerCase()),
    );
  });

  const [selectedUserId, setSelectedUserId] = createSignal(null);
  const [selectedUser] = createResource(selectedUserId, async () => {
    if (!selectedUserId()) return Promise.resolve(null);
    const jwt = localStorage.getItem('token');
    const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};

    const res = await fetch(`http://localhost:3201/user/${selectedUserId()}`, {
      headers,
    });
    return await res.json();
  });

  const changeUserRole = () => async (e) => {
    const jwt = localStorage.getItem('token');
    const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};

    const res = await fetch(
      `http://localhost:3201/user/${selectedUserId()}/change-role`,
      {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: e.currentTarget.value }),
      },
    );
    await res.json();
    setRefreshUsers((x) => x + 1);
  };

  const changeUserName = async (e) => {
    const jwt = localStorage.getItem('token');
    const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};

    const res = await fetch(`http://localhost:3201/user/${selectedUserId()}`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: e.currentTarget.value }),
    });
    await res.json();
    setRefreshUsers((x) => x + 1);
  };

  const changeUserEmail = async (e) => {
    const jwt = localStorage.getItem('token');
    const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};

    const res = await fetch(`http://localhost:3201/user/${selectedUserId()}`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: e.currentTarget.value }),
    });
    await res.json();
    setRefreshUsers((x) => x + 1);
  };

  return (
    <div class="flex m-4">
      <div class="">
        <input
          type="text"
          placeholder="Search"
          onInput={(e) => setSearch(e.currentTarget.value)}
          class="border-1 w-full border-gray-300 dark:border-gray-700 rounded-lg p-1 m-2"
        />
        <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700 h-[calc(100vh-150px)] overflow-scroll">
          <For each={filteredUsers()}>
            {(user) => (
              <li onClick={() => setSelectedUserId(user.id)}>
                <User
                  user={user}
                  isSelected={() => selectedUserId() == user.id}
                />
              </li>
            )}
          </For>
        </ul>
      </div>

      <div class="ml-4 w-[50%] bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <Show
          when={selectedUser()}
          fallback={
            <div class="px-4 py-5 sm:px-6">
              <h6 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Select a user
              </h6>
            </div>
          }
        >
          <div class="px-4 py-5 sm:px-6">
            <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Name
            </p>
            <input
              type="text"
              placeholder="Name"
              value={selectedUser()?.name}
              class="border-1 w-full border-gray-300 dark:border-gray-700 rounded-lg p-1 mt-1"
              onChange={changeUserName}
            />
            <p class="max-w-2xl text-sm text-gray-500 dark:text-gray-400 mt-4">
              Email
            </p>
            <input
              type="text"
              placeholder="Email"
              value={selectedUser()?.email}
              class="border-1 w-full border-gray-300 dark:border-gray-700 rounded-lg p-1 mt-1"
              onChange={changeUserEmail}
            />

            <p class="mt-4 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Role
            </p>
            <div>
              <select
                class="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={selectedUser()?.role}
                onChange={changeUserRole()}
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}

export { UsersPage };
