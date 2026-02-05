import generatePromise from "./getPromise.js";
import {
  fromSelect,
  toSelect,
  forSelect,
  userForm,
  composeForm,
  subjectInp,
  messageInp,
  inboxTable,
  favTable,
  loader,
} from "./domElements.js";

const getUsers = () => {
  return localStorage?.getItem("mailUsers")
    ? JSON?.parse(localStorage?.getItem("mailUsers"))
    : [];
};

const getMails = () => {
  return JSON?.parse(localStorage?.getItem("allMails") || "{}");
};

const getFavMails = () => {
  return JSON?.parse(sessionStorage?.getItem("favMails") || "{}");
};

const showLoader = () => {
  loader.style.display = "flex";
};

const hideLoader = () => {
  loader.style.display = "none";
};

const saveUser = (newUser) => {
  const users = getUsers();
  let toAdd = true;
  users?.forEach((user) => {
    if (user.name === newUser.name) {
      toAdd = false;
    }
  });
  if (toAdd) {
    users.push(newUser);
    localStorage?.setItem("mailUsers", JSON?.stringify(users));
  }
  return toAdd;
};

const renderOptions = () => {
  const users = getUsers();
  const updateOptions = (selectElement, excludeUser = null) => {
    const currentVal = selectElement?.value;
    selectElement.innerHTML = `<option value=${selectElement?.id}>Select</option>`;
    users?.forEach((user) => {
      if (user.name !== excludeUser) {
        const option = document?.createElement("option");
        option.value = user.name;
        option.textContent = user.name;
        selectElement?.appendChild(option);
      }
      if (
        currentVal &&
        user?.name?.includes(currentVal) &&
        currentVal !== excludeUser
      ) {
        selectElement.value = currentVal;
      }
    });
  };

  const selectedTo = toSelect?.value !== "toSelect" ? toSelect?.value : null;
  updateOptions(fromSelect, selectedTo);

  const selectedFrom =
    fromSelect?.value !== "fromSelect" ? fromSelect?.value : null;
  updateOptions(toSelect, selectedFrom);

  updateOptions(forSelect);
};

const addUser = (event) => {
  event.preventDefault();
  showLoader();
  generatePromise()
    .then(() => {
      const nameInput = document?.getElementById("newUserName");
      const name = nameInput?.value?.trim().toLowerCase();

      const newUser = {
        id: Date.now().toString(),
        name,
      };
      if (newUser) {
        if (saveUser(newUser)) {
          renderOptions();
          nameInput.value = "";
        } else {
          alert("User already exists");
          nameInput.value = "";
        }
      }
      hideLoader();
    })
    .catch((error) => {
      hideLoader();
      alert(`Failed to add User as Promise rejected ${error}`);
    });
};

const sendMail = (event) => {
  event.preventDefault();
  try {
    const formData = new FormData(composeForm);
    const dataObject = Object?.fromEntries(formData?.entries());
    const {
      fromSelect: fromSelectVal,
      toSelect: toSelectVal,
      subject,
      message,
    } = dataObject;

    if (fromSelectVal === "fromSelect" || toSelectVal === "toSelect") {
      alert("Please choose valid values of From and To.");
      return;
    }
    if (subject?.trim() === "" || message?.trim() === "") {
      alert("Fields cannot left blank");
      return;
    }
    showLoader();
    generatePromise()
      .then((res) => {
        const mail = {
          id: Date.now().toString(),
          from: fromSelectVal,
          to: toSelectVal,
          subject: subject?.trim(),
          message: message?.trim(),
          isRead: false,
        };

        const mails = getMails();
        const allUsers = getUsers();
        allUsers.forEach((user) => {
          if (user.name === mail.to) {
            const userRecords = mails[user.id] ? mails[user.id] : [];
            userRecords.push(mail);
            mails[user.id] = userRecords;
            localStorage?.setItem("allMails", JSON.stringify(mails));
          }
        });
        console.log(mails);

        subjectInp.value = "";
        messageInp.value = "";
        fromSelect.selectedIndex = 0;
        toSelect.selectedIndex = 0;
        renderOptions();

        if (toSelectVal === forSelect?.value) {
          renderTable();
        }
        hideLoader();
        console?.info("Mail sent successfully !!", res);
      })
      .catch((error) => {
        hideLoader();
        alert(`Failed to send mail as Promise rejected ${error}`);
      });
  } catch (error) {
    console?.error("Some error while reading form values", error);
  }
};

const readBtnHandler = (id, isRead) => {
  const currentUser = forSelect?.value;
  const mails = getMails();
  const allUsers = getUsers();
  const selectedUserId = allUsers.find((user) => user.name === currentUser);
  console.log(mails);
  showLoader();
  generatePromise()
    .then((res) => {
      const mail = mails[selectedUserId.id]?.find((m) => m?.id === id);
      if (mail) {
        mail.isRead = isRead;
        localStorage?.setItem("allMails", JSON?.stringify(mails));
      }
      hideLoader();
      renderTable();
      console?.info("Opeartion Done !!", res);
    })
    .catch((error) => {
      hideLoader();
      alert(`Read Operation Failed !! ${error}`);
    });
};

const createRow = (mail, isInbox) => {
  const tr = document?.createElement("tr");
  tr.style.fontWeight = mail?.isRead ? "normal" : "bold";

  const tdFrom = document?.createElement("td");
  tdFrom.textContent = mail?.from;
  tr.appendChild(tdFrom);

  const tdSubject = document?.createElement("td");
  tdSubject.textContent = mail?.subject;
  tr.appendChild(tdSubject);

  const tdMessage = document?.createElement("td");
  tdMessage.textContent = mail?.message;
  tr.appendChild(tdMessage);

  const tdRead = document?.createElement("td");
  const btnRead = document?.createElement("button");
  btnRead.textContent = mail?.isRead ? "Unread" : "Read";
  btnRead.onclick = () => {
    readBtnHandler(mail?.id, !mail?.isRead);
  };
  tdRead.appendChild(btnRead);
  tr.appendChild(tdRead);

  const tdFav = document?.createElement("td");
  const btnFav = document?.createElement("button");
  if (isInbox) {
    btnFav.textContent = "Favourite";

    btnFav.onclick = () => {
      showLoader();
      generatePromise()
        .then((res) => {
          const currentUser = forSelect.value;
          const allUsers = getUsers();
          const favs = getFavMails();
          const selectedUser = allUsers.find((u) => u.name === currentUser);

          const userFavs = favs[selectedUser.id] || [];

          if (!userFavs.includes(mail.id)) {
            userFavs.push(mail.id);
          }

          favs[selectedUser.id] = userFavs;
          sessionStorage.setItem("favMails", JSON.stringify(favs));

          hideLoader();
          renderTable();
          console?.info("Added to Favourite !!", res);
        })
        .catch((error) => {
          hideLoader();
          alert(`Favourite Operation Failed !! ${error}`);
        });
    };
  } else {
    btnFav.textContent = "Unfavourite";
    btnFav.onclick = () => {
      showLoader();
      generatePromise()
        .then((res) => {
          const currentUser = forSelect.value;
          const allUsers = getUsers();
          const favs = getFavMails();
          const selectedUser = allUsers.find((u) => u.name === currentUser);
          const userFavs = favs[selectedUser.id] || [];
          favs[selectedUser.id] = userFavs.filter((id) => id !== mail.id);
          sessionStorage.setItem("favMails", JSON.stringify(favs));

          hideLoader();
          renderTable();
          console?.info("Removed from Favourite !!", res);
        })
        .catch((error) => {
          hideLoader();
          alert(`UnFavourite Operation Failed !! ${error}`);
        });
    };
  }
  tdFav.appendChild(btnFav);
  tr.appendChild(tdFav);
  return tr;
};

const renderTable = () => {
  const currentUser = forSelect?.value;
  const allMails = getMails();
  const allUsers = getUsers();
  const selectedUserId = allUsers.find((user) => user.name === currentUser);
  const favmails = getFavMails();
  const userMails = allMails[selectedUserId.id]?.filter(
    (m) => m?.to === currentUser,
  ); // array of all mails of selected user

  while (inboxTable?.rows.length > 1) {
    inboxTable?.deleteRow(1);
  }

  favTable.innerHTML = "";
  const favHeader = document?.createElement("tr");
  favHeader.innerHTML = `
        <td>From</td>
        <td>Subject</td>
        <td>Message</td>
        <td>Read/Unread</td>
        <td>Unfavourite</td>
    `;
  favHeader.style.fontWeight = "bold";
  favTable?.appendChild(favHeader);

  let favCount = 0;
  if (currentUser !== "forSelect") {
    userMails?.forEach((mail) => {
      console.log(mail);

      // const isFav = favmails[mail.id]?.includes(mail?.id);
      const userFavs = favmails[selectedUserId.id] || [];
      const isFav = userFavs.includes(mail.id);

      if (isFav) {
        const row = createRow(mail, false);
        favTable?.appendChild(row);
        favCount++;
      } else {
        const row = createRow(mail, true);
        inboxTable?.appendChild(row);
      }
    });
  }
  if (favCount === 0) favTable.innerHTML = "";
};

//render all the options initially in all select elements
renderOptions();

userForm.onsubmit = (event) => addUser(event);
composeForm.onsubmit = (event) => sendMail(event);
fromSelect.onchange = (event) => renderOptions(event);
toSelect.onchange = (event) => renderOptions(event);
forSelect.onchange = (event) => renderTable(event);
