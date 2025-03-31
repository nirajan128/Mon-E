import { useState } from "react";
import "../../App.css";
import { useAuth } from "../../Context/AuthContext";

interface PostFormProps {
  title: "Income" | "Expenses"; // Restrict to valid options
  columns: string[];
  onSuccess: () => void; // Callback function to refresh parent list
}

function PostForm({ title, columns,onSuccess }: PostFormProps) {
    console.log("Rendering PostForm with title:", title);
    console.log(columns)

  const { token } = useAuth();
  const [formData, setFormData] = useState<Record<string, string | number>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!token) {
      console.error("Unauthorized: No token found.");
      return;
    }

    if (Object.keys(formData).length === 0) {
      console.error("Form is empty!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/valid/${title.toLowerCase()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log(`${title} added successfully!`);
        setFormData({}); // Reset form after successful submission
       onSuccess();
      } else {
        console.error(`Error adding ${title}`);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn addButton"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <i className="fas fa-plus"></i> {title}
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 modalLabel" id="exampleModalLabel">
                Add {title}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body postForm">
              <form>
                <div className="form-grid row justify-content-center">
                  {columns.map((column, index) => {
                    const isDateField = column.toLowerCase().includes("date");
                    return (
                      <div key={index} className="form-group col-auto mt-1">
                        <label className="form-label-sm formLabel">{column}</label>
                        <input
                          type={isDateField ? "datetime-local" : "text"} // Set date type dynamically
                          name={column}
                          className="form-control-sm formInput"
                          value={formData[column] || ""}
                          onChange={handleChange}
                        />
                      </div>
                    );
                  })}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostForm;
