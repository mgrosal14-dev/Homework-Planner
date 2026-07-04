// ---------- Elements ----------
const totalCount =document.getElementById("totalCount");
const completedCount =document.getElementById("completedCount");
const remainingCount =document.getElementById("remainingCount");
const filterSelect =document.getElementById("filterSelect");

const sortBtn =document.getElementById("sortBtn");
const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const dateInput = document.getElementById("dateInput");

const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const progress = document.getElementById("progress");
const themeBtn = document.getElementById("themeBtn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const emptyMessage = document.getElementById("emptyMessage");

// ---------- Variables ----------
let homework = JSON.parse(localStorage.getItem("homework")) || [];
let editingIndex = -1;

// ---------- Start ----------
loadTheme();
renderHomework();

// ---------- Events ----------
addBtn.addEventListener("click", addHomework);
searchInput.addEventListener("input", renderHomework);
themeBtn.addEventListener("click", toggleTheme);
clearCompletedBtn.addEventListener("click", clearCompleted);
filterSelect.addEventListener("change",renderHomework);
sortBtn.addEventListener("click",sortHomework);

// ---------- Functions ----------

function addHomework() {

    const task = taskInput.value.trim();
    const subject = subjectInput.value.trim();
    const date = dateInput.value;

    if (!task || !subject || !date) {
        alert("Please fill in all fields.");
        return;
    }

    if (editingIndex === -1) {

        homework.push({
            task,
            subject,
            date,
            completed: false
        });

    } else {

        homework[editingIndex].task = task;
        homework[editingIndex].subject = subject;
        homework[editingIndex].date = date;

        editingIndex = -1;
        addBtn.textContent = "➕ Add Homework";

    }

    saveHomework();
    clearInputs();
    renderHomework();

}

function clearInputs() {

    taskInput.value = "";
    subjectInput.value = "";
    dateInput.value = "";

}

function saveHomework() {

    localStorage.setItem(
        "homework",
        JSON.stringify(homework)
    );

}

function loadTheme() {

    const theme = localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add("dark");
        themeBtn.textContent = "☀ Light Mode";

    }

}

function toggleTheme() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");
        themeBtn.textContent = "☀ Light Mode";

    } else {

        localStorage.setItem("theme", "light");
        themeBtn.textContent = "🌙 Dark Mode";

    }

}

function renderHomework() {

    taskList.innerHTML = "";

    const search = searchInput.value.toLowerCase();

    const filter = filterSelect.value;

    const filteredHomework = homework.filter(item => {

        const matchesSearch =
            item.task.toLowerCase().includes(search) ||
            item.subject.toLowerCase().includes(search);

        if (filter === "active") {
            return matchesSearch && !item.completed;
        }

        if (filter === "completed") {
            return matchesSearch && item.completed;
        }

        return matchesSearch;

    });

    if (homework.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    filteredHomework.forEach((item) => {

        const index = homework.indexOf(item);

        const li = document.createElement("li");

        if (item.completed) {
            li.classList.add("completed");
        }

        if (editingIndex === index) {
            li.classList.add("editing");
        }

        const today = new Date().toISOString().split("T")[0];

        if (!item.completed && item.date < today) {
            li.style.borderLeft = "6px solid red";
        }

        li.innerHTML = `
            <h3>${item.task}</h3>

            <span class="badge">
                ${item.subject}
            </span>

            <p class="date">
                📅 ${item.date}
            </p>

            <div class="buttons">

                <button class="completeBtn">
                    ${item.completed ? "↩ Undo" : "✅ Complete"}
                </button>

                <button class="editBtn">
                    ✏ Edit
                </button>

                <button class="deleteBtn">
                    🗑 Delete
                </button>

            </div>
        `;

        const completeBtn = li.querySelector(".completeBtn");
        const editBtn = li.querySelector(".editBtn");
        const deleteBtn = li.querySelector(".deleteBtn");

        completeBtn.addEventListener("click", () => {

            homework[index].completed = !homework[index].completed;

            saveHomework();
            renderHomework();

        });

        editBtn.addEventListener("click", () => {

            taskInput.value = item.task;
            subjectInput.value = item.subject;
            dateInput.value = item.date;

            editingIndex = index;

            addBtn.textContent = "💾 Save Homework";

            renderHomework();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

        deleteBtn.addEventListener("click", () => {

            if (confirm("Delete this homework?")) {

                homework.splice(index, 1);

                if (editingIndex === index) {
                    editingIndex = -1;
                    addBtn.textContent = "➕ Add Homework";
                    clearInputs();
                }

                saveHomework();
                renderHomework();

            }

        });

        taskList.appendChild(li);

    });

    const completed = homework.filter(item => item.completed).length;

    const remaining =
    homework.length-completed;

    totalCount.textContent =
    homework.length;

    completedCount.textContent =
    completed;

    remainingCount.textContent =
    remaining;

    const remaining =
    homework.length - completed;

    progress.textContent =
    `📚 Total: ${homework.length}
    | ✅ Completed: ${completed}
    | 📝 Remaining: ${remaining}`;
}

function clearCompleted() {

    const completedTasks = homework.filter(item => item.completed);

    if (completedTasks.length === 0) {
        alert("There are no completed homework items.");
        return;
    }

    if (confirm("Clear all completed homework?")) {

        homework = homework.filter(item => !item.completed);

        saveHomework();
        renderHomework();

    }

}

taskInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        addHomework();
    }

});

subjectInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        addHomework();
    }

});

if (!Array.isArray(homework)) {

    homework = [];
    saveHomework();

}

renderHomework()

function sortHomework() {

    homework.sort((a, b) => {

        if (a.date > b.date) return 1;
        if (a.date < b.date) return -1;
        return 0;

    });

    saveHomework();

    renderHomework();

}