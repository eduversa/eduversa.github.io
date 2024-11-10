import FormField from "@/components/FormField";
import { devLog } from "@/utils/apiUtils";
import { BookOpen, Library, Type, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function RoomForm({ onSubmit, onCancel, currentData }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      building: "",
      type: "",
      capacity: "",
    },
  });

  useEffect(() => {
    if (currentData) reset(currentData);
  }, [currentData, reset]);

  const buildingNos = ["B1", "B2", "B3"];
  const roomTypes = [
    "Unavailable",
    "Faculty",
    "Computer Lab",
    "Science Lab",
    "Classroom",
    "Auditorium",
  ];
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-container">
          <h3 className="form__title">
            {currentData ? "Edit Room" : "Create New Room"}
          </h3>

          <FormField
            label={"Room Name"}
            icon={Library}
            error={errors.name?.message}
          >
            <input
              {...register("name", {
                required: "Room name is required",
                minLength: {
                  value: 1,
                  message: "Atleast 1 character",
                },
              })}
              className="form__input"
              placeholder="e.g., LG 3.1"
            />
          </FormField>

          <div className="form__group">
            <label className="form__label">
              <Building2 size={16} />
              Building
            </label>

            <select
              {...register("building", {
                required: "building is required",
              })}
            >
              <option value="" disabled selected hidden>
                Select a building
              </option>
              {buildingNos.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.building?.message && (
              <p className="form__error">{errors.building.message}</p>
            )}
          </div>

          <div className="form__group">
            <label className="form__label">
              <BookOpen size={16} />
              Type of room
            </label>

            <select
              {...register(
                "type",

                {
                  required: "Type is required",
                }
              )}
            >
              <option value="">Select the type of room</option>
              {roomTypes.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.type?.message && (
              <p className="form__error">{errors.type.message}</p>
            )}
          </div>

          {/* <FormField
                  label="Stream"
                  icon={GitBranch}
                  error={errors.stream?.message}
                >
                  <input
                    {...register("stream", {
                      required: "Stream is required",
                    })}
                    className="form__input"
                    placeholder="e.g., Computer Science and Technology"
                  />
                </FormField> */}

          <FormField
            label={"Room Capacity"}
            icon={Type}
            error={errors.capacity?.message}
          >
            <input
              {...register("capacity", {
                required: "Capacity of room is required",
              })}
              className="form__input"
              placeholder="60/70 members"
            />
          </FormField>
          <div className="form__actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="button button--primary button--icon"
            >
              {currentData ? "Confirm Edit" : "Create Room"}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="button button--secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
}

export default RoomForm;
