const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todo-list");
const totalTareas = document.querySelector(".total-tareas span");
const completedTareas = document.querySelector(".completed-tareas span");
const remainingTareas = document.querySelector(".remaining-tareas span");
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

if (localStorage.getItem("tareas")) {
    tareas.map((tarea) => {
        createTask(tarea);
    });
}

todoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = this.name;
    const inputValue = input.value;

    if (inputValue != "") {
        const tarea = {
            id: new Date().getTime(),
            name: inputValue,
            isCompleted: false
        };

        tareas.push(tarea);
        localStorage.setItem("tareas", JSON.stringify(tareas));
        createTarea(tarea);
        todoForm.reset();
    }
    input.focus();
});


todoList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-tarea") || e.target.parentElement.classList.contains("remove-tarea")
    ) {
        const tareaId = e.target.closest("li").id;
        removeTarea(tareaId);
    }
});

todoList.addEventListener("input", (e) => {
    const tareaId = e.target.closest("li").id;
    updateTask(tareaId, e.target);
});

todoList.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
    }
});

function createTarea(tarea) {
    const tareaElemento = document.createElement("li");
    tareaElemento.setAttribute("id", tarea.id);
    const tareaElementoMargen = `
    <div class="checkbox-wrapper">
      <input type="checkbox" id="${tarea.name}-${tarea.id}" name="tasks" ${tarea.isCompleted ? "checked" : ""
        }>
      <label for="${tarea.name}-${tarea.id}">
        <svg class="checkbox-empty">
          <use xlink:href="#checkbox_empty"></use>
        </svg>
        <svg class="checkmark">
          <use xlink:href="#checkmark"></use>
        </svg>
      </label>
      <span ${!tarea.isCompleted ? "contenteditable" : ""}>${tarea.name}</span>
    </div>
    <button class="remove-tarea" title="Remove ${tarea.name} task">
      <svg>
        <use xlink:href="#close"></use>
      </svg>
    </button>
  `;
    tareaElemento.innerHTML = tareaElementoMargen;
    todoList.appendChild(tareaElemento);
    countTareas();
}

function removeTarea(tareaId) {
    tareas = tareas.filter((tarea) => tarea.id !== parseInt(tareaId));
    localStorage.setItem("tareas", JSON.stringify(tareas));
    document.getElementById(tareaId).remove();
    countTareas();
}

function updateTask(tareaId, el) {
    const tarea = tareas.find((tarea) => tarea.id === parseInt(tareaId));

    if (el.hasAttribute("contentEditable")) {
        tarea.name = el.textContent;
    } else {
        const span = el.nextElementSibling.nextElementSibling;
        tarea.isCompleted = !tarea.isCompleted;
        if (tarea.isCompleted) {
            span.removeAttribute("contenteditable");
            el.setAttribute("checked", "");
        } else {
            el.removeAttribute("checked");
            span.setAttribute("contenteditable", "");
        }
    }
    localStorage.setItem("tareas", JSON.stringify(tareas));
    countTareas();
}

function countTareas() {
    totalTareas.textContent = tareas.length;
    const completedTareasArray = tareas.filter((tarea) => tarea.isCompleted === true);
    completedTareas.textContent = completedTareasArray.length;
    remainingTareas.textContent = tareas.length - completedTareasArray.length;
}