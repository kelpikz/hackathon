let editorDocument = document.querySelector("#myeditor .editor");

const changeEditor = (itemName, type, value) => {
  let item = document.getElementById(itemName);
  if (item)
    if (item.classList.contains("active")) item.classList.remove("active");
    else item.classList.add("active");

  document.execCommand(type, false, value);
  editorDocument.focus();
};

const clearText = () => {
  editorDocument.innerHTML = "";
  editorDocument.focus();
};

editorDocument.contentEditable = true;

const createBlog = (public) => {
  let title = document.getElementById("title").value;
  let body = editorDocument.innerHTML;
  let author = "test Author edited";
  let imageURL = document.getElementById("imglink").value;
  let header = document.getElementById("headerText").value;
  let layout = Number(document.getElementById("layoutId").value);
  let id = document.getElementsByTagName("form")[0].dataset.blogid;
  fetch(`http://localhost:3000/blog/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json", //* Tells the type of content the client can understand
      "Content-type": "application/json", //* What kind of data we are sending through the body
    },
    body: JSON.stringify({
      title,
      body,
      author,
      public: public,
      imageURL,
      header,
      layout,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => (location.href = `http://localhost:3000/blog/${data._id}`))
    .catch((err) => console.log(err));
};
