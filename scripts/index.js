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
        date: new Date(due_date + " " + due_hour).getTime(),
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

// Accepts a Date object and returns the string representation of the countdown timer.
function getCountdown(date) {
  console.log(date)
  if(!date) {
    return "--d --h --m --s";
  }
  const now = Date.now();
  const timeDiff = date - now;

  if (timeDiff > 0) {
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
    return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  } else {
    return "0d 0h 0m 0s";
  }
}

// displayVerifiedEvents could grab events by doing user.events.filter((event) => event.status === "verified"
// displayUnverifiedEvents could grab events by doing user.events.filter((event) => event.status === "unverified"
// displayCompletedEvents could grab events by doing user.events.filter((event) => event.status === "completed"


function displayEvents() {
  // reset by emptying the parent div
  document.getElementById("events-go-here").innerHTML = "";

  let CardTemplate = document.getElementById("CardTemplate");

  
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const userDoc = await db.collection("users").doc(user.uid).get()
      const userEvents = userDoc.data().events;

      const getEventQueries= userEvents.map((event) => db.collection("events").doc(Object.keys(event)[0]).get());

      const eventDocs = await Promise.all(getEventQueries);
      
      eventDocs.forEach((doc) => {
        var courseName = doc.data().course_name || "No Course";
        var countdown = getCountdown(doc.data().date);
        var name = doc.data().name || "Untitled";
        let newcard = CardTemplate.content.cloneNode(true);
  
        newcard.querySelector(".edit-event").setAttribute("id", doc.id);
  
        //update title and text and image
        newcard.querySelector(".card-title").innerHTML = courseName;
        newcard.querySelector(".card-time").innerHTML = countdown;
        newcard.querySelector(".card-text").innerHTML = name;
  
        //attach to gallery "events-go-here"
        document.getElementById("events-go-here").appendChild(newcard);
      });
    } else {
      console.log("no user signed in");
    }
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
