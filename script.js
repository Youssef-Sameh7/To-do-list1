/* =========================================
Elements
========================================= */

const taskForm = document.getElementById("taskForm");

const taskName = document.getElementById("taskName");

const taskDate = document.getElementById("taskDate");

const tasksList = document.getElementById("tasksList");

const emptyMessage = document.getElementById("emptyMessage");

const taskCount = document.getElementById("taskCount");

const filter = document.getElementById("filter");

/* =========================================
Load Tasks
========================================= */

let tasks =
JSON.parse(localStorage.getItem("tasks")) || [];

/* =========================================
Set Minimum Date
========================================= */

const today =
new Date().toISOString().split("T")[0];

taskDate.min = today;

/* =========================================
Save Tasks
========================================= */

function saveTasks() {

localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
);

}

/* =========================================
Get Status
========================================= */

function getStatus(task) {

if (task.completed) {

    return "completed";
}


const currentDate = new Date();

currentDate.setHours(0, 0, 0, 0);


const dueDate = new Date(task.date);

dueDate.setHours(0, 0, 0, 0);


if (dueDate < currentDate) {

    return "overdue";
}


return "pending";

}

/* =========================================
Status Text
========================================= */

function getStatusText(status) {

if (status === "completed") {

    return "Completed";
}


if (status === "overdue") {

    return "Overdue";
}


return "Pending";

}

/* =========================================
Format Date
========================================= */

function formatDate(date) {

return new Date(date).toLocaleDateString(
    "en-US",
    {
        day: "numeric",
        month: "short",
        year: "numeric"
    }
);

}

/* =========================================
Add Task
========================================= */

taskForm.addEventListener(
"submit",
function (event) {

    event.preventDefault();


    const title =
        taskName.value.trim();

    const date =
        taskDate.value;


    /* Required Task */

    if (title === "") {

        alert("Please enter a task.");

        taskName.focus();

        return;
    }


    /* Required Date */

    if (date === "") {

        alert("Please select a due date.");

        taskDate.focus();

        return;
    }


    /* Create Task */

    const newTask = {

        id: Date.now(),

        title: title,

        date: date,

        completed: false
    };


    tasks.push(newTask);


    saveTasks();

    renderTasks();


    /* Clear Form */

    taskForm.reset();

    taskDate.min = today;

    taskName.focus();
}

);

/* =========================================
Render Tasks
========================================= */

function renderTasks() {

tasksList.innerHTML = "";


const selectedFilter =
    filter.value;


let filteredTasks =
    tasks.filter(function (task) {

        const status =
            getStatus(task);


        if (selectedFilter === "all") {

            return true;
        }


        return status === selectedFilter;

    });


/* Sort by Date */

filteredTasks.sort(function (a, b) {

    return new Date(a.date) -
        new Date(b.date);

});


/* Empty */

if (filteredTasks.length === 0) {

    emptyMessage.style.display = "block";

} else {

    emptyMessage.style.display = "none";
}


/* Create Cards */

filteredTasks.forEach(function (task) {

    const status =
        getStatus(task);


    const card =
        document.createElement("div");


    card.className =
        `task-card ${status}`;


    card.innerHTML = `

        <div class="task-info">

            <h3 class="task-title">
                ${escapeHTML(task.title)}
            </h3>

            <p class="task-date">
                📅 Due: ${formatDate(task.date)}
            </p>

        </div>


        <span class="status ${status}">
            ${getStatusText(status)}
        </span>


        <div class="actions">

            <button
                class="complete"
                data-id="${task.id}"
                title="Complete"
            >
                ✓
            </button>


            <button
                class="edit"
                data-id="${task.id}"
                title="Edit"
            >
                ✎
            </button>


            <button
                class="delete"
                data-id="${task.id}"
                title="Delete"
            >
                🗑
            </button>

        </div>

    `;


    tasksList.appendChild(card);
});


updateCounter();

}

/* =========================================
Task Actions
========================================= */

tasksList.addEventListener(
"click",
function (event) {

    const button =
        event.target.closest("button");


    if (!button) {

        return;
    }


    const id =
        Number(button.dataset.id);


    const task =
        tasks.find(function (item) {

            return item.id === id;

        });


    if (!task) {

        return;
    }


    /* Complete */

    if (
        button.classList.contains("complete")
    ) {

        task.completed =
            !task.completed;

        saveTasks();

        renderTasks();

        return;
    }


    /* Edit */

    if (
        button.classList.contains("edit")
    ) {

        const newTitle =
            prompt(
                "Enter the new task name:",
                task.title
            );


        if (
            newTitle !== null &&
            newTitle.trim() !== ""
        ) {

            task.title =
                newTitle.trim();

            saveTasks();

            renderTasks();
        }


        return;
    }


    /* Delete */

    if (
        button.classList.contains("delete")
    ) {

        const confirmDelete =
            confirm(
                "Are you sure you want to delete this task?"
            );


        if (confirmDelete) {

            tasks =
                tasks.filter(function (item) {

                    return item.id !== id;

                });


            saveTasks();

            renderTasks();
        }
    }

}

);

/* =========================================
Filter
========================================= */

filter.addEventListener(
"change",
renderTasks
);

/* =========================================
Counter
========================================= */

function updateCounter() {

const count =
    tasks.length;


taskCount.textContent =
    `${count} ${count === 1 ? "Task" : "Tasks"}`;

}

/* =========================================
Escape HTML
========================================= */

function escapeHTML(text) {

const element =
    document.createElement("div");

element.textContent = text;

return element.innerHTML;

}

/* =========================================
Start App
========================================= */

renderTasks();