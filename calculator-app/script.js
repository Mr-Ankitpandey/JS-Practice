// ==============================
// STATE & STORAGE HELPERS
// ==============================

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
  const favs = getFavorites().filter(fid => fid !== id);
  sessionStorage.setItem('mailApp_favorites', JSON.stringify(favs));
}


function randomDecisionWithLoader() {
  const loader = document.getElementById('loadingMsg');
  loader.style.display = 'block';

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch('https://yesno.wtf/api')
        .then(res => res.json())
        .then(data => {
          loader.style.display = 'none';
          data.answer === 'yes'
            ? resolve()
            : reject('Action rejected by system');
        })
        .catch(() => {
          loader.style.display = 'none';
          reject('Network error');
        });
    }, 1200); // artificial delay
  });
}

// ==============================
// UI HELPERS
// ==============================

function populateSelects() {
  const users = getUsers();
  const fromSelect = document.getElementById('fromSelect');
  const toSelect = document.getElementById('toSelect');
  const forSelect = document.getElementById('forSelect');

  function updateOptions(select, exclude = null) {
    const prev = select.value;
    select.innerHTML = `<option value="${select.id}">Select</option>`;

    users.forEach(user => {
      if (user !== exclude) {
        const opt = document.createElement('option');
        opt.value = user;
        opt.textContent = user;
        select.appendChild(opt);
      }
    });

    if (users.includes(prev)) select.value = prev;
  }

  updateOptions(fromSelect);
  updateOptions(forSelect);

  const fromUser = fromSelect.value !== 'fromSelect' ? fromSelect.value : null;
  updateOptions(toSelect, fromUser);
}

function createRow(mail, isInbox) {
  const tr = document.createElement('tr');
  tr.style.fontWeight = mail.isRead ? 'normal' : 'bold';

  ['from', 'subject', 'message'].forEach(key => {
    const td = document.createElement('td');
    td.textContent = mail[key];
    tr.appendChild(td);
  });

  // Read / Unread
  const tdRead = document.createElement('td');
  const btnRead = document.createElement('button');
  btnRead.textContent = mail.isRead ? 'Unread' : 'Read';
  btnRead.onclick = () => {
    randomDecisionWithLoader()
      .then(() => {
        updateMailReadStatus(mail.id, !mail.isRead);
        renderTables();
      })
      .catch(alert);
  };
  tdRead.appendChild(btnRead);
  tr.appendChild(tdRead);

  // Favourite / Unfavourite
  const tdFav = document.createElement('td');
  const btnFav = document.createElement('button');
  btnFav.textContent = isInbox ? 'Favourite' : 'Unfavourite';
  btnFav.onclick = () => {
    randomDecisionWithLoader()
      .then(() => {
        isInbox ? addFavorite(mail.id) : removeFavorite(mail.id);
        renderTables();
      })
      .catch(alert);
  };
  tdFav.appendChild(btnFav);
  tr.appendChild(tdFav);

  return tr;
}

function renderTables() {
  const currentUser = document.getElementById('forSelect').value;
  const inboxTable = document.getElementById('inboxTable');
  const favTable = document.getElementById('favTable');

  while (inboxTable.rows.length > 1) inboxTable.deleteRow(1);
  favTable.innerHTML = `
    <tr>
      <td>From</td>
      <td>Subject</td>
      <td>Message</td>
      <td>Read/Unread</td>
      <td>Unfavourite</td>
    </tr>
  `;

  if (currentUser === 'forSelect') return;

  const mails = getMails().filter(m => m.to === currentUser);
  const favIds = getFavorites();

  mails.forEach(mail => {
    const row = createRow(mail, !favIds.includes(mail.id));
    favIds.includes(mail.id)
      ? favTable.appendChild(row)
      : inboxTable.appendChild(row);
  });
}

// ==============================
// EVENT HANDLERS
// ==============================

window.addUser = function (e) {
  e.preventDefault();
  const input = document.getElementById('newUserName');
  const name = input.value.trim();
  if (!name) return;

  randomDecisionWithLoader()
    .then(() => {
      if (saveUser(name)) {
        populateSelects();
        input.value = '';
      } else {
        alert('User already exists');
      }
    })
    .catch(alert);
};

document.addEventListener('DOMContentLoaded', () => {
  populateSelects();
  renderTables();

  document.getElementById('fromSelect').addEventListener('change', populateSelects);
  document.getElementById('forSelect').addEventListener('change', renderTables);

  document.getElementById('composeForm').addEventListener('submit', e => {
    e.preventDefault();

    const from = fromSelect.value;
    const to = toSelect.value;
    const subject = subjectInput.value;
    const message = messageInput.value;

    if (from === 'fromSelect' || to === 'toSelect') {
      alert('Please select valid users');
      return;
    }

    const mail = {
      id: Date.now().toString(),
      from,
      to,
      subject,
      message,
      isRead: false
    };

    randomDecisionWithLoader()
      .then(() => {
        saveMail(mail);
        subjectInput.value = '';
        messageInput.value = '';
        if (forSelect.value === to) renderTables();
      })
      .catch(alert);
  });
});
