import React, { useState, useRef } from "react";

const ThoughtForm = () => {
  const [formState, setFormState] = useState({
    username: "",
    thought: "",
    image: "",
  });
  const [characterCount, setCharacterCount] = useState(0);
  const fileInput = useRef(null);

  const getUploadUrl = async () => {
    const res = await fetch(
      "https://5panwslpf6.execute-api.us-east-2.amazonaws.com/Prod/api/pre-url"
    );
    const jsonRes = await res.json();
    console.log(jsonRes);

    return jsonRes;
  };

  const setImageData = async (objectURL) => {
    
    return await setFormState({ ...formState, image: objectURL });
  };

  const handleImageUpload = async (event) => {
    event.preventDefault();
    const file = fileInput.current.files[0];
    // retrieve the URL and file name
    // console.log(file);
    try {
      var { uploadURL, publicURL } = await getUploadUrl();
    } catch (err) {
      console.error(err);
    }
    const setRes = await setImageData(publicURL);

    try {
      var result = await fetch(uploadURL, {
        method: "PUT",
        body: file,
      });
      console.log("result: ", result);
    } catch (err) {
      console.error(err);
    }

    if (setRes) {
      console.log("publicURL: ", publicURL);
      console.log("formState: ", formState);
    }

    return formState;
  };

  // update state based on form input changes
  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setFormState({ ...formState, [event.target.name]: event.target.value });
      setCharacterCount(event.target.value.length);
    }
  };

  // Invoked when Submit button is clicked
  const handleFormSubmit = (event) => {
    event.preventDefault();

    const postData = async () => {
      const res = await fetch(
        "https://5panwslpf6.execute-api.us-east-2.amazonaws.com/Prod/api/users",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        }
      );
      const data = await res.json();
      console.log("Submit: ", formState);
    };

    postData();

    // clear form value
    setFormState({ username: "", thought: "", image: "" });
    setCharacterCount(0);
  };

  return (
    <div>
      <p className={`m-0 ${characterCount === 280 ? "text-error" : ""}`}>
        Character Count: {characterCount}/280
      </p>
      <form
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <input
          placeholder="Name"
          name="username"
          value={formState.username}
          className="form-input col-12 "
          onChange={handleChange}
        ></input>
        <textarea
          placeholder="Here's a new thought..."
          name="thought"
          value={formState.thought}
          className="form-input col-12 "
          onChange={handleChange}
        ></textarea>
        <label className="form-input col-12  p-1">
          Add an image to your thought:
          <input type="file" ref={fileInput} className="form-input p-2 " />
          <button className="btn " onClick={handleImageUpload} type="submit">
            Upload
          </button>
        </label>

        <button className="btn col-12 " type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
