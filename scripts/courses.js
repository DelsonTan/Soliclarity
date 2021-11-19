function createCourse() {
  //define a variable for the collection you want to create in Firestore to populate data
  const name = document.getElementById("new-course-name").value;
  const code = document.getElementById("new-course-code").value;
  const location = document.getElementById("new-course-location").value;
  const startTime = document.getElementById("new-course-start-time").value;
  const endtime = document.getElementById("new-course-end-time").value;

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const currentUser = db.collection("users").doc(user.uid);

      currentUser.get().then(async () => {
        await db.collection("courses").add({
          name,
          code,
          location,
          startTime,
          endtime,
          users: [user.uid],
        });
        displayCourses();
      });
    } else {
      console.log("no user signed in");
    }
  });
}

function displayCourses() {
  document.getElementById("course-list").innerHTML = "";

  const template = document.getElementById("course-row");

  db.collection("courses")
    .get()
    .then((courses) => {
      courses.forEach((doc) => {
        console.log(doc.data());
        const courseTitle = doc.data().name;
        const code = doc.data().code;
        const endTime = doc.data().endTime;
        const location = doc.data().location;
        const startTime = doc.data().startTime;

        let newCourse = template.content.cloneNode(true);

        newCourse.querySelector(".course-item").setAttribute("id", doc.id);
        newCourse.querySelector(".course-title").innerHTML = courseTitle;

        document.getElementById("course-list").appendChild(newCourse); //where the new card gets attached
      });
    });
}

displayCourses();
