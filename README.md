# 📂 MindPad - Ionic Folder & Notes App

MindPad is a simple Ionic Angular application that allows users to create, view, and delete folders.  
Each folder displays a note count and can be opened to explore its contents.
---
## ✨ Features
- Create new folders with a custom name
- Display folder list with note counts
- Delete folders
- Open folder to explore its contents
- Persistent storage using `localStorage`
- Responsive Ionic UI

## 🛠 Tech Stack
- **Ionic Framework** (Angular)
- **TypeScript**
- **LocalStorage** for persistence

## 📂 Project Structure
src/
├── app/
│ ├── folders/ # Folder list & actions
│ ├── explore/ # Folder content view
│ └── ...
├── assets/ # Icons & static files
├── theme/ # Ionic theme variables
└── index.html

How It Works

Add Folder
Tap the floating action button ➡ enter folder name ➡ click OK.
The folder will be added to the list and saved in localStorage.

Delete Folder
Click the trash icon on a folder to remove it from the list.

Open Folder
Tap on a folder to hide the list and open the folder's explore view.
Use the back arrow to return to the list.

🔮 Future Enhancements

Store actual notes inside folders
Search & filter folders
Sync with cloud storage
Dark mode support
