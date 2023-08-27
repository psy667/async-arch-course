export type Event = {
  event_id?: string;
  event_timestamp?: number;
  producer: string;
  event_version: number;
};

export enum UserRoleEnum {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

export type RoleChangedV1Event = Event & {
  event_version: 1;
  event_name: 'auth.role_changed';
  data: {
    user_id: string;
    role: UserRoleEnum;
  };
};

export type UserCreatedV1Event = Event & {
  event_version: 1;
  event_name: 'auth.user_created';
  data: {
    user_id: string;
    email: string;
    name: string;
    role: UserRoleEnum;
  };
};

export type UserUpdatedV1Event = Event & {
  event_version: 1;
  event_name: 'auth.user_updated';
  data: {
    user_id: string;
    email: string;
    name: string;
    role: UserRoleEnum;
  };
};

export enum TaskStatusEnum {
  OPEN = 'open',
  DONE = 'done',
}

export type TaskCreatedV1Event = Event & {
  event_version: 1;
  event_name: 'task_tracker.task_created';
  data: {
    task_id: string;
    task_description: string;
    task_assigned_to: string;
    task_status: TaskStatusEnum;
    task_reward: number;
    task_fee: number;
  };
};

export type TaskUpdatedV1Event = Event & {
  event_version: 1;
  event_name: 'task_tracker.task_updated';
  data: {
    task_id: string;
    task_description: string;
    task_status: TaskStatusEnum;
    task_assigned_to: string;
    task_reward: number;
    task_fee: number;
  };
};

export type TaskAssignedV1Event = Event & {
  event_version: 1;
  event_name: 'task_tracker.task_assigned';
  data: {
    task_id: string;
    assigned_to: string;
  };
};

export type TaskCompletedV1Event = Event & {
  event_version: 1;
  event_name: 'task_tracker.task_completed';
  data: {
    task_id: string;
  };
};

export type TransactionCreatedV1Event = Event & {
  event_version: 1;
  event_name: 'accounting.transaction_created';
  data: {
    transaction_id: string;
    credit: number;
    debit: number;
    billing_cycle: string;
    account_id: string;
    description: string;
  };
};

export type AllEvents =
  | RoleChangedV1Event
  | TaskCreatedV1Event
  | TaskUpdatedV1Event
  | TaskAssignedV1Event
  | TaskCompletedV1Event
  | TransactionCreatedV1Event
  | UserCreatedV1Event
  | UserUpdatedV1Event;

export type EventNames = AllEvents['event_name'];
export type EventNameAndVersion = `${EventNames}.v${number}`;
