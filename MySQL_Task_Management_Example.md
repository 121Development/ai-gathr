
# MySQL Example for Task Management

## Relational Schema

### Table 1: `tasks`
Stores the main task information.

| Column Name       | Data Type         | Description                          |
|-------------------|-------------------|--------------------------------------|
| `task_id`         | VARCHAR(36)      | Unique identifier for the task.      |
| `title`           | VARCHAR(255)     | The task's concise title.            |
| `description`     | TEXT             | Detailed description of the task.    |
| `status`          | ENUM('pending', 'completed', 'in_progress') | Current task status. |
| `priority`        | ENUM('low', 'medium', 'high') | Task priority level.               |
| `due_date`        | DATETIME         | Deadline for the task.               |
| `created_at`      | DATETIME         | Task creation timestamp.             |
| `updated_at`      | DATETIME         | Last updated timestamp.              |

### Table 2: `categories`
Stores categories for tasks.

| Column Name       | Data Type         | Description                          |
|-------------------|-------------------|--------------------------------------|
| `category_id`     | INT AUTO_INCREMENT | Unique identifier for the category. |
| `task_id`         | VARCHAR(36)      | Foreign key to `tasks.task_id`.      |
| `category_name`   | VARCHAR(255)     | Name of the category.                |

### Table 3: `tags`
Stores tags for easy filtering.

| Column Name       | Data Type         | Description                          |
|-------------------|-------------------|--------------------------------------|
| `tag_id`          | INT AUTO_INCREMENT | Unique identifier for the tag.      |
| `task_id`         | VARCHAR(36)      | Foreign key to `tasks.task_id`.      |
| `tag_name`        | VARCHAR(255)     | Name of the tag.                     |

### Table 4: `contexts`
Stores additional context for tasks.

| Column Name       | Data Type         | Description                          |
|-------------------|-------------------|--------------------------------------|
| `context_id`      | INT AUTO_INCREMENT | Unique identifier for the context.  |
| `task_id`         | VARCHAR(36)      | Foreign key to `tasks.task_id`.      |
| `type`            | ENUM('professional', 'personal') | Context type. |
| `related_name`    | VARCHAR(255)     | Related entity or person name.       |
| `related_org`     | VARCHAR(255)     | Organization name.                   |
| `contact_method`  | VARCHAR(50)      | Contact method (e.g., phone, email). |

### Table 5: `reminders`
Stores task reminders.

| Column Name       | Data Type         | Description                          |
|-------------------|-------------------|--------------------------------------|
| `reminder_id`     | INT AUTO_INCREMENT | Unique identifier for the reminder. |
| `task_id`         | VARCHAR(36)      | Foreign key to `tasks.task_id`.      |
| `reminder_time`   | DATETIME         | When the reminder will occur.        |
| `reminder_type`   | VARCHAR(50)      | Type of reminder (e.g., notification). |

## Example Data

### Insert into `tasks`
```sql
INSERT INTO tasks (task_id, title, description, status, priority, due_date, created_at, updated_at)
VALUES (
    'unique-task-id-123',
    'Call Carl at CNN to schedule a meeting',
    'Reach out to Carl at CNN to arrange a meeting for next week to discuss collaboration opportunities.',
    'pending',
    'medium',
    '2024-01-07 00:00:00',
    '2024-12-30 00:00:00',
    NULL
);
```

### Insert into `categories`
```sql
INSERT INTO categories (task_id, category_name)
VALUES
('unique-task-id-123', 'Life Management'),
('unique-task-id-123', 'Work Tasks'),
('unique-task-id-123', 'Networking'),
('unique-task-id-123', 'Time Management');
```

### Insert into `tags`
```sql
INSERT INTO tags (task_id, tag_name)
VALUES
('unique-task-id-123', 'call'),
('unique-task-id-123', 'meeting'),
('unique-task-id-123', 'work'),
('unique-task-id-123', 'networking');
```

### Insert into `contexts`
```sql
INSERT INTO contexts (task_id, type, related_name, related_org, contact_method)
VALUES
('unique-task-id-123', 'professional', 'Carl', 'CNN', 'phone');
```

### Insert into `reminders`
```sql
INSERT INTO reminders (task_id, reminder_time, reminder_type)
VALUES
('unique-task-id-123', '2024-01-06 10:00:00', 'notification');
```
