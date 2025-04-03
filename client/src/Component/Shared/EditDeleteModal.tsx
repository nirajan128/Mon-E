import { useState } from "react";
import "../../App.css";
import { useAuth } from "../../Context/AuthContext";

interface ModalProps {
  title: "Income" | "Expenses";
  columns: string[];
  data: Record<string, any>; // Existing data for editing
  onSuccess: () => void;
}

export function EditModal({ title, columns, data, onSuccess }: ModalProps) {
  const { token } = useAuth();
  const [formData, setFormData] = useState(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!token) {
      console.error("Unauthorized: No token found.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/valid/${title.toLowerCase()}/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log(`${title} updated successfully!`);
        onSuccess();
      } else {
        console.error(`Error updating ${title}`);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit {title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            {columns.map((column, index) => (
              <div key={index} className="mb-2">
                <label className="form-label">{column}</label>
                <input
                  type="text"
                  name={column}
                  className="form-control"
                  value={formData[column] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DeleteModal({ title, data, onSuccess }: { title: "Income" | "Expenses"; data: { id: number }; onSuccess: () => void }) {
  const { token } = useAuth();

  const handleDelete = async () => {
    if (!token) {
      console.error("Unauthorized: No token found.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/valid/${title.toLowerCase()}/${data.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log(`${title} deleted successfully!`);
        onSuccess();
      } else {
        console.error(`Error deleting ${title}`);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete {title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            Are you sure you want to delete this {title} entry?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}