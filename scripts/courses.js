function generateCourseCode() {
  let code = "";
  const codeLength = 8;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < codeLength; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

$(document).on("click", "#open-create-course", function () {
  const code = generateCourseCode();
  $("#new-course-code").val(code);
});

function createCourse() {
  //define a variable for the collection you want to create in Firestore to populate data
  const name = document.getElementById("new-course-name").value;
  const code = document.getElementById("new-course-code").value;
  const location = document.getElementById("new-course-location").value;
  const startTime = document.getElementById("new-course-start-time").value;
  const endtime = document.getElementById("new-course-end-time").value;
  const zoomlink = document.getElementById("new-course-zoom-link").value;

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const currentUser = db.collection("users").doc(user.uid);

      currentUser.get().then(async (userDoc) => {
        const courseRef = await db.collection("courses").add({
          name,
          code,
          location,
          startTime,
          endtime,
          users: [user.uid],
        });
        await currentUser.set({
          courses: [...userDoc.data().courses, courseRef.id],
        });
        displayCourses();
      });
    } else {
      console.log("no user signed in");
    }
  });
}

function displayCourses() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      document.getElementById("course-list").innerHTML = "";

      const template = document.getElementById("course-row");
      db.collection("courses")
        .where("users", "array-contains", user.uid)
        .get()
        .then((courses) => {
          courses.forEach((doc) => {
            const courseTitle = doc.data().name;
            const code = doc.data().code;
            const endTime = doc.data().endTime;
            const location = doc.data().location;
            const startTime = doc.data().startTime;
            const zoomlink = doc.data().zoomlink;

            let newCourse = template.content.cloneNode(true);

            newCourse.querySelector(".course-item").setAttribute("id", doc.id);
            newCourse.querySelector(".course-title").innerHTML = courseTitle;

            document.getElementById("course-list").appendChild(newCourse); //where the new card gets attached
          });
        });
    } else {
      console.error("No user is signed in.");
    }
  });
}

displayCourses();

function populateInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid);
      currentUser.get().then((userDoc) => {
        if (name != null) {
          document.getElementById("new-course-name").value = name;
        }
        if (code != null) {
          document.getElementById("new-course-code").value = code;
        }
        if (location != null) {
          document.getElementById("new-course-location").value = location;
        }
        if (startTime != null) {
          document.getElementById("new-course-start-time").value = startTime;
        }
        if (endTime != null) {
          document.getElementById("new-course-end-time").value = endTime;
        }
        if (zoomlink != null) {
          document.getElementById("new-course-zoom-link").value = zoomlink;
        }
      });
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }

    const titleName = document.querySelector("#exampleModalLabel");
  });
}

function editCourseInfo() {
  //Enable the form fields
  document.getElementById("personalInfoFields").disabled = false;
}
