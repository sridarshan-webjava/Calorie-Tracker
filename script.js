const formSection = document.querySelector(".form-section");
const displaySection = document.querySelector(".display-section");
const input = document.querySelector("input");
const img = document.querySelector(".preview");
const displayImg = document.querySelector(".img-cal");
const text = document.querySelector(".img-text");
const calorieCount = document.querySelector(".display-title span");
const list = document.querySelector(".display-section ul");
const submitBtn = document.querySelector(".form-section .btn");
const resetBtn = document.querySelector(".display-section .btn");
const loadingScreen = document.querySelector(".loading-screen");
const formData = new FormData();

function toggleMainImage() {
  img.classList.toggle("show");
}

function toggleDisplayImage() {
  displayImg.classList.toggle("show");
}

function checkForInput() {
  console.log("Inside function");
  if (input.files.length > 0) {
    console.log(input.files);
    const url = URL.createObjectURL(input.files[0]);
    img.src = url;
    displayImg.src = url;
    if (
      !img.classList.contains("show") &&
      !displayImg.classList.contains("show")
    ) {
      toggleMainImage();
      toggleDisplayImage();
    }
    text.style.display = "none";
    submitBtn.disabled = false;
  }
}

function moveScreensForward() {
  formSection.classList.remove("backward");
  displaySection.classList.remove("backward");
  formSection.classList.add("forward");
  displaySection.classList.add("forward");
}

function moveScreensBackward() {
  formSection.classList.remove("forward");
  displaySection.classList.remove("forward");
  formSection.classList.add("backward");
  displaySection.classList.add("backward");
}

function setLoadingAnimation() {
  loadingScreen.classList.remove("hide");
  loadingScreen.classList.add("show");
}

function hideLoadingAnimation() {
  loadingScreen.classList.remove("show");
  loadingScreen.classList.add("hide");
}

function setTableData(foodItem, calories) {
  const li = document.createElement("li");
  const food = document.createElement("p");
  const calorie = document.createElement("p");
  const foodValue = document.createTextNode(foodItem);
  const calorieValue = document.createTextNode(calories);
  food.appendChild(foodValue);
  calorie.appendChild(calorieValue);
  li.append(food, calorie);
  list.appendChild(li);
}

function setData(data) {
  calorieCount.textContent = data.total;
  data.items.forEach(data => {
    setTableData(data[0], data[1]);
  });
}

function removeTableData() {
  const listItem = list.querySelector("li");
  list.innerHTML = "";
  list.appendChild(listItem);
}

function resetMainScreen() {
  input.value = "";
  console.log(input.files);
  formData.delete("image");
  img.removeAttribute("src");
  toggleMainImage();
  text.style.display = "block";
  submitBtn.disabled = true;
  moveScreensBackward();
}

function resetDisplayScreen() {
  displayImg.removeAttribute("src");
  toggleDisplayImage();
  removeTableData();
  calorieCount.textContent = "0";
}

submitBtn.addEventListener("click", e => {
  setLoadingAnimation();
  formData.append("image", input.files[0]);
  fetch("http://localhost:4000/", {
    method: "POST",
    body: formData,
  })
    .then(resp => resp.json())
    .then(data => {
      console.log(data);
      hideLoadingAnimation();
      setData(data);
      moveScreensForward();
    })
    .catch(e => console.log(e));
});

resetBtn.addEventListener("click", () => {
  resetMainScreen();
  moveScreensBackward();
  setTimeout(resetDisplayScreen, 750);
});

input.addEventListener("change", checkForInput);
