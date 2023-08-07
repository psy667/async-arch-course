# API
## Auth
### `command:login(beak)`
- check if user exists
- return user

## TaskTracker
 ### `command:create_task(description)` @user
- assign task to random user
> publish `event:tasktracker/task_created(Task)`
  
### `command:complete_task(task_id)` @user
- mark task as completed
> publish `event:tasktracker/task_completed(Task)`

### `command:reassign_tasks` @admin
- for each task
    - assign task to random user
    > publish `event:tasktracker/task_reassigned(Task)`

### `event:accounting/task_reward_calculated(TaskReward)`
- update Task entity


### `query:get_my_tasks` @user

### `query:get_all_tasks` @admin

### `query:get_task(task_id)` @user
- get task reward
> query `query:get_task_reward(task_id)`

## Accounting
### `event:tasktracker/task_created(Task)`
- calulate price and reward
- create TaskReward entity
> publish `event:accounting/task_reward_calculated(TaskReward)`

### `event:tasktracker/task_reassigned(Task)`
- charge user
> publish `event:accounting/balance_debited(TaskReward)`

### `event:tasktracker/task_completed(Task)`
- credit user
> publish `event:accounting/balance_credited(TaskReward)`

### `cron:withdraw_payouts`
- for each user
    - get user balance
    - if balance > 0
        - create Payout entity
        - debit user
        > publish `event:accounting/payout_withdrawn(Payout)`

## Analytics
### `event:accounting/balance_debited(TaskReward)`
- create analytics record

### `event:accounting/balance_credited(TaskReward)`
- create analytics record

### `query:get_analytics`
- return analytics records

