function addEvent() {
  //define a variable for the collection you want to create in Firestore to populate data
  const name = document.getElementById("nameField").value;
  const notes = document.getElementById("notesField").value;
  const course = document.getElementById("courseField").value;
  const due_date = document.getElementById("dueDateField").value;
  const due_hour = document.getElementById("dueHourField").value;

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;
      currentUser.get().then(async () => {
        await db.collection("events").add({
          name,
          notes,
          course,
          due_date,
          due_hour,
          users: [userID],
        });
        displayEvents();
      });
    } else {
      console.log("no user signed in");
    }
  });
}

const btnAdd = document.querySelector(".btn-add");

function displayEvents() {
  // reset by emptying the parent div
  document.getElementById("verified-events").innerHTML = "";

  let CardTemplate = document.getElementById("CardTemplate");

  db.collection("events")
    .get() //get the events in firestore
    .then((snap) => {
      snap.forEach((doc) => {
        var course = doc.data().course;
        var details = doc.data().due_date;
        var name = doc.data().name;
        let newcard = CardTemplate.content.cloneNode(true); //clones template, points to card

        newcard.querySelector(".card-body").setAttribute("id", doc.id);

        //update title and text and image
        newcard.querySelector(".card-title").innerHTML = course;
        newcard.querySelector(".card-time").innerHTML = details;
        newcard.querySelector(".card-text").innerHTML = name;

        document.getElementById("verified-events").appendChild(newcard); //where the new card gets attached
      });
    });
}

displayEvents();
