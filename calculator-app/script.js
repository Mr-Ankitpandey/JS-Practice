// --- State and Storage Helpers ---

function getUsers() {
    return JSON.parse(localStorage.getItem('mailApp_users') || '[]');
}

function saveUser(name) {
    const users = getUsers();
    if (!users.includes(name)) {
        users.push(name);
        localStorage.setItem('mailApp_users', JSON.stringify(users));
        return true;
    }
    return false;
}

function getMails() {
    return JSON.parse(localStorage.getItem('mailApp_mails') || '[]');
}

function saveMail(mail) {
    const mails = getMails();
    mails.push(mail);
    localStorage.setItem('mailApp_mails', JSON.stringify(mails));
}

function updateMailReadStatus(id, isRead) {
    const mails = getMails();
    const mail = mails.find(m => m.id === id);
    if (mail) {
        mail.isRead = isRead;
        localStorage.setItem('mailApp_mails', JSON.stringify(mails));
    }
}

function getFavorites() {
    return JSON.parse(sessionStorage.getItem('mailApp_favorites') || '[]');
}

function addFavorite(id) {
    const favs = getFavorites();
    if (!favs.includes(id)) {
        favs.push(id);
        sessionStorage.setItem('mailApp_favorites', JSON.stringify(favs));
    }
}

function removeFavorite(id) {
    let favs = getFavorites();
    favs = favs.filter(favId => favId !== id);
    sessionStorage.setItem('mailApp_favorites', JSON.stringify(favs));
}

// --- UI Helpers ---

function populateSelects() {
    const users = getUsers();
    const fromSelect = document.getElementById('fromSelect');
    const toSelect = document.getElementById('toSelect');
    const forSelect = document.getElementById('forSelect');

    // Helper to generic populate
    const updateOptions = (selectElement, excludeUser = null) => {
        const currentVal = selectElement.value;
        // Keep the first "Select" option
        selectElement.innerHTML = `<option value="${selectElement.id}">Select</option>`;
        
        users.forEach(user => {
            if (user !== excludeUser) {
                const option = document.createElement('option');
                option.value = user;
                option.textContent = user;
                selectElement.appendChild(option);
            }
        });

        // Try to restore value
        if (currentVal && users.includes(currentVal) && currentVal !== excludeUser) {
            selectElement.value = currentVal;
        }
    };

    updateOptions(fromSelect);
    updateOptions(forSelect);
    
    // Logic for To Select (exclude From)
    const selectedFrom = fromSelect.value;
    const realSelectedFrom = (selectedFrom !== 'fromSelect') ? selectedFrom : null;
    updateOptions(toSelect, realSelectedFrom);
}

function createRow(mail, isInbox) {
    const tr = document.createElement('tr');
    
    // Bold if unread
    tr.style.fontWeight = mail.isRead ? 'normal' : 'bold';

    // From
    const tdFrom = document.createElement('td');
    tdFrom.textContent = mail.from;
    tr.appendChild(tdFrom);

    // Subject
    const tdSubject = document.createElement('td');
    tdSubject.textContent = mail.subject;
    tr.appendChild(tdSubject);

    // Message
    const tdMessage = document.createElement('td');
    tdMessage.textContent = mail.message;
    tr.appendChild(tdMessage);

    // Read/Unread Button Logic
    const tdRead = document.createElement('td');
    const btnRead = document.createElement('button');
    // Button text: if read -> 'Unread', if unread -> 'Read'
    btnRead.textContent = mail.isRead ? 'Unread' : 'Read';
    btnRead.onclick = () => {
        // Toggle status: true -> false, false -> true
        updateMailReadStatus(mail.id, !mail.isRead);
        renderTables();
    };
    tdRead.appendChild(btnRead);
    tr.appendChild(tdRead);

    // Fav/Unfav
    const tdFav = document.createElement('td');
    const btnFav = document.createElement('button');
    if (isInbox) {
        btnFav.textContent = 'Favourite';
        btnFav.onclick = () => {
            addFavorite(mail.id);
            renderTables();
        };
    } else {
        btnFav.textContent = 'Unfavourite';
        btnFav.onclick = () => {
            removeFavorite(mail.id);
            renderTables();
        };
    }
    tdFav.appendChild(btnFav);
    tr.appendChild(tdFav);

    return tr;
}

function renderTables() {
    const currentUser = document.getElementById('forSelect').value;
    // Check if a valid user is selected (ignore default 'forSelect' value)
    if (currentUser === 'forSelect') {
         // Optionally clear tables if no user selected
         // But we should clean up the tables appropriately regardless
    }

    const allMails = getMails();
    const favIds = getFavorites();
    const userMails = allMails.filter(m => m.to === currentUser);

    // Inbox Table
    const inboxTable = document.getElementById('inboxTable');
    // Keep header (row 0), remove others
    while (inboxTable.rows.length > 1) {
        inboxTable.deleteRow(1);
    }
    
    // Fav Table
    const favTable = document.getElementById('favTable');
    favTable.innerHTML = ''; // Clear completely
    // Re-add Header for Fav Table
    const favHeader = document.createElement('tr');
    favHeader.innerHTML = `
        <td>From</td>
        <td>Subject</td>
        <td>Message</td>
        <td>Read/Unread</td>
        <td>Unfavourite</td>
    `;
    favTable.appendChild(favHeader);


    if (currentUser !== 'forSelect') {
        userMails.forEach(mail => {
            const isFav = favIds.includes(mail.id);
            if (isFav) {
                const row = createRow(mail, false);
                favTable.appendChild(row);
            } else {
                const row = createRow(mail, true);
                inboxTable.appendChild(row);
            }
        });
    }
}

// --- Event Handlers matching HTML ---

// Global addUser for onsubmit="addUser(event)"
window.addUser = function(event) {
    event.preventDefault();
    const nameInput = document.getElementById('newUserName');
    const name = nameInput.value.trim();
    if (name) {
        if (saveUser(name)) {
            populateSelects();
            nameInput.value = '';
        } else {
            alert('User already exists!');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    populateSelects();
    renderTables();

    // Listeners
    document.getElementById('fromSelect').addEventListener('change', populateSelects);
    document.getElementById('forSelect').addEventListener('change', renderTables);

    // Send Form Submission
    const composeForm = document.getElementById('composeForm');
    composeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const fromVal = document.getElementById('fromSelect').value;
        const toVal = document.getElementById('toSelect').value;
        const subject = document.getElementById('subjectInput').value;
        const message = document.getElementById('messageInput').value;

        if (fromVal === 'fromSelect' || toVal === 'toSelect') {
            alert('Please select valid From and To users.');
            return;
        }

        const newMail = {
            id: Date.now().toString(),
            from: fromVal,
            to: toVal,
            subject,
            message,
            isRead: false
        };

        saveMail(newMail);
        
        // Reset form
        document.getElementById('subjectInput').value = '';
        document.getElementById('messageInput').value = '';
        
        // Update view if needed
        const currentFor = document.getElementById('forSelect').value;
        if (currentFor === toVal) {
            renderTables();
        }
    });
});
