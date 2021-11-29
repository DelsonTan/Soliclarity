function addEvent() {
  const courseFieldSelect = document.getElementById("courseField");

  //define a variable for the collection you want to create in Firestore to populate data
  const name = document.getElementById("nameField").value;
  const notes = document.getElementById("notesField").value;
  const course_id = courseFieldSelect.value;
  const course_name = courseFieldSelect.options[courseFieldSelect.selectedIndex].text;
  const due_date = document.getElementById("dueDateField").value;
  const due_hour = document.getElementById("dueHourField").value;

  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      userDocs = await db
        .collection("users")
        .where("courses", "array-contains", course_id)
        .get();

      const eventRef = await db.collection("events").add({
        name,
        notes,
        course_id,
        course_name,
        due_date,
        due_hour,
        users: userDocs.docs.map((userDoc) => userDoc.id),
      });

      
      userDocs.forEach(async (userDoc) => {
        const currentUser = await db.collection("users").doc(userDoc.id)
        if (userDoc.id !== user.uid) {
          currentUser.update({
            events: [...userDoc.data().events, {
              [eventRef.id]: "unverified"
            }]
          })
        } else {
          currentUser.update({
            events: [...userDoc.data().events, {
              [eventRef.id]: "verified"
            }]
          })
        }
      });
      displayEvents();
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
        console.log(doc.data());
        var courseName = doc.data().course_name;
        var details = doc.data().due_date;
        var name = doc.data().name;
        var hour = doc.data().due_hour;
        var notes = doc.data().notes;
        let newcard = CardTemplate.content.cloneNode(true); //clones template, points to card

        newcard.querySelector(".edit-event").setAttribute("id", doc.id);

        //update title and text and image
        newcard.querySelector(".card-title").innerHTML = courseName;
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

function getCourseData() {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const courseField = document.getElementById("courseField");

      courseField.innerHTML = "";

      db.collection("courses")
        .where("users", "array-contains", user.uid)
        .get()
        .then((courseDocs) => {
          courseDocs.forEach((courseDoc) => {
            const option = document.createElement("option");
            option.innerHTML = courseDoc.data().name;
            option.setAttribute("value", courseDoc.id);

            courseField.appendChild(option);
          });
          console.log(document.getElementById("courseField").value);
        });
    } else {
      console.log("No user signed in.");
    }
  });
}

const createEventModal = document.getElementById("ModalCreate");

createEventModal.addEventListener("show.bs.modal", () => getCourseData());

function editEvent() {
  //Enable the form fields
  //console.log("edit is clicked");
  document.getElementById("personalInfoFields").disabled = false; //make all of the buttons and fields activated (not disabled)
}
