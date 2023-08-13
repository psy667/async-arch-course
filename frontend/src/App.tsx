import { createResource, createSignal, For, onCleanup, Show } from 'solid-js';
import 'flowbite';
const Navbar = ({ logout, currentUser }) => {
  return (
    <>
      <nav class="bg-white border-gray-200 dark:bg-gray-900">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <a class="flex items-center">
            <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              🦜🚕 Uber Popug Inc
            </span>
          </a>
          <div class="flex items-center cursor-pointer">
            <Show when={currentUser()}>
              <span class="mr-4">
                <User user={currentUser()} />
              </span>
              <a
                onClick={logout}
                class="text-sm  text-blue-600 dark:text-blue-500 hover:underline"
              >
                Logout
              </a>
            </Show>
          </div>
        </div>
      </nav>
      <Show when={currentUser()}>
        <nav class="bg-gray-50 dark:bg-gray-700 mb-4">
          <div class="max-w-screen-xl px-4 py-3 mx-auto">
            <div class="flex items-center">
              <ul class="flex flex-row font-medium mt-0 mr-6 space-x-8 text-sm">
                <li>
                  <a
                    href="#tasks"
                    class="text-gray-900 dark:text-white hover:underline"
                    aria-current="page"
                  >
                    Task Tracker
                  </a>
                </li>
                <li>
                  <a
                    href="#users"
                    class="text-gray-900 dark:text-white hover:underline"
                  >
                    Users
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </Show>
    </>
  );
};
const User = ({ user }) => {
  const avatarUrl = `https://source.boringavatars.com/beam/120/${user.id}?colors=edd8bb,e2aa87,fef7e1,a2d3c7,ef8e7d`;
  // component to show user name and avatar
  return (
    <div class="flex items-center">
      <img class="w-4 h-4 rounded-full" src={avatarUrl} alt="Rounded avatar" />
      <div class="ml-1">
        <div class="text-sm font-medium text-gray-900">
          {user.name}
          {/*<span class="mr-2 bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">*/}
          {/*  {user.role}*/}
          {/*</span>*/}
        </div>
        {/*<a class="text-sm text-blue-600 underline dark:text-blue-500 hover:no-underline">*/}
        {/*  {user.email}*/}
        {/*</a>*/}
      </div>
    </div>
  );
};

const TaskCard = ({ task, handleComplete }) => {
  const [checked, setChecked] = createSignal(task.status === 'done');

  const handleChange = (event) => {
    if (event.target.checked) {
      handleComplete(task.id);
      setChecked(event.target.checked);
    }
  };

  return (
    <div class="w-[100%] mb-4 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div class="flex items-flex-start">
        <input
          id="checkbox-table-1"
          type="checkbox"
          checked={checked()}
          disabled={task.status === 'done'}
          class="w-4 h-4 mt-1 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded  dark:bg-gray-700 dark:border-gray-600"
          onChange={handleChange}
        />
        <h5 class="mb-2 text-md tracking-tight text-gray-900 dark:text-white">
          {task.description}
        </h5>
        <label for="checkbox-table-1" class="sr-only">
          checkbox
        </label>
      </div>
      <div>
        <Show when={task.status == 'open'}>
          <span class="flex mb-2">
            <span class="mr-2 text-sm text-gray-500">Assigned to:</span>
            <User user={task.assignedTo} />
          </span>
        </Show>
        <Show when={task.status == 'done' && task.completedBy}>
          <span class="flex">
            <span class="mr-2 text-sm text-gray-500">Completed by:</span>{' '}
            <User user={task.completedBy} />
          </span>
        </Show>
        <span class="flex">
          <span class="mr-2 text-sm text-gray-500">Created by:</span>{' '}
          <User user={task.createdBy} />
        </span>
      </div>
      {/*<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>*/}
      {/*<a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">*/}
      {/*  Read more*/}
      {/*  <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">*/}
      {/*    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>*/}
      {/*  </svg>*/}
      {/*</a>*/}
    </div>

    // {/*<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">*/}
    // {/*  <td class="w-4 p-4">*/}
    // {/*    */}
    // {/*    </div>*/}
    // {/*  </td>*/}
    // {/*  <th*/}
    // {/*    scope="row"*/}
    // {/*    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"*/}
    // {/*  >*/}
    // {/*    {task.description.slice(0, 40)}*/}
    // {/*  </th>*/}
    // {/*  <td class="px-6 py-4">{task.assignedTo.name}</td>*/}
    // {/*  <td class="px-6 py-4">{task.createdBy.name}</td>*/}
    // {/*</tr>*/}
  );
};

const TaskTracker = () => {
  const [filter, setFilter] = createSignal(false);
  const [refreshKey, setRefreshKey] = createSignal(0);

  const [jwtToken] = createSignal(localStorage.getItem('token'));

  let [jwtData, setJwtData] = createSignal(null);

  if (jwtToken()) {
    setJwtData(JSON.parse(atob(jwtToken().split('.')[1])));
  }

  const currentUserID = jwtData()?.userId;

  const [currentUser] = createResource(jwtToken, () => {
    if (!jwtToken()) return;
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${jwtToken()}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };
    return (
      fetch('http://localhost:3201/user/me', requestOptions)
        .then((response) => response.json())
        .then((response) => JSON.parse(response))
        // .then((it) => console.log({ it }))
        // .then((data) => (data.statusCode ? logout() : data))
        // .then((data) => setTasks(data))
        .catch((err) => {
          console.log(err);
        })
    );
  });

  // Cleanup function
  onCleanup(() => {
    setFilter(() => false);
    setRefreshKey(() => 0);
  });

  const [tasks] = createResource(
    refreshKey,
    () => {
      if (!jwtToken()) return;
      const myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${jwtToken()}`);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
      };
      return (
        fetch('http://localhost:3200/task-tracker', requestOptions)
          .then((response) => response.json())
          .then((data) => (data.statusCode ? logout() : data))
          // .then((data) => setTasks(data))
          .catch(() => [])
      );
    },
    {
      initialValue: [],
    },
  );

  const login = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"beak": "735bda763d0d013c893b8e05ee6b3aa88f869361c93af81782e2a41bf18e9192fff7eb4ae2d46b103fa18545b1295184554ed3295d5bd5bd9a7af822ce6d2be3"}',
    };
    fetch('http://localhost:3201/auth', requestOptions)
      .then((response) => response.text())
      .then((data) => {
        localStorage.setItem('token', data);
        window.location.reload();
      })
      .catch((error) => console.error(error));
  };

  const handleComplete = (taskId) => {
    fetch(`http://localhost:3200/task-tracker/${taskId}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken()}`,
      },
    }).then(() => {
      setRefreshKey(refreshKey() + 1);
    });
  };

  const handleReassign = () => {
    fetch(`http://localhost:3200/task-tracker/reassign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken()}`,
      },
    }).then(() => {
      setRefreshKey(refreshKey() + 1);
    });
  };

  const handleCreateTask = () => {
    fetch(`http://localhost:3200/task-tracker`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken()}`,
      },
      body: JSON.stringify({
        description: prompt('Enter task description'),
      }),
    }).then(() => {
      setRefreshKey(refreshKey() + 1);
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  let displayedTasks = () =>
    filter()
      ? tasks().filter((task) => task.assignedTo === currentUserID)
      : tasks();

  let button = (type) => {
    if (type === 'default') {
      return `text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800`;
    }
    return '';
  };

  function openTasks() {
    return displayedTasks().filter((task) => task.status === 'open');
  }

  function doneTasks() {
    return displayedTasks().filter((task) => task.status === 'done');
  }

  return (
    <div class="dark:bg-gray-900 h-screen w-screen">
      <Navbar logout={logout} currentUser={currentUser} />
      {jwtToken() ? (
        <>
          <div class="flex pb-4 p-4">
            <button class={button('default')} onClick={handleReassign}>
              Reassign all tasks
            </button>
            <button class={button('default')} onClick={handleCreateTask}>
              Create task
            </button>
            <div class="flex items-center">
              <input
                type="checkbox"
                id="filter"
                onChange={() => setFilter(!filter())}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                for="filter"
                class="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500"
              >
                My tasks
              </label>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="w-[100%] p-4 m-2 bg-gray-100 border border-gray-200 rounded-lg">
              <div class="mb-4">
                <span class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  Open
                </span>
              </div>

              <For each={openTasks()}>
                {(task) => (
                  <TaskCard task={task} handleComplete={handleComplete} />
                )}
              </For>
            </div>
            <div class="w-[100%] p-4 m-2 bg-gray-100 border border-gray-200 rounded-lg">
              <div class="mb-4">
                <span class="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                  Done
                </span>
              </div>

              <For each={doneTasks()}>
                {(task) => (
                  <TaskCard task={task} handleComplete={handleComplete} />
                )}
              </For>
            </div>
          </div>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
};

export default TaskTracker;
