// 1. Global Variables
let currentTask = null; // Stores the currently selected task for editing.
const commentsMap = new Map(); // Stores comments for each task.
const descriptionMap = new Map(); // Stores descriptions for each task.


// 2. Drag and Drop Functionality
// Adds the "dragging" class when a task starts being dragged.
document.addEventListener("dragstart", (event) => {
    if (event.target.classList.contains("add-Task")) {
        event.target.classList.add("dragging");
    }
});

// Removes the "dragging" class when a task stops being dragged.
document.addEventListener("dragend", (event) => {
    if (event.target.classList.contains("add-Task")) {
        event.target.classList.remove("dragging");
    }
});

// Allows tasks to be moved between different columns.
document.addEventListener("dragover", (event) => {
    event.preventDefault();
    const draggingTask = document.querySelector(".dragging");
    if (!draggingTask) return;

    // Find the closest task or column where we can drop
    const closestTask = event.target.closest(".add-Task"); 
    const column = event.target.closest(".column");

    if (closestTask && closestTask !== draggingTask) {
        const bounding = closestTask.getBoundingClientRect();
        const offset = event.clientY - bounding.top;

        if (offset > bounding.height / 2) {
            closestTask.parentNode.insertBefore(draggingTask, closestTask.nextSibling);
        } else {
            closestTask.parentNode.insertBefore(draggingTask, closestTask);
        }
    } else if (column && !event.target.classList.contains("add-Task")) {
        column.querySelector(".add-Task-Container").appendChild(draggingTask);
    }
});


// 3. Modal Elements
const modal = document.getElementById("cardModal"); // The modal window element.
const closeModal = document.querySelector(".close-modal"); // The close button in the modal.
const modalCardText = document.getElementById("modalCardText"); // The input field for editing task text.
const saveChanges = document.getElementById("saveCardChanges"); // The save button in the modal.
let currentTaskTextElement; // Stores the selected task’s text for modification.

// 4. Function to Add Edit Button to a Task
function addEditFunctionality(taskElement) {
    // Remove existing edit button if any
    const existingEditBtn = taskElement.querySelector(".edit-btn");
    if (existingEditBtn) {
        existingEditBtn.remove();
    }
    
    let editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.innerHTML = "✎";
    
    editBtn.addEventListener("click", () => {
        currentTask = taskElement;
        currentTaskTextElement = taskElement.querySelector(".task-text");
        
        modalCardText.value = currentTaskTextElement.innerText;
        document.getElementById("description").value = descriptionMap.get(currentTask) || "";
        
        const commentsContainer = document.querySelector(".comments-container");
        commentsContainer.innerHTML = "";
        (commentsMap.get(currentTask) || []).forEach(comment => {
            const commentElement = document.createElement("div");
            commentElement.className = "comment-item";
            commentElement.textContent = comment;
            commentsContainer.appendChild(commentElement);
        });
        
        modal.style.display = "block";
    });
    
    taskElement.appendChild(editBtn);
}

// 5. Adding New Task Functionality
document.querySelectorAll(".add-Task").forEach(button => {
    button.addEventListener("click", () => {
        const taskContainer = button.previousElementSibling;

        const input = document.createElement("input");
        input.className = "new-task-input";
        input.placeholder = "Enter task title...";
        button.parentElement.appendChild(input);
        input.focus();

        input.addEventListener("keypress", e => {
            if (e.key === "Enter" && input.value.trim()) {
                const newTask = document.createElement("div");
                newTask.className = "add-Task";
                newTask.draggable = true;

                // Get current date
                const date = new Date();
                const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

                newTask.innerHTML = `
                    <div class="task-container">
                        <input type="checkbox" class="task-checkbox">
                        <span class="task-text">${input.value}</span>
                        <div class="task-date"> ${formattedDate}</div>
                    </div>`;

                // Add event listener for checkbox
                newTask.querySelector(".task-checkbox").addEventListener("change", function() {
                    newTask.classList.toggle("checked", this.checked);
                });

                // Add edit functionality
                addEditFunctionality(newTask);

                taskContainer.appendChild(newTask);
                input.remove();
            }
        });
    });
});




function createNewTask(taskText, container) {
    const newTask = document.createElement("div");
    newTask.className = "add-Task";
    newTask.draggable = true;

    // Get current date
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    newTask.innerHTML = `
        <div class="task-container">
            <input type="checkbox" class="task-checkbox">
            <span class="task-text">${taskText}</span>
            <div class="task-date">${formattedDate}</div>
            <button class="edit-btn">✎</button>
        </div>`;

    // Add event listener for checkbox
    newTask.querySelector(".task-checkbox").addEventListener("change", function() {
        newTask.classList.toggle("checked", this.checked);
    });
    
    // Add edit functionality
    addEditFunctionality(newTask);
    container.appendChild(newTask);
}

// 6. Closing the Modal Window
closeModal.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

// 7. Saving Changes to a Task
saveChanges.onclick = () => {
    if (currentTaskTextElement) {
        currentTaskTextElement.innerText = modalCardText.value;
        descriptionMap.set(currentTask, document.getElementById("description").value);
        modal.style.display = "none";
    }
};

// 8. Adding Comments
document.getElementById("addcomment").addEventListener("click", addComment);
document.getElementById("comment").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        addComment();
    }
});

function addComment() {
    const commentText = document.getElementById("comment").value.trim();
    if (!commentText || !currentTask) return;
    
    // Store comment
    const comments = commentsMap.get(currentTask) || [];
    comments.push(commentText);
    commentsMap.set(currentTask, comments);
    
    // Create comment element
    const commentElement = document.createElement("div");
    commentElement.className = "comment-item";
    commentElement.textContent = commentText;
    
    // Add to comments container
    document.querySelector(".comments-container").appendChild(commentElement);
    
    // Clear input
    document.getElementById("comment").value = "";
}

// 9. Adding New Board Functionality
document.getElementById("Addboardbtn").addEventListener("click", () => {
    const boardContainer = document.getElementById("BoardContainer");
    const newBoard = document.createElement("div");
    newBoard.className = "column";
    newBoard.innerHTML = `
        <h2 contenteditable="true">New Board</h2>
        <div class="add-Task-Container"></div>
        <div class="add-Task">+ Add a Task</div>
    `;
    
    boardContainer.appendChild(newBoard);
    setupNewBoard(newBoard);
});

// 10. Setting Up New Board Functionality
function setupNewBoard(board) {
    board.querySelector(".add-Task").addEventListener("click", () => {
        
        const taskContainer = board.querySelector(".add-Task-Container");
        if (!taskContainer) return;
        
        const input = document.createElement("input");
        input.className = "new-Task-input";
        input.placeholder = "Enter task title...";
        board.appendChild(input);
        input.focus();
        
        input.addEventListener("keypress", e => {
            if (e.key === "Enter" && input.value.trim()) {
                createNewTask(input.value, board);
                input.remove();
            }
        });
    });
}
