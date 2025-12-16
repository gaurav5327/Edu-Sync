"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:3000/api";

function FieldWorkManager() {
  const [fieldWorks, setFieldWorks] = useState([]);
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingFieldWork, setEditingFieldWork] = useState(null);

  const [formData, setFormData] = useState({
    student: "",
    supervisor: "",
    type: "field_work",
    organization: {
      name: "",
      type: "",
      address: "",
      mentor: "",
      contact: "",
    },
    duration: {
      startDate: "",
      endDate: "",
      totalWeeks: 0,
    },
    objectives: [],
    credits: 0,
  });

  useEffect(() => {
    fetchFieldWorks();
    fetchStudents();
    fetchSupervisors();
  }, []);

  const fetchFieldWorks = async () => {
    try {
      const response = await axios.get(`${API_URL}/field-works`);
      setFieldWorks(response.data);
    } catch (error) {
      console.error("Error fetching field works:", error);
      toast.error("Error fetching field works");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchSupervisors = async () => {
    try {
      const response = await axios.get(`${API_URL}/users?role=teacher`);
      setSupervisors(response.data);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingFieldWork) {
        await axios.put(
          `${API_URL}/field-works/${editingFieldWork._id}`,
          formData
        );
        toast.success("Field work updated successfully");
      } else {
        await axios.post(`${API_URL}/field-works`, formData);
        toast.success("Field work created successfully");
      }

      resetForm();
      fetchFieldWorks();
    } catch (error) {
      console.error("Error saving field work:", error);
      toast.error(error.response?.data?.message || "Error saving field work");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      student: "",
      supervisor: "",
      type: "field_work",
      organization: {
        name: "",
        type: "",
        address: "",
        mentor: "",
        contact: "",
      },
      duration: {
        startDate: "",
        endDate: "",
        totalWeeks: 0,
      },
      objectives: [],
      credits: 0,
    });
    setEditingFieldWork(null);
    setShowForm(false);
  };

  const handleEdit = (fieldWork) => {
    setFormData(fieldWork);
    setEditingFieldWork(fieldWork);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this field work?")) {
      try {
        await axios.delete(`${API_URL}/field-works/${id}`);
        toast.success("Field work deleted successfully");
        fetchFieldWorks();
      } catch (error) {
        console.error("Error deleting field work:", error);
        toast.error("Error deleting field work");
      }
    }
  };

  const addObjective = () => {
    setFormData({
      ...formData,
      objectives: [...formData.objectives, ""],
    });
  };

  const updateObjective = (index, value) => {
    const updatedObjectives = [...formData.objectives];
    updatedObjectives[index] = value;
    setFormData({ ...formData, objectives: updatedObjectives });
  };

  const removeObjective = (index) => {
    const updatedObjectives = formData.objectives.filter((_, i) => i !== index);
    setFormData({ ...formData, objectives: updatedObjectives });
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          Field Work & Internship Management
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add Field Work
        </button>
      </div>



      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">
              {editingFieldWork ? "Edit Field Work" : "Add Field Work"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student
                  </label>
                  <select
                    value={formData.student}
                    onChange={(e) =>
                      setFormData({ ...formData, student: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name} - {student.program} Year {student.year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supervisor
                  </label>
                  <select
                    value={formData.supervisor}
                    onChange={(e) =>
                      setFormData({ ...formData, supervisor: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Select Supervisor</option>
                    {supervisors.map((supervisor) => (
                      <option key={supervisor._id} value={supervisor._id}>
                        {supervisor.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="field_work">Field Work</option>
                    <option value="internship">Internship</option>
                    <option value="project">Project</option>
                    <option value="community_service">Community Service</option>
                  </select>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-3">
                  Organization Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={formData.organization.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: {
                            ...formData.organization,
                            name: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Type
                    </label>
                    <input
                      type="text"
                      placeholder="NGO, Corporate, Government, etc."
                      value={formData.organization.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: {
                            ...formData.organization,
                            type: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.organization.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: {
                            ...formData.organization,
                            address: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mentor
                    </label>
                    <input
                      type="text"
                      value={formData.organization.mentor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: {
                            ...formData.organization,
                            mentor: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Information
                    </label>
                    <input
                      type="text"
                      value={formData.organization.contact}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: {
                            ...formData.organization,
                            contact: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-3">Duration</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.duration.startDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: {
                            ...formData.duration,
                            startDate: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.duration.endDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: {
                            ...formData.duration,
                            endDate: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Weeks
                    </label>
                    <input
                      type="number"
                      value={formData.duration.totalWeeks}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: {
                            ...formData.duration,
                            totalWeeks: e.target.value
                              ? Number.parseInt(e.target.value)
                              : 0,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold">Objectives</h4>
                  <button
                    type="button"
                    onClick={addObjective}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Add Objective
                  </button>
                </div>

                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Enter objective"
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credits
                </label>
                <input
                  type="number"
                  value={formData.credits}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credits: e.target.value
                        ? Number.parseInt(e.target.value)
                        : 0,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  min="0"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editingFieldWork
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {fieldWorks.map((fieldWork) => (
            <li key={fieldWork._id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-indigo-600">
                      {fieldWork.student?.name} - {fieldWork.type}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          fieldWork.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : fieldWork.status === "ongoing"
                            ? "bg-blue-100 text-blue-800"
                            : fieldWork.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {fieldWork.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Organization: {fieldWork.organization.name}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        Type: {fieldWork.organization.type}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Credits: {fieldWork.credits} | Duration:{" "}
                        {fieldWork.duration.totalWeeks} weeks
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(fieldWork)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(fieldWork._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FieldWorkManager;
