import FormField from "@/components/FormField";
import { devLog } from "@/utils/apiUtils";
import { Hourglass, HourglassIcon, Library, User, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function CourseForm({ onSubmit, onCancel, currentData }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      fees: "",
      duration: "",
      total_seats: "",
    },
  });

  useEffect(() => {
    if (currentData) reset(currentData);
  }, [currentData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="form-container">
        <h3 className="form__title">Add New Course</h3>

        <FormField
          label={"Course name"}
          icon={Library}
          error={errors?.name?.message}
        >
          <input
            {...register("name", {
              required: "Course  name is required",
            })}
            className="form__input"
            placeholder="Bachelors in AI and DS"
          />
        </FormField>

        <FormField
          label={"Fees"}
          icon={HourglassIcon}
          error={errors?.fees?.message}
        >
          <input
            {...register("fees", {
              required: "Fees is required",
            })}
            className="form__input"
            placeholder="70,000"
          />
        </FormField>

        <FormField
          label={"Duration"}
          icon={Hourglass}
          error={errors?.duration?.message}
        >
          <input
            {...register("duration", {
              required: "Duration is required",
            })}
            className="form__input"
            placeholder="4 years"
          />
        </FormField>

        <FormField
          label={"Total Seats"}
          icon={User}
          error={errors?.total_seats?.message}
        >
          <input
            {...register("total_seats", {
              required: "Total seats is required",
            })}
            className="form__input"
            placeholder="120"
          />
        </FormField>

        <div className="form__actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="button button--primary button--icon"
          >
            Create Course
          </button>

          <button
            type="button"
            className="button button--secondary "
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
