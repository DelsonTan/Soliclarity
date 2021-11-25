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
      currentUser.get().then(async (userDoc) => {
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
  document.getElementById("events-go-here").innerHTML = "";

  let CardTemplate = document.getElementById("CardTemplate");

  db.collection("events")
    .get() //get the events in firestore
    .then((snap) => {
      snap.forEach((doc) => {
        var course = doc.data().course;
        var details = doc.data().due_date;
        var name = doc.data().name;
        var hour = doc.data().due_hour;
        var notes = doc.data().notes;
        let newcard = CardTemplate.content.cloneNode(true); //clones template, points to card

        newcard.querySelector(".edit-event").setAttribute("id", doc.id);

        //update title and text and image
        newcard.querySelector(".card-title").innerHTML = course;
        newcard.querySelector(".card-time").innerHTML = details;
        newcard.querySelector(".card-text").innerHTML = name;

        // document.getElementById("nameFieldEdit").value = name;
        // console.log(name);
        // document.getElementById("dueDateFieldEdit").value = details;
        // document.getElementById("courseFieldEdit").value = course;
        // document.getElementById("dueHourFieldEdit").value = hour;
        // document.getElementById("notesFieldEdit").value = notes;

        //attach to gallery "events-go-here"
        document.getElementById("events-go-here").appendChild(newcard); //where the new card gets attached
      });
    });
}
displayEvents();

function getEventData(eventId) {
  db.collection("events")
    .doc(eventId)
    .get()
    .then((eventDoc) => {
      const eventData = eventDoc.data();
      const { name, course, due_date, due_hour, notes } = eventData;

      if (name != null) {
        document.getElementById("nameFieldEdit").value = name;
      }
      document.getElementById("dueDateFieldEdit").innerHTML = due_date;
      document.getElementById("courseFieldEdit").value = course;
      document.getElementById("dueHourFieldEdit").value = due_hour;
      document.getElementById("notesFieldEdit").value = notes;
    });
}

$(document).on("click", ".edit-event", function () {
  getEventData($(this).attr("id"));
});

function editEvent() {
  //Enable the form fields
  //console.log("edit is clicked");
  document.getElementById("personalInfoFields").disabled = false; //make all of the buttons and fields activated (not disabled)
}
