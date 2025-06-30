let notes = []; //step 1
let editingNoteId = null;

function loadNotes() {
  const savedNotes = localStorage.getItem("quickNotes"); //fetching from the local storage
  return savedNotes ? JSON.parse(savedNotes) : []; //JSON.parse converts json to array
}

//step 6
function saveNote(event) {
  event.preventDefault(); //stops the submit action

  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();

  if (editingNoteId) {
    //Update existing Note

    const noteIndex = notes.findIndex((note) => note.id === editingNoteId);
    notes[noteIndex] = {
      ...notes[noteIndex],
      title: title,
      content: content,
    };
  } else {
    //Add a new note
    notes.unshift({
      id: generateId(),
      title: title,
      content: content,
    });
  }

  closeNoteDialog();
  saveNotes(); //now this takes the submitted content and then adds it to the local dadtabase
  renderNotes(); //so that the page is immediately rendered as u press enter or submit
}

function generateId() {
  return Date.now().toLocaleString();
}

function saveNotes() {
  localStorage.setItem("quickNotes", JSON.stringify(notes)); //now this adds the added notes on the local storage
}

function deleteNote(noteId) {
  notes = notes.filter((note) => note.id != noteId);
  saveNotes();
  renderNotes();
}

//this is to render an UI when no note is on display//
function renderNotes() {
  const notesContainer = document.getElementById("notesContainer");
  if (notesContainer.length === 0) {
    notesContainer.innerHtML = `
    <div class="empty-state">
    <h2> No notes yet</h2>
    <p>Create your first note to get started!</p>
    <button class = "add-note-btn" onclick = "openNoteDialog()">+ Add new note</button>
    </div>
    `;
    return;
  }
  notesContainer.innerHTML = notes //this is if there is an entry in the database
    .map(
      (note) => `
        <div class="note-card">
      <h3 class="note-title">${note.title}</h3>
      <p class="note-content">${note.content}</p>
      <div class="note-actions">
        <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete Note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
          </svg>
        </button>
      </div>

    </div>
        `
    )
    .join("");
}

//Step 2 - we declare openNoteDialog function
function openNoteDialog(noteId = null) {
  const dialog = document.getElementById("noteDialog");
  const titleInput = document.getElementById("noteTitle");
  const contentInput = document.getElementById("noteContent");

  if (noteId) {
    //Edting mode
    const noteToEdit = notes.find((note) => note.id === noteId);
    editingNoteId = noteId;
    document.getElementById("dialogTitle").textContent = "Edit Note";
    titleInput.value = noteToEdit.title;
    contentInput.value = noteToEdit.content;
  } else {
    editingNoteId = null;
    document.getElementById("dialogTitle").textContent = "Add new note";
    titleInput.value = "";
    contentInput.value = "";
  }

  dialog.showModal();
  titleInput.focus();
}
//Step 3 - we declare the closeNoteDialog function;
function closeNoteDialog() {
  document.getElementById("noteDialog").closest();
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  document.getElementById("themeToggleBtn").textContent = isDark ? "☀️" : "🌙";
}

function applyStoredTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    document.getElementById("themeToggleBtn").textContent = "☀️";
  }
}
//Step 4 - we add an EventListener to the DOM so that we can record every interaction, and here we make sure that a click outside the frame of the Dialog closes the dialog
document.addEventListener("DOMContentLoaded", function () {
  applyStoredTheme();
  notes = loadNotes(); // and also for already existing notes to load and for render to work ofc
  renderNotes(); //we can the notes to be rendered as the page loads

  document.getElementById("noteForm").addEventListener("submit", saveNote); //step 5 - we now declare how to save the note - saveNote();
  document.getElementById("noteDialog").addEventListener("click", (event) => {
    if (event.target === this) {
      //this refers to DOMcontent
      closeNoteDialog();
    }
  });
});
